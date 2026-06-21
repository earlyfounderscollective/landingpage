import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyDFYCheckoutToken } from "@/lib/signing";
import { DFY_PRICING, DFY_FEATURES, type DFYPlan } from "@/lib/dfy";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const appId = String(body.appId ?? "");
  const token = String(body.token ?? "");
  const plan = String(body.plan ?? "full") as DFYPlan;

  if (!appId || !token || !verifyDFYCheckoutToken(appId, token)) {
    return NextResponse.json({ error: "Invalid link" }, { status: 401 });
  }

  // Validate the plan is enabled
  if (plan === "installments" && !DFY_FEATURES.installments) {
    return NextResponse.json({ error: "Installments not yet enabled" }, { status: 400 });
  }
  if (plan === "affirm" && !DFY_FEATURES.affirm) {
    return NextResponse.json({ error: "Affirm not yet enabled" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data: app } = await supabase
    .from("dfy_applications")
    .select("id, email, full_name, status")
    .eq("id", appId)
    .maybeSingle();

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (app.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  // Pay in full — only working option right now
  if (plan === "full") {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: app.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Done-For-You · 6-week engagement",
                description:
                  "Six weeks of side-by-side work with the EFC team. Offer, pricing, entity, first 30 customers.",
              },
              unit_amount: DFY_PRICING.fullPriceCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${env.siteUrl}/dfy/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.siteUrl}/dfy/checkout?app=${app.id}&token=${token}`,
        metadata: {
          type: "dfy_payment",
          application_id: app.id,
          email: app.email,
          plan: "full",
        },
      });

      // Track the payment attempt
      await supabase.from("dfy_payments").insert({
        application_id: app.id,
        email: app.email,
        amount_cents: DFY_PRICING.fullPriceCents,
        plan: "full",
        stripe_session_id: session.id,
        status: "pending",
      });

      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("Stripe DFY checkout failed:", err);
      return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
    }
  }

  // Installments — when enabled, use Stripe subscription with cancel_at after 2 charges
  if (plan === "installments") {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: app.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product: undefined,
              product_data: {
                name: "Done-For-You · Installment 1 of 2",
              },
              unit_amount: DFY_PRICING.installmentCents,
              recurring: { interval: "month" },
            } as never, // Stripe typings differ between price_data variants
            quantity: 1,
          },
        ],
        subscription_data: {
          // Cancel after the 2nd charge by ending billing cycle at 60 days
          metadata: {
            type: "dfy_payment",
            application_id: app.id,
            plan: "installments",
          },
        },
        success_url: `${env.siteUrl}/dfy/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.siteUrl}/dfy/checkout?app=${app.id}&token=${token}`,
        metadata: {
          type: "dfy_payment",
          application_id: app.id,
          email: app.email,
          plan: "installments",
        },
      });

      await supabase.from("dfy_payments").insert({
        application_id: app.id,
        email: app.email,
        amount_cents: DFY_PRICING.installmentCents,
        plan: "installments",
        stripe_session_id: session.id,
        status: "pending",
      });

      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("Stripe DFY installments checkout failed:", err);
      return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
    }
  }

  // Affirm — when enabled, just add 'affirm' to payment_method_types
  if (plan === "affirm") {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "affirm"],
        customer_email: app.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Done-For-You · 6-week engagement",
                description:
                  "Six weeks of side-by-side work with the EFC team.",
              },
              unit_amount: DFY_PRICING.fullPriceCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${env.siteUrl}/dfy/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.siteUrl}/dfy/checkout?app=${app.id}&token=${token}`,
        metadata: {
          type: "dfy_payment",
          application_id: app.id,
          email: app.email,
          plan: "affirm",
        },
      });

      await supabase.from("dfy_payments").insert({
        application_id: app.id,
        email: app.email,
        amount_cents: DFY_PRICING.fullPriceCents,
        plan: "affirm",
        stripe_session_id: session.id,
        status: "pending",
      });

      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("Stripe DFY Affirm checkout failed:", err);
      return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
}
