import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getActiveTrainingEvent } from "@/lib/training";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim().slice(0, 200);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  // Verify they're actually a registrant before letting them upgrade.
  const event = await getActiveTrainingEvent();
  const supabase = getSupabaseAdmin();
  let registrationId: string | null = null;

  if (supabase && event) {
    const { data: registration } = await supabase
      .from("training_registrations")
      .select("id")
      .eq("email", email)
      .eq("event_id", event.id)
      .maybeSingle();
    if (registration) {
      registrationId = registration.id;
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Training VIP — Lifetime Access",
              description:
                "Replay forever + searchable transcript of the live training",
            },
            unit_amount: 1700,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.siteUrl}/training/confirmed?session_id={CHECKOUT_SESSION_ID}&vip=1`,
      cancel_url: `${env.siteUrl}/training/upgrade?email=${encodeURIComponent(email)}${name ? `&name=${encodeURIComponent(name)}` : ""}`,
      metadata: {
        type: "training_vip",
        email,
        name,
        registration_id: registrationId ?? "",
        event_id: event?.id ?? "",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe VIP checkout failed:", err);
    return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
  }
}
