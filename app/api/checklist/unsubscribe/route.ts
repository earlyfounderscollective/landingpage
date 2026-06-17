import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyChecklistUnsubscribeToken } from "@/lib/signing";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const token = url.searchParams.get("token") ?? "";

  if (!email || !token) {
    return page("Invalid link", "The unsubscribe link is missing parameters.", "error");
  }
  if (!verifyChecklistUnsubscribeToken(email, token)) {
    return page(
      "Link expired or invalid",
      "We couldn't verify this unsubscribe link. If you've already clicked it once, you're already off the list.",
      "error",
    );
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase
      .from("checklist_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", email);
  }

  return page(
    "You're unsubscribed.",
    "You'll stop getting these check-ins. The Founder Sales & Systems Checklist you downloaded is still yours to keep. If you ever change your mind, you can sign up again at earlyfounderscollective.com.",
    "success",
  );
}

function page(title: string, body: string, tone: "success" | "error") {
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
      a.back { display:inline-block; margin-top:30px; font-size:13px; font-weight:500; color:#23352D; text-decoration:none; border-bottom:1px solid rgba(35,53,45,0.3); padding-bottom:2px; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="eyebrow">Early Founders Collective</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(body)}</p>
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
