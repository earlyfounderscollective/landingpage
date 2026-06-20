import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const FULL_PRICE_CENTS = 9700;
const REGISTRANT_PRICE_CENTS = 4700;
const BUMP_PRICE_CENTS = 1700;

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim().slice(0, 200);
  const bump = body.bump === true;
  const source = String(body.source ?? "cold").trim().slice(0, 60);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  // Verify whether the email is in training_registrations to set price.
  let isRegistrant = false;
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("training_registrations")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    isRegistrant = Boolean(data);
  }

  const kitPrice = isRegistrant ? REGISTRANT_PRICE_CENTS : FULL_PRICE_CENTS;

  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  }[] = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Build Your Business Kit",
          description:
            "Worksheets, templates, AI prompts, and the playbook to set up your business in a weekend.",
        },
        unit_amount: kitPrice,
      },
      quantity: 1,
    },
  ];

  if (bump) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Premium Sales & Systems Checklist",
          description:
            "Expanded version with scripts, objection responses, and negotiation templates.",
        },
        unit_amount: BUMP_PRICE_CENTS,
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: lineItems,
      success_url: `${env.siteUrl}/kit/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}/kit?abandoned=1${email ? `&email=${encodeURIComponent(email)}` : ""}`,
      metadata: {
        type: "kit_order",
        email,
        name,
        bump_included: bump ? "true" : "false",
        bump_amount_cents: bump ? String(BUMP_PRICE_CENTS) : "0",
        kit_price_cents: String(kitPrice),
        source,
        is_registrant: isRegistrant ? "true" : "false",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe kit checkout failed:", err);
    return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
  }
}
