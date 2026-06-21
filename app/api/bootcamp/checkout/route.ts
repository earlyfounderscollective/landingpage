import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getBootcampConfig, formatCohortDate } from "@/lib/bootcamp";
import { lookupReferralCode, REFERRAL } from "@/lib/referrals";

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
  const refCodeRaw = String(body.ref ?? "").trim().toUpperCase().slice(0, 32);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const config = await getBootcampConfig();
  if (!config.isOpen) {
    return NextResponse.json(
      { error: "Reservations are currently closed for this cohort." },
      { status: 400 },
    );
  }

  // Look up referral code and apply discount if valid.
  // Self-referral is blocked — grads can't redeem their own code.
  let validRefCode: string | null = null;
  let discountCents = 0;
  if (refCodeRaw) {
    const found = await lookupReferralCode(refCodeRaw);
    if (found && found.gradEmail !== email) {
      validRefCode = found.code;
      discountCents = REFERRAL.friendDiscountCents;
    }
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const cohortLabel = formatCohortDate(config.cohortStartDate) || "next cohort";
  const finalPriceCents = Math.max(0, config.priceCents - discountCents);
  const productDescription =
    `Cohort starting ${cohortLabel}. Includes Business Builder Toolkit, live sessions, recordings, office hours, and the founder community.` +
    (validRefCode ? ` · Referral discount applied.` : "");

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
              name: validRefCode
                ? "Founders Foundation · 4-week program (Referred)"
                : "Founders Foundation · 4-week program",
              description: productDescription,
            },
            unit_amount: finalPriceCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.siteUrl}/bootcamp/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}/bootcamp${validRefCode ? `?ref=${validRefCode}&` : "?"}abandoned=1`,
      metadata: {
        type: "bootcamp_order",
        email,
        name,
        source,
        cohort: cohortLabel,
        cohort_start_date: config.cohortStartDate ?? "",
        ref_code: validRefCode ?? "",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, applied_ref: validRefCode });
  } catch (err) {
    console.error("Stripe bootcamp checkout failed:", err);
    return NextResponse.json({ error: "Couldn't start checkout" }, { status: 500 });
  }
}
