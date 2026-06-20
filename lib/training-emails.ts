import { Resend } from "resend";
import { env } from "./env";
import type { TrainingEvent } from "./training";
import { formatTrainingDateLine } from "./training";

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
