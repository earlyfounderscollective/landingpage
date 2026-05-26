import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";

const bodySchema = z.object({
  email: z.string().email().optional(),
  applicationId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !env.stripePriceId) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 },
    );
  }

  let parsed: z.infer<typeof bodySchema> = {};
  try {
    const json = await req.json().catch(() => ({}));
    parsed = bodySchema.parse(json ?? {});
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: env.stripePriceId, quantity: 1 }],
      customer_email: parsed.email,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${env.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}/cancel`,
      metadata: {
        application_id: parsed.applicationId ?? "",
      },
      subscription_data: {
        metadata: {
          application_id: parsed.applicationId ?? "",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout creation failed", e);
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 },
    );
  }
}
