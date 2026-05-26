import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { verifyDecisionToken } from "@/lib/signing";
import {
  sendAcceptanceEmail,
  sendDeclineEmail,
  sendWaitlistEmail,
} from "@/lib/emails";

const querySchema = z.object({
  action: z.enum(["accept", "decline", "waitlist"]),
  token: z.string().min(10),
});

type Action = z.infer<typeof querySchema>["action"];

const statusFor: Record<Action, string> = {
  accept: "accepted",
  decline: "declined",
  waitlist: "waitlisted",
};

const headlineFor: Record<Action, string> = {
  accept: "Accepted. Payment link sent",
  decline: "Application declined",
  waitlist: "Moved to waitlist",
};

const bodyFor: Record<Action, string> = {
  accept:
    "The applicant just received their acceptance email with a Stripe checkout link. You'll get a notification when payment completes.",
  decline:
    "The applicant just received a respectful decline note. Their application status is now marked as declined.",
  waitlist:
    "The applicant just received a friendly waitlist note. Their application status is now marked as waitlisted.",
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    action: url.searchParams.get("action"),
    token: url.searchParams.get("token"),
  });

  if (!parsed.success) {
    return page("Invalid request", "The link looks malformed.", "error");
  }

  const { action, token } = parsed.data;
  const id = params.id;

  if (!verifyDecisionToken(id, action, token)) {
    return page(
      "Link expired or invalid",
      "This decision link couldn't be verified. If you've already clicked it once, the decision has already been recorded.",
      "error",
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return page(
      "Supabase not configured",
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY so applications can be loaded.",
      "error",
    );
  }

  const { data: applicant, error: fetchError } = await supabase
    .from("applications")
    .select("id, full_name, email, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !applicant) {
    return page(
      "Application not found",
      "We couldn't find this application. It may have been deleted.",
      "error",
    );
  }

  // Build a Stripe checkout link for accept actions
  let checkoutUrl: string | null = null;
  if (action === "accept") {
    const stripe = getStripe();
    if (stripe && env.stripePriceId) {
      try {
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: env.stripePriceId, quantity: 1 }],
          customer_email: applicant.email,
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          success_url: `${env.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.siteUrl}/cancel`,
          metadata: { application_id: applicant.id },
          subscription_data: {
            metadata: { application_id: applicant.id },
          },
        });
        checkoutUrl = session.url ?? null;
      } catch (e) {
        console.error("Stripe checkout creation failed during accept", e);
      }
    }
  }

  // Send the appropriate email
  try {
    if (action === "accept") {
      await sendAcceptanceEmail(
        { email: applicant.email, fullName: applicant.full_name },
        checkoutUrl,
      );
    } else if (action === "decline") {
      await sendDeclineEmail({
        email: applicant.email,
        fullName: applicant.full_name,
      });
    } else {
      await sendWaitlistEmail({
        email: applicant.email,
        fullName: applicant.full_name,
      });
    }
  } catch (e) {
    console.error("Resend send failed during decision", e);
    return page(
      "Email send failed",
      "The status update succeeded but the email to the applicant did not. Check Resend logs.",
      "error",
    );
  }

  // Update Supabase status
  const { error: updateError } = await supabase
    .from("applications")
    .update({ status: statusFor[action] })
    .eq("id", id);

  if (updateError) {
    console.error("Supabase status update failed", updateError);
  }

  return page(headlineFor[action], bodyFor[action], "success", {
    name: applicant.full_name,
    email: applicant.email,
  });
}

function page(
  title: string,
  body: string,
  tone: "success" | "error",
  applicant?: { name: string; email: string },
) {
  const accent = tone === "success" ? "#23352D" : "#8B2E1F";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)} · Early Founders Collective</title>
    <style>
      body { margin:0; background:#F7F2EA; color:#111111; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
      .card { background:#FFFFFF; border:1px solid rgba(17,17,17,0.07); border-radius:18px; max-width:520px; width:100%; padding:48px 40px; box-shadow:0 1px 0 rgba(17,17,17,0.04), 0 14px 36px -18px rgba(17,17,17,0.15); }
      .eyebrow { font-size:11px; font-weight:500; letter-spacing:0.28em; text-transform:uppercase; color:${accent}; margin:0 0 18px 0; }
      h1 { font-family: ui-serif, Georgia, serif; font-weight:400; font-size:28px; line-height:1.15; letter-spacing:-0.015em; color:#23352D; margin:0 0 18px 0; }
      p { font-size:15.5px; line-height:1.6; color:rgba(17,17,17,0.78); margin:0 0 14px 0; }
      .applicant { margin-top:28px; padding:18px 20px; border:1px solid rgba(17,17,17,0.06); border-radius:12px; background:#F7F2EA; }
      .applicant .label { font-size:10.5px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(17,17,17,0.5); margin:0 0 6px 0; }
      .applicant .value { font-family: ui-serif, Georgia, serif; font-size:16px; color:#23352D; margin:0; }
      a.back { display:inline-block; margin-top:30px; font-size:13px; font-weight:500; color:#23352D; text-decoration:none; border-bottom:1px solid rgba(35,53,45,0.3); padding-bottom:2px; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="eyebrow">Early Founders Collective</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(body)}</p>
      ${
        applicant
          ? `<div class="applicant">
              <p class="label">Applicant</p>
              <p class="value">${escapeHtml(applicant.name)} · ${escapeHtml(applicant.email)}</p>
            </div>`
          : ""
      }
      <a href="${env.siteUrl}" class="back">Back to site →</a>
    </div>
  </body>
</html>`;

  return new NextResponse(html, {
    status: tone === "success" ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
