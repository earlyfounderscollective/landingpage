import { Resend } from "resend";
import { env } from "./env";
import { ebook } from "./ebook";

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
    .replace(/'/g, "&#39;");
}

const H1 = (text: string) =>
  `<h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">${text}</h1>`;

const P = (text: string, last = false) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 ${last ? "28px" : "16px"} 0;line-height:1.65;">${text}</p>`;

const SIG = `<p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">Oge</p>`;

/**
 * Waitlist confirmation. Confirms the signup, sets the expectation (one
 * email, when it's ready), and asks one question so replies start a real
 * conversation and teach inboxes these are wanted mail.
 */
export async function sendEbookWaitlistEmail(email: string, name: string) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";

  const inner = `
    ${H1(first ? `You’re on the list, ${first}.` : "You’re on the list.")}
    ${P(`<strong style="color:#23352D;font-weight:500;">${ebook.title}</strong> is in the works. I’ll email you as soon as it’s ready. Nothing else in the meantime.`)}
    ${P("One thing if you have a second. Hit reply and tell me the kind of event you’re trying to pull off. A workshop, a mixer, a brunch, a pop up, a paid class, whatever it is. I read these, and what people send me shapes what makes the final cut.", true)}
    ${SIG}
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: email,
    replyTo: env.adminEmail,
    subject: "You’re on the waitlist",
    html: wrap(inner),
  });
}
