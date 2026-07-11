import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";
import { isAdmin } from "@/lib/admin-auth";
import { getActiveTrainingEvent } from "@/lib/training";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Sends the post-webinar survey to the active event's registrants. Deduped
// via training_email_log (kind = 'survey_request') so re-runs are no-ops, and
// filters out test/typo addresses. Auth: admin session, cron secret header
// (Vercel cron), or ?secret=. Scheduled once via vercel.json.

function authOk(req: Request): boolean {
  if (isAdmin()) return true;
  if (!env.cronSecret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${env.cronSecret}`) return true;
  return new URL(req.url).searchParams.get("secret") === env.cronSecret;
}

// Known test/typo domains we never want to email.
const BAD_DOMAINS = new Set([
  "efc.test",
  "example.com",
  "gnail.com",
  "gmial.com",
  "gmai.com",
]);

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function surveyEmailHtml(
  eventTitle: string,
  surveyHref: string,
): string {
  const p = (t: string, last = false) =>
    `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 ${last ? "28px" : "16px"} 0;line-height:1.65;">${t}</p>`;
  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">How did that land?</h1>
    ${p(`You were part of my last training, ${esc(eventTitle)}. I'm already working on the next one, and the fastest way to make it sharper is hearing from you.`)}
    ${p("Two minutes, and it genuinely shapes what I build next. There are no wrong answers.")}
    <div style="margin:16px 0 32px 0;"><a href="${surveyHref}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">Give quick feedback</a></div>
    ${p("Thank you for being there.", true)}
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">Oge</p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;background:#F7F2EA;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EA;"><tr><td align="center" style="padding:40px 16px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(17,17,17,0.06);border-radius:16px;padding:48px 40px;"><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 36px 0;"><tr><td align="center"><img src="${env.siteUrl}/email-logo.png" width="180" height="87" alt="Early Founders Collective" style="display:block;width:180px;height:auto;border:0;margin:0 auto;"/></td></tr></table>${inner}<hr style="border:none;border-top:1px solid rgba(17,17,17,0.08);margin:40px 0 20px 0;"/><p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.4);margin:0;">earlyfounderscollective.com</p></td></tr></table></td></tr></table></body></html>`;
}

export async function GET(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";

  const supabase = getSupabaseAdmin();
  if (!supabase || !env.resendApiKey) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const event = await getActiveTrainingEvent();
  if (!event) {
    return NextResponse.json({ error: "No active event" }, { status: 404 });
  }

  const { data: regs } = await supabase
    .from("training_registrations")
    .select("id, email, full_name")
    .eq("event_id", event.id);
  if (!regs?.length) {
    return NextResponse.json({ ok: true, sent: 0, note: "no registrants" });
  }

  const { data: logRows } = await supabase
    .from("training_email_log")
    .select("registration_id")
    .eq("event_id", event.id)
    .eq("kind", "survey_request");
  const alreadySent = new Set((logRows ?? []).map((r) => r.registration_id));

  const resend = new Resend(env.resendApiKey);
  let sent = 0;
  let skipped = 0;
  let errors = 0;
  const seen = new Set<string>();

  for (const reg of regs) {
    const email = String(reg.email ?? "").trim().toLowerCase();
    const domain = email.split("@")[1] ?? "";
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      BAD_DOMAINS.has(domain) ||
      seen.has(email) ||
      alreadySent.has(reg.id)
    ) {
      skipped++;
      continue;
    }
    seen.add(email);
    if (dryRun) {
      sent++;
      continue;
    }
    try {
      const first = reg.full_name
        ? esc(String(reg.full_name).trim().split(/\s+/)[0])
        : "";
      await resend.emails.send({
        from: `Early Founders Collective <${env.resendFromEmail}>`,
        to: email,
        subject: first ? `${first}, how was the training?` : "How was the training?",
        html: surveyEmailHtml(
          event.title,
          `${env.siteUrl}/training/survey?email=${encodeURIComponent(email)}`,
        ),
      });
      await supabase.from("training_email_log").insert({
        registration_id: reg.id,
        event_id: event.id,
        email,
        kind: "survey_request",
      });
      sent++;
    } catch (err) {
      console.error("survey send failed:", err);
      errors++;
    }
  }

  return NextResponse.json({ ok: true, dryRun, sent, skipped, errors, total: regs.length });
}
