import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";
import { verifyDiscoveryDecisionToken } from "@/lib/signing";
import {
  sendDiscoveryAcceptanceEmail,
  sendDiscoveryDeclineEmail,
  sendDiscoveryWaitlistEmail,
} from "@/lib/discovery-email";

export const runtime = "nodejs";

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
  accept: "Accepted. Booking link sent",
  decline: "Application declined",
  waitlist: "Moved to waitlist",
};

const bodyFor: Record<Action, string> = {
  accept:
    "The applicant just got an email from Oge with the Cal.com booking link. You'll see the booking land in your calendar when they pick a time.",
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

  if (!verifyDiscoveryDecisionToken(id, action, token)) {
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
    .from("discovery_applications")
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

  try {
    if (action === "accept") {
      await sendDiscoveryAcceptanceEmail({
        fullName: applicant.full_name,
        email: applicant.email,
      });
    } else if (action === "decline") {
      await sendDiscoveryDeclineEmail({
        fullName: applicant.full_name,
        email: applicant.email,
      });
    } else {
      await sendDiscoveryWaitlistEmail({
        fullName: applicant.full_name,
        email: applicant.email,
      });
    }
  } catch (e) {
    console.error("Resend send failed during discovery decision", e);
    return page(
      "Email send failed",
      "The status update will still be applied, but the email to the applicant did not go through. Check Resend logs.",
      "error",
    );
  }

  const { error: updateError } = await supabase
    .from("discovery_applications")
    .update({ status: statusFor[action] })
    .eq("id", id);

  if (updateError) {
    console.error("discovery_applications status update failed", updateError);
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
      <p class="eyebrow">Early Founders Collective · Discovery</p>
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
