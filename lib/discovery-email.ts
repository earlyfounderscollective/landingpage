import { Resend } from "resend";
import { env } from "./env";

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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>");
}

export type DiscoveryInput = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  servicesInterested: string[];
  socials: Record<string, string>;
  website: string;
  startTiming: string;
  businessType: string;
  businessAge: string;
  monthlyRevenue: string;
  biggestBottleneck: string;
  triedSolutions: string;
  whatsWorking: string;
  ninetyDayGoal: string;
  whyThisCall: string;
  additionalQuestions: string;
};

export async function sendDiscoveryApplicantConfirmation(input: DiscoveryInput) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = input.fullName.trim().split(/\s+/)[0] || "";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      Application received${first ? `, ${escapeHtml(first)}` : ""}.
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Thank you for taking the time to complete the application.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      We'll review your responses before the discovery call so we can make the conversation as valuable and productive as possible.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      If any additional information is needed, we'll reach out directly.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: input.email,
    subject: "Your discovery call application was received",
    html: wrap(inner),
  });
}

export async function sendDiscoveryAdminNotification(
  input: DiscoveryInput,
  id?: string,
) {
  const c = client();
  if (!c) return { skipped: true as const };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid rgba(17,17,17,0.07);font-family:ui-sans-serif,system-ui,sans-serif;font-size:10.5px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.5);width:36%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid rgba(17,17,17,0.07);font-family:'Fraunces',Georgia,serif;font-size:15px;color:#23352D;line-height:1.55;">${value ? escapeHtml(value) : '<span style="color:rgba(17,17,17,0.35);font-style:italic;">—</span>'}</td>
    </tr>`;

  const socialLines = Object.entries(input.socials)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:26px;line-height:1.18;color:#23352D;margin:0 0 8px 0;letter-spacing:-0.015em;">
      New discovery call application
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:rgba(17,17,17,0.55);margin:0 0 24px 0;letter-spacing:0.02em;">
      ${id ? `Ref: ${escapeHtml(id)}` : ""}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", input.fullName)}
      ${row("Email", input.email)}
      ${row("Phone", input.phone)}
      ${row("Business", input.businessName)}
      ${row("Services interested", input.servicesInterested.join(", "))}
      ${row("Socials", socialLines)}
      ${row("Website", input.website)}
      ${row("Timing", input.startTiming)}
      ${row("Business type", input.businessType)}
      ${row("Time in business", input.businessAge)}
      ${row("Monthly revenue", input.monthlyRevenue)}
      ${row("Biggest bottleneck", input.biggestBottleneck)}
      ${row("Already tried", input.triedSolutions)}
      ${row("What's working", input.whatsWorking)}
      ${row("90-day goal", input.ninetyDayGoal)}
      ${row("Why this call", input.whyThisCall)}
      ${row("Additional", input.additionalQuestions)}
    </table>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: env.adminEmail,
    subject: `New discovery call application — ${input.fullName}`,
    html: wrap(inner),
    replyTo: input.email,
  });
}
