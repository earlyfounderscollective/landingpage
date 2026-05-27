import { Resend } from "resend";
import { env } from "./env";
import { signDecisionToken } from "./signing";
import type { ApplicationInput } from "./validation";

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
            contact@earlyfounderscollective.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

export async function sendApplicantConfirmation(input: ApplicationInput) {
  const c = client();
  if (!c) return { skipped: true as const };

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      Your application was received.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      ${input.fullName.split(" ")[0]}, thanks for applying to Early Founders Collective.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Every application is read by hand. If it looks like a strong fit for our room, you'll hear from us shortly with next steps, typically within 2-3 days.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      In the meantime, keep building.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      — Early Founders Collective
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: input.email,
    subject: "Your Early Founders Collective application was received",
    html: wrap(inner),
  });
}

export async function sendAdminNotification(input: ApplicationInput, id?: string) {
  const c = client();
  if (!c) return { skipped: true as const };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(17,17,17,0.07);font-family:ui-sans-serif,system-ui,sans-serif;font-size:10.5px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.5);width:38%;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(17,17,17,0.07);font-family:'Fraunces',Georgia,serif;font-size:15.5px;color:#23352D;line-height:1.55;">${escapeHtml(value)}</td>
    </tr>`;

  // One-click decision buttons (only shown when we have a persisted id)
  const buttons = id
    ? `
    <div style="margin:36px 0 8px 0;text-align:center;">
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.5);margin:0 0 18px 0;">
        Decide
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 6px;">
            <a href="${decisionUrl(id, "accept")}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:13px 22px;border-radius:9999px;">
              Accept &amp; send payment link
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 6px 0 6px;text-align:center;">
            <a href="${decisionUrl(id, "waitlist")}" style="display:inline-block;color:#23352D;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12.5px;font-weight:500;letter-spacing:0.04em;text-decoration:none;padding:10px 16px;border:1px solid rgba(35,53,45,0.25);border-radius:9999px;margin-right:6px;">
              Not right now
            </a>
            <a href="${decisionUrl(id, "decline")}" style="display:inline-block;color:rgba(35,53,45,0.7);font-family:ui-sans-serif,system-ui,sans-serif;font-size:12.5px;font-weight:500;letter-spacing:0.04em;text-decoration:none;padding:10px 16px;border:1px solid rgba(35,53,45,0.18);border-radius:9999px;">
              Decline
            </a>
          </td>
        </tr>
      </table>
      <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11.5px;color:rgba(17,17,17,0.45);margin:18px 0 0 0;line-height:1.5;">
        One click sends the applicant the right reply and updates the application status.
      </p>
    </div>
  `
    : "";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:26px;line-height:1.18;color:#23352D;margin:0 0 8px 0;letter-spacing:-0.015em;">
      New application
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:rgba(17,17,17,0.55);margin:0 0 24px 0;letter-spacing:0.02em;">
      ${id ? `Ref: ${id}` : ""}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Full name", input.fullName)}
      ${row("Email", input.email)}
      ${row("Phone", input.phone)}
      ${row("City", input.city)}
      ${row("Social link", input.socialLink)}
      ${row("Stage", input.stage)}
      ${row("Currently building", input.currentBuild)}
      ${row("Execution challenge (90d)", input.executionChallenge)}
      ${row("180-day progress goal", input.progressGoal)}
      ${row("Why join", input.whyJoin)}
      ${row("Will participate consistently", input.participateWeekly)}
    </table>

    ${buttons}
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: env.adminEmail,
    subject: "New Early Founders Collective Application",
    html: wrap(inner),
    replyTo: input.email,
  });
}

export async function sendAcceptanceEmail(
  applicant: { email: string; fullName: string },
  checkoutUrl: string | null,
) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = applicant.fullName.split(" ")[0] ?? "";

  const button = checkoutUrl
    ? `
    <div style="margin:32px 0 12px 0;">
      <a href="${checkoutUrl}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:15px 28px;border-radius:9999px;">
        Confirm my seat
      </a>
    </div>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:rgba(17,17,17,0.55);margin:0 0 24px 0;line-height:1.55;">
      The link above opens a secure Stripe checkout. Payment confirms your spot inside the room.
    </p>`
    : `
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 24px 0;line-height:1.65;">
      We'll send your secure payment link in a separate note shortly.
    </p>`;

  const benefits = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      ${[
        "The private community of early-stage business owners building alongside you",
        "Weekly live calls with Oge and the room",
        "Accountability, structure, and execution support whenever you need it",
        "Founding-member pricing, locked for the life of your membership",
      ]
        .map(
          (item) => `
        <tr>
          <td valign="top" width="22" style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:#9B7A4A;">&bull;</td>
          <td style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:15.5px;color:rgba(17,17,17,0.8);line-height:1.55;">${escapeHtml(item)}</td>
        </tr>`,
        )
        .join("")}
    </table>`;

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      Congratulations${first ? `, ${escapeHtml(first)}` : ""}. You're in.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      We read your application, and we're excited to start this part of your journey with you.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 24px 0;line-height:1.65;">
      You're exactly the kind of person this room was built for, and we want you inside it.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Here's what's next. Confirming your seat gets you access to:
    </p>
    ${benefits}
    ${button}
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      The moment your payment goes through, your welcome email and onboarding details land in your inbox, and you're officially in.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      Looking forward to seeing what you build.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: applicant.email,
    subject: `Congratulations${first ? `, ${first}` : ""} — welcome to Early Founders Collective`,
    html: wrap(inner),
  });
}

export async function sendDeclineEmail(applicant: {
  email: string;
  fullName: string;
}) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = applicant.fullName.split(" ")[0] ?? "";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:28px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      About your application${first ? `, ${escapeHtml(first)}` : ""}.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Thank you for taking the time to apply to Early Founders Collective. After reading your application closely, we don't think the fit or timing is right for the current cohort.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      This isn't a reflection of your ambition or what you're building. We're keeping the room intentionally small so every person inside it can get real value from it.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      Wishing you clarity, structure, and momentum with what you're building.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      — Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: applicant.email,
    subject: "About your Early Founders Collective application",
    html: wrap(inner),
  });
}

export async function sendWaitlistEmail(applicant: {
  email: string;
  fullName: string;
}) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = applicant.fullName.split(" ")[0] ?? "";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:28px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      Not right now${first ? `, ${escapeHtml(first)}` : ""} — but soon.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Thanks for applying to Early Founders Collective. We're keeping the room small this cycle and aren't adding new members at the moment.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Your application is strong enough that we'd like to revisit it when a future cohort opens. We'll reach out directly when there's space, no action needed from your side.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      In the meantime — keep building.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      — Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: applicant.email,
    subject: "About your Early Founders Collective application",
    html: wrap(inner),
  });
}

export async function sendWelcomeEmail(email: string, fullName?: string) {
  const c = client();
  if (!c) return { skipped: true as const };

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      Welcome to Early Founders Collective.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      ${fullName ? `${fullName.split(" ")[0]}, you're officially in.` : "You're officially in."}
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      Onboarding details and access information will be sent shortly. Glad to have you in the room.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      — Early Founders Collective
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: email,
    subject: "Welcome to Early Founders Collective",
    html: wrap(inner),
  });
}

function decisionUrl(id: string, action: "accept" | "decline" | "waitlist") {
  const token = signDecisionToken(id, action);
  return `${env.siteUrl}/api/applications/${encodeURIComponent(id)}/decide?action=${action}&token=${token}`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>");
}
