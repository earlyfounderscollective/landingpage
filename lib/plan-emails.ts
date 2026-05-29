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
            The Plan · earlyfounderscollective.com/plan
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
    .replace(/'/g, "&#39;");
}

export async function sendPlanWelcomeEmail(email: string, name: string) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = name ? escapeHtml(name.split(" ")[0]) : "";
  const greeting = first ? `${first}, your Plan is open.` : "Your Plan is open.";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      ${greeting}
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Seven modules. Real questions. A clean operating plan at the end of it.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Every answer is saved as you go. Come back any time and pick up where you left off.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 28px 0;line-height:1.65;">
      Most members finish in 6 to 8 weeks. No rush. The work compounds.
    </p>
    <div style="margin:0 0 32px 0;">
      <a href="${env.siteUrl}/plan/01-your-brand" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">
        Open Module 01 →
      </a>
    </div>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;color:rgba(17,17,17,0.6);margin:0 0 24px 0;line-height:1.6;">
      Start with <strong style="color:#23352D;font-weight:500;">Your Brand</strong>. Mission, customer, values, name. The foundation everything else builds on.
    </p>
    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: email,
    subject: first ? `${first}, your Plan is saved` : "Your Plan is saved",
    html: wrap(inner),
  });
}
