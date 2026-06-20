import { Resend } from "resend";
import { env } from "./env";

let resend: Resend | null = null;
function client(): Resend | null {
  if (resend) return resend;
  if (!env.resendApiKey) return null;
  resend = new Resend(env.resendApiKey);
  return resend;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type DFYApplication = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  business_name?: string | null;
  business_stage?: string | null;
  monthly_revenue?: string | null;
  what_you_sell?: string | null;
  biggest_blocker?: string | null;
  budget?: string | null;
  timeline?: string | null;
};

const Row = (label: string, value?: string | null) => {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.45);width:160px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:14.5px;color:#23352D;line-height:1.5;">${escapeHtml(value)}</td>
    </tr>`;
};

export async function sendDFYApplicationAdminEmail(app: DFYApplication) {
  const c = client();
  if (!c) return { skipped: true as const };

  const subject = `DFY application · ${escapeHtml(app.full_name)} (${escapeHtml(app.budget ?? "Not sure")})`;

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;background:#F7F2EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EA;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(17,17,17,0.06);border-radius:16px;padding:40px;">
        <tr><td>
          <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9B7A4A;font-weight:600;margin:0 0 12px 0;">New DFY application</p>
          <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:28px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">${escapeHtml(app.full_name)}</h1>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${Row("Email", app.email)}
            ${Row("Phone", app.phone)}
            ${Row("Business", app.business_name)}
            ${Row("Stage", app.business_stage)}
            ${Row("Revenue", app.monthly_revenue)}
            ${Row("Tier", app.budget)}
            ${Row("Timeline", app.timeline)}
          </table>
          ${
            app.what_you_sell
              ? `<div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(17,17,17,0.08);">
                  <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.45);margin:0 0 6px 0;">What they sell</p>
                  <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;color:#23352D;line-height:1.6;margin:0;">${escapeHtml(app.what_you_sell)}</p>
                </div>`
              : ""
          }
          ${
            app.biggest_blocker
              ? `<div style="margin-top:18px;padding-top:18px;border-top:1px solid rgba(17,17,17,0.08);">
                  <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.45);margin:0 0 6px 0;">Biggest blocker</p>
                  <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;color:#23352D;line-height:1.6;margin:0;">${escapeHtml(app.biggest_blocker)}</p>
                </div>`
              : ""
          }
          <p style="margin:28px 0 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:rgba(17,17,17,0.55);">Reply directly to this email to reach ${escapeHtml(app.full_name)}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return c.emails.send({
    from: `EFC Applications <${env.resendFromEmail}>`,
    to: env.adminEmail,
    replyTo: app.email,
    subject,
    html,
  });
}
