import { Resend } from "resend";
import { env } from "./env";
import type { TrainingEvent } from "./training";
import { formatTrainingDateLine } from "./training";
import { signKitRegistrantToken } from "./signing";

let resend: Resend | null = null;
function client(): Resend | null {
  if (resend) return resend;
  if (!env.resendApiKey) return null;
  resend = new Resend(env.resendApiKey);
  return resend;
}

const wrap = (inner: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;background:#F7F2EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EA;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(17,17,17,0.06);border-radius:16px;padding:48px 40px;">
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 36px 0;">
            <tr><td align="center">
              <img src="${env.siteUrl}/email-logo.png" width="180" height="87" alt="Early Founders Collective" style="display:block;width:180px;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;" />
            </td></tr>
          </table>
          ${inner}
          <hr style="border:none;border-top:1px solid rgba(17,17,17,0.08);margin:40px 0 20px 0;"/>
          <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.4);margin:0;">
            earlyfounderscollective.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const H1 = (text: string) =>
  `<h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">${text}</h1>`;

const P = (text: string, last = false) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 ${last ? "28px" : "16px"} 0;line-height:1.65;">${text}</p>`;

const BTN = (href: string, label: string) =>
  `<div style="margin:8px 0 32px 0;"><a href="${href}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">${label}</a></div>`;

const SIG = `<p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">Oge</p>`;

function firstOf(name: string): string {
  return name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";
}

async function send(to: string, subject: string, html: string) {
  const c = client();
  if (!c) return { skipped: true as const };
  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to,
    subject,
    html,
  });
}

// ─────────────────────────────────────────────────────────
// 24-hour reminder (sent ~24h before starts_at)
// ─────────────────────────────────────────────────────────
export async function sendTraining24hReminder(
  email: string,
  name: string,
  event: TrainingEvent,
) {
  const first = firstOf(name);
  const dateLine = formatTrainingDateLine(event);
  const subject = first ? `Tomorrow, ${first}` : "Tomorrow";
  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P("Quick reminder — the training is tomorrow.")}
    ${P(`<strong style="color:#23352D;">${escapeHtml(dateLine)}</strong>`)}
    ${event.zoom_url ? `${P("Same Zoom link from your confirmation email — pasting it here so you don't have to dig:")}${P(`<a href="${event.zoom_url}" style="color:#23352D;text-decoration:underline;">${escapeHtml(event.zoom_url)}</a>`, true)}` : P("Show up live if you can. The replay window is 48 hours unless you've gone VIP.", true)}
    ${BTN(`${env.siteUrl}/training/watch?email=${encodeURIComponent(email)}`, "Open the training room")}
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

// ─────────────────────────────────────────────────────────
// Same-day reminder (fires 0-12h before start via daily cron)
// Copy is intentionally same-day, NOT "in an hour" — the trigger
// window is up to 12h wide because we run on a daily cron.
// ─────────────────────────────────────────────────────────
export async function sendTraining1hReminder(
  email: string,
  name: string,
  event: TrainingEvent,
) {
  const first = firstOf(name);
  const dateLine = formatTrainingDateLine(event);
  const subject = first ? `Tonight, ${first}` : "Tonight";
  const inner = `
    ${H1("Later today.")}
    ${P("Quick reminder — the training is tonight.")}
    ${P(`<strong style="color:#23352D;">${escapeHtml(dateLine)}</strong>`)}
    ${event.zoom_url ? P(`Zoom link: <a href="${event.zoom_url}" style="color:#23352D;text-decoration:underline;font-weight:500;">${escapeHtml(event.zoom_url)}</a>`, true) : ""}
    ${BTN(`${env.siteUrl}/training/watch?email=${encodeURIComponent(email)}`, "Open the training room")}
    ${P("Doors open 30 min before start.", true)}
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

// ─────────────────────────────────────────────────────────
// One-shot correction email — sent manually via admin
// broadcast route when a bad reminder went out with wrong timing.
// ─────────────────────────────────────────────────────────
export async function sendTrainingCorrection(
  email: string,
  name: string,
  event: TrainingEvent,
) {
  const first = firstOf(name);
  const dateLine = formatTrainingDateLine(event);
  const subject = first
    ? `Correction — training is tonight, ${first}`
    : "Correction — training is tonight";
  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P("Quick note — you may have gotten an email earlier that read like the training was starting right away. That was a scheduling glitch on my end. My apologies.")}
    ${P("The correct time is:")}
    ${P(`<strong style="color:#23352D;">${escapeHtml(dateLine)}</strong>`)}
    ${event.zoom_url ? P(`Zoom link: <a href="${event.zoom_url}" style="color:#23352D;text-decoration:underline;font-weight:500;">${escapeHtml(event.zoom_url)}</a>`, true) : ""}
    ${BTN(`${env.siteUrl}/training/watch?email=${encodeURIComponent(email)}`, "Open the training room")}
    ${P("Sorry for the mix-up. See you tonight.", true)}
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

// ─────────────────────────────────────────────────────────
// Zoom link update — sent when we swap the meeting URL mid-cohort.
// ─────────────────────────────────────────────────────────
export async function sendTrainingZoomUpdate(
  email: string,
  name: string,
  event: TrainingEvent,
) {
  const first = firstOf(name);
  const dateLine = formatTrainingDateLine(event);
  const subject = first
    ? `Updated Zoom link, ${first} — save this one`
    : "Updated Zoom link — save this one";
  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P("Quick note — I switched the Zoom link for tonight&rsquo;s training. Please use <strong style=\"color:#23352D;\">this one</strong> instead of any earlier link I sent:")}
    ${event.zoom_url ? P(`<a href="${event.zoom_url}" style="color:#23352D;text-decoration:underline;font-weight:600;font-size:17px;">${escapeHtml(event.zoom_url)}</a>`) : ""}
    ${P(`Same time: <strong style="color:#23352D;">${escapeHtml(dateLine)}</strong>`)}
    ${BTN(`${env.siteUrl}/training/watch?email=${encodeURIComponent(email)}`, "Open the training room")}
    ${P("If you already saved the old link, delete it &mdash; only the link above will work. See you tonight.", true)}
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

// ─────────────────────────────────────────────────────────
// Replay delivery (sent ~30 min after event ends)
// ─────────────────────────────────────────────────────────
export async function sendTrainingReplayDelivery(
  email: string,
  name: string,
  event: TrainingEvent,
  isVip: boolean,
) {
  const first = firstOf(name);
  const subject = first ? `Replay's up, ${first}` : "Replay's up";
  const replayHref = event.replay_url || `${env.siteUrl}/training/watch?email=${encodeURIComponent(email)}`;
  const inner = `
    ${H1("The replay is ready.")}
    ${P(isVip ? "As a VIP, your replay is permanent. Come back to it anytime." : "Free access for the next 48 hours. After that the link closes.")}
    ${BTN(replayHref, "Watch the replay")}
    ${!isVip ? P(`<a href="${env.siteUrl}/training/upgrade?email=${encodeURIComponent(email)}" style="color:#23352D;text-decoration:underline;">Want lifetime access?</a> Upgrade to VIP for $17.`) : ""}
    ${P("If you couldn't make it live, watching is still worth your time. The first 25 minutes are the part most people quote back to me later.", true)}
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

// ─────────────────────────────────────────────────────────
// Kit pitch (sent 24h after event ends — for everyone)
// ─────────────────────────────────────────────────────────
export async function sendTrainingKitPitch(
  email: string,
  name: string,
) {
  const first = firstOf(name);
  const subject = first ? `${first}, next step` : "Next step";
  const inner = `
    ${H1(first ? `${first},` : "Hey,")}
    ${P("You've watched the training. The hardest part of building a real business isn't the theory — it's the boring setup work that nobody talks about.")}
    ${P("Build Your Business Kit is what I'd hand you if you were sitting next to me. Six modules. Worksheets, templates, AI prompts. Most people get the offer, pricing, and entity setup done in a weekend.")}
    ${P("Because you attended the training, you get it for $47 instead of $97. That's about as close to free as I can make it without giving it away.", true)}
    ${BTN(`${env.siteUrl}/kit?email=${encodeURIComponent(email)}&t=${signKitRegistrantToken(email)}`, "Get the kit — $47")}
    ${P("This price is only because you showed up to the training. The page will charge full price for everyone else.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 28px 0;background:#EFE7DA;border:1px solid rgba(17,17,17,0.08);border-radius:12px;">
      <tr><td style="padding:18px 22px;">
        <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:10.5px;letter-spacing:0.2em;text-transform:uppercase;color:#9B7A4A;font-weight:600;margin:0 0 6px 0;">Want the live version?</p>
        <p style="font-family:'Fraunces',Georgia,serif;font-size:17px;color:#23352D;line-height:1.4;margin:0 0 6px 0;">Founders Foundation — 4-week cohort with the kit included.</p>
        <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;color:rgba(17,17,17,0.65);line-height:1.55;margin:0 0 10px 0;">Live group sessions, private community, office hours. $497.</p>
        <a href="${env.siteUrl}/bootcamp?source=kit_pitch_email" style="display:inline-block;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12.5px;font-weight:600;letter-spacing:0.04em;color:#23352D;text-decoration:none;border-bottom:1.5px solid #9B7A4A;padding-bottom:2px;">See Founders Foundation →</a>
      </td></tr>
    </table>
    ${SIG}
  `;
  return send(email, subject, wrap(inner));
}

export async function sendTrainingRegistrationEmail(
  email: string,
  name: string,
  event: TrainingEvent,
) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";
  const dateLine = formatTrainingDateLine(event);

  // Three flavors depending on event status
  let subject = "You're in";
  let mainBlock = "";

  if (event.status === "upcoming" && event.starts_at) {
    subject = first ? `You're in, ${first}` : "You're in";
    mainBlock = `
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 8px 0;line-height:1.65;">
        Saved your seat.
      </p>
      <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:18px;color:#9B7A4A;margin:0 0 24px 0;line-height:1.4;">
        ${escapeHtml(dateLine)}
      </p>
      ${
        event.zoom_url
          ? `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;color:rgba(17,17,17,0.6);margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.18em;font-weight:500;">Zoom link</p>
             <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
               <a href="${event.zoom_url}" style="color:#23352D;text-decoration:underline;">${escapeHtml(event.zoom_url)}</a>
             </p>`
          : ""
      }
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
        I'll send a reminder closer to the time. Save this email so you can come back to the link.
      </p>`;
  } else if (event.status === "replay" && event.replay_url) {
    subject = first ? `You're in, ${first}` : "You're in";
    mainBlock = `
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
        Replay link below. Free access for 48 hours from when you opened this email.
      </p>
      <div style="margin:0 0 32px 0;">
        <a href="${event.replay_url}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">
          Watch the replay
        </a>
      </div>`;
  } else {
    subject = first ? `You're on the list, ${first}` : "You're on the list";
    mainBlock = `
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
        Got you. The next training drops soon. The moment a date is set, you'll be the first to hear.
      </p>
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
        Nothing to do for now.
      </p>`;
  }

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      ${first ? `Hey ${first},` : "Hey,"}
    </h1>
    ${mainBlock}
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: email,
    subject,
    html: wrap(inner),
  });
}

// vercel git auto-deploy smoke test — 2026-07-02T13:56:10Z
