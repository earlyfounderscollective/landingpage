import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { BOOTCAMP } from "@/lib/bootcamp";

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
  const source = String(body.source ?? "direct").trim().slice(0, 60);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
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
              name: "The Bootcamp · 4-week cohort",
              description: `${BOOTCAMP.durationLabel} group cohort starting ${BOOTCAMP.nextCohort.startDate}. Includes Build Your Business Kit, Slack room, and office hours.`,
            },
            unit_amount: BOOTCAMP.priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.siteUrl}/bootcamp/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}/bootcamp?abandoned=1`,
      metadata: {
        type: "bootcamp_order",
        email,
        name,
        source,
        cohort: BOOTCAMP.nextCohort.startDate,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe bootcamp checkout failed:", err);
    return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
  }
}
