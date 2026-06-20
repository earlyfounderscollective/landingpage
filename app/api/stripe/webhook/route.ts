import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, env.stripeWebhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = idOrString(session.customer);
      const email =
        session.customer_details?.email ?? session.customer_email ?? null;
      const metaType = session.metadata?.type || null;

      // Kit order — record in kit_orders + send welcome email later
      if (metaType === "kit_order") {
        if (supabase && email) {
          const kitPrice = Number(session.metadata?.kit_price_cents ?? 0);
          const bumpCents = Number(session.metadata?.bump_amount_cents ?? 0);
          const bumpIncluded = session.metadata?.bump_included === "true";
          const amountTotal = session.amount_total ?? kitPrice + bumpCents;
          await supabase.from("kit_orders").insert({
            email,
            full_name: session.metadata?.name || null,
            amount_cents: amountTotal,
            bump_included: bumpIncluded,
            bump_amount_cents: bumpIncluded ? bumpCents : null,
            stripe_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
            source: session.metadata?.source || null,
            status: "completed",
          });
        }
        return NextResponse.json({ received: true });
      }

      // Training VIP purchase — separate handler
      if (metaType === "training_vip") {
        const eventId = session.metadata?.event_id || null;
        const amountTotal = session.amount_total ?? 1700;
        if (supabase && email && eventId) {
          await supabase
            .from("training_registrations")
            .update({
              vip: true,
              vip_amount_cents: amountTotal,
              vip_purchased_at: new Date().toISOString(),
            })
            .eq("email", email)
            .eq("event_id", eventId);
        }
        // No additional welcome email here — /training/confirmed delivers
        // the VIP confirmation. (Optionally we could send a receipt; Stripe
        // already sends its own.)
        return NextResponse.json({ received: true });
      }

      // EFC membership purchase (the existing path)
      const applicationId = session.metadata?.application_id || null;

      if (supabase) {
        const update = {
          paid: true,
          status: "active",
          stripe_customer_id: customerId,
        };

        if (applicationId) {
          await supabase
            .from("applications")
            .update(update)
            .eq("id", applicationId);
        } else if (email) {
          await supabase.from("applications").update(update).eq("email", email);
        }
      }

      if (email) {
        const fullName = session.customer_details?.name ?? undefined;
        await sendWelcomeEmail(email, fullName);
      }
    }

    if (
      event.type === "customer.subscription.deleted" ||
      (event.type === "customer.subscription.updated" &&
        (event.data.object as Stripe.Subscription).status === "canceled")
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = idOrString(sub.customer);
      // TODO: hook into community platform here once chosen
      // e.g. await removeCircleMember({ stripeCustomerId: customerId });

      if (supabase && customerId) {
        await supabase
          .from("applications")
          .update({ paid: false, status: "cancelled" })
          .eq("stripe_customer_id", customerId);
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = idOrString(invoice.customer);

      // Stripe retries cards automatically. We mark the row as past_due so
      // the admin can see at a glance; we DON'T remove community access yet —
      // that should happen on `customer.subscription.deleted` after the
      // dunning window closes.
      if (supabase && customerId) {
        await supabase
          .from("applications")
          .update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

function idOrString(
  v: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined,
): string | null {
  if (!v) return null;
  return typeof v === "string" ? v : v.id;
}
