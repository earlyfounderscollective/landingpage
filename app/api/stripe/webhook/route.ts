import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/emails";
import { createMagicToken } from "@/lib/kit-auth";
import { sendKitWelcomeEmail } from "@/lib/kit-emails";
import {
  sendRecoveryEmail,
  type ProductType,
  type RecoveryKind,
} from "@/lib/recovery-emails";
import { signDFYCheckoutToken } from "@/lib/signing";
import { getOrCreateReferralCode, recordRedemption } from "@/lib/referrals";
import { sendAdminPaymentNotification } from "@/lib/admin-payment-notification";

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
      // Normalize to lowercase at the source. Every downstream lookup
      // (isKitBuyer, magic tokens, session cookie) lowercases the email, so
      // storing it mixed-case here would silently lock out any buyer who
      // typed a capital letter at checkout. Email addresses are effectively
      // case-insensitive, so this is safe for sending too.
      const rawEmail =
        session.customer_details?.email ?? session.customer_email ?? null;
      const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
      const metaType = session.metadata?.type || null;

      // Kit order — record in kit_orders + send welcome email with magic link
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

          // Send the welcome email with a sign-in link to the kit dashboard
          const token = await createMagicToken(email);
          if (token) {
            const magicLink = `${env.siteUrl}/api/kit/access/verify?token=${token}`;
            const name = session.metadata?.name || session.customer_details?.name || "";
            await sendKitWelcomeEmail(email, name, magicLink).catch(() => null);
          }

          // Admin notification
          await sendAdminPaymentNotification({
            product: "kit_order",
            email,
            name: session.metadata?.name || session.customer_details?.name || null,
            amountCents: amountTotal,
            source: session.metadata?.source || null,
            stripeSessionId: session.id,
          }).catch(() => null);
        }
        return NextResponse.json({ received: true });
      }

      // Bootcamp purchase
      if (metaType === "bootcamp_order") {
        if (supabase && email) {
          const refCodeUsed = session.metadata?.ref_code || null;
          const cohortStartDate = session.metadata?.cohort_start_date || null;

          const { data: orderRow } = await supabase
            .from("bootcamp_orders")
            .insert({
              email,
              full_name: session.metadata?.name || null,
              cohort: session.metadata?.cohort || null,
              amount_cents: session.amount_total ?? 49_700,
              stripe_session_id: session.id,
              stripe_payment_intent_id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent?.id ?? null,
              source: session.metadata?.source || null,
              status: "completed",
              referred_by_code: refCodeUsed || null,
            })
            .select("id")
            .single();

          // Bootcamp buyers get full kit access — seed a kit_orders row so
          // they pass the isKitBuyer check, then email them the access link.
          const { data: existingKit } = await supabase
            .from("kit_orders")
            .select("id")
            .eq("email", email)
            .limit(1)
            .maybeSingle();

          if (!existingKit) {
            await supabase.from("kit_orders").insert({
              email,
              full_name: session.metadata?.name || null,
              amount_cents: 0,
              status: "completed",
              source: "bootcamp",
            });
          }

          // Issue a fresh referral code to this grad. Idempotent on email.
          await getOrCreateReferralCode(email, orderRow?.id ?? null).catch(() => null);

          // If this purchase used a referral, log it for payout.
          if (refCodeUsed) {
            await recordRedemption({
              code: refCodeUsed,
              friendEmail: email,
              friendOrderId: orderRow?.id ?? null,
              cohortStartDate,
            }).catch(() => null);
          }

          const token = await createMagicToken(email);
          if (token) {
            const magicLink = `${env.siteUrl}/api/kit/access/verify?token=${token}`;
            const name = session.metadata?.name || session.customer_details?.name || "";
            await sendKitWelcomeEmail(email, name, magicLink).catch(() => null);
          }

          // Admin notification
          await sendAdminPaymentNotification({
            product: "bootcamp_order",
            email,
            name: session.metadata?.name || session.customer_details?.name || null,
            amountCents: session.amount_total ?? 49_700,
            source: session.metadata?.source || null,
            refCode: refCodeUsed || null,
            stripeSessionId: session.id,
          }).catch(() => null);
        }
        return NextResponse.json({ received: true });
      }

      // Done-For-You payment
      if (metaType === "dfy_payment") {
        const applicationId = session.metadata?.application_id || null;
        if (supabase && email && applicationId) {
          await supabase
            .from("dfy_payments")
            .update({
              status: "completed",
              stripe_payment_intent_id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent?.id ?? null,
              paid_at: new Date().toISOString(),
            })
            .eq("stripe_session_id", session.id);

          await supabase
            .from("dfy_applications")
            .update({ status: "paid" })
            .eq("id", applicationId);

          // Admin notification
          await sendAdminPaymentNotification({
            product: "dfy_payment",
            email,
            name: session.metadata?.name || session.customer_details?.name || null,
            amountCents: session.amount_total ?? 0,
            source: session.metadata?.plan || "full",
            stripeSessionId: session.id,
          }).catch(() => null);
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

        // Admin notification
        if (email) {
          await sendAdminPaymentNotification({
            product: "training_vip",
            email,
            name: session.metadata?.name || session.customer_details?.name || null,
            amountCents: amountTotal,
            source: "training_upgrade",
            stripeSessionId: session.id,
          }).catch(() => null);
        }
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

    // Recovery: session expired (user abandoned checkout) OR async payment
    // failed (e.g. card declined). One recovery email per session per kind,
    // deduped via the (stripe_session_id, recovery_type) unique constraint.
    if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email ?? session.customer_email ?? null;
      const metaType = (session.metadata?.type ?? null) as ProductType | null;

      // Only recover for our known products with a known email
      if (
        email &&
        metaType &&
        ["kit_order", "bootcamp_order", "dfy_payment", "training_vip"].includes(
          metaType,
        )
      ) {
        const recoveryKind: RecoveryKind =
          event.type === "checkout.session.expired" ? "expired" : "declined";

        // Dedup — don't send twice for the same session+kind
        let alreadySent = false;
        if (supabase) {
          const { data } = await supabase
            .from("payment_recovery_log")
            .select("id")
            .eq("stripe_session_id", session.id)
            .eq("recovery_type", recoveryKind)
            .maybeSingle();
          alreadySent = Boolean(data);
        }

        if (!alreadySent) {
          const applicationId = session.metadata?.application_id ?? null;
          const dfyToken = applicationId
            ? signDFYCheckoutToken(applicationId)
            : null;

          try {
            await sendRecoveryEmail({
              email,
              name:
                session.metadata?.name || session.customer_details?.name || "",
              productType: metaType,
              recoveryKind,
              applicationId,
              dfyToken,
            });
          } catch (err) {
            console.error("Recovery email failed (non-blocking):", err);
          }

          if (supabase) {
            await supabase.from("payment_recovery_log").insert({
              email,
              product_type: metaType,
              stripe_session_id: session.id,
              recovery_type: recoveryKind,
              amount_cents: session.amount_total ?? null,
              metadata: {
                application_id: applicationId,
                source: session.metadata?.source ?? null,
              },
            });
          }
        }
      }
      return NextResponse.json({ received: true });
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
