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
            Build Your Business Kit · earlyfounderscollective.com/kit
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

function firstNameOf(name: string): string {
  return name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";
}

const H1 = (text: string) =>
  `<h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">${text}</h1>`;

const P = (text: string, last = false) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 ${last ? "28px" : "16px"} 0;line-height:1.65;">${text}</p>`;

const BTN = (href: string, label: string) =>
  `<div style="margin:8px 0 32px 0;">
    <a href="${href}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">
      ${label}
    </a>
  </div>`;

const SIG = `<p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">Oge</p>`;

type Rendered = { subject: string; html: string };

export function renderKitWelcome(opts: { name: string; magicLink: string }): Rendered {
  const first = firstNameOf(opts.name);
  const subject = "your kit is ready";
  const inner = `
    ${H1(first ? `${first}, you're in.` : "You're in.")}
    ${P("Your Build Your Business Kit is unlocked. Click below to open the dashboard and start with Module 01 — the Offer Clarity Worksheet.")}
    ${P("This link signs you in instantly. It works for 30 minutes — after that just enter your email at earlyfounderscollective.com/kit/access/login and we'll send a new one.", true)}
    ${BTN(opts.magicLink, "Open my kit →")}
    ${P("There are six modules. Don't try to do them all at once. Pick at it over a weekend.", true)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

export function renderKitMagicLink(opts: { magicLink: string }): Rendered {
  const subject = "your kit access link";
  const inner = `
    ${H1("Here's your link.")}
    ${P("Click below to sign back into your kit. The link works for 30 minutes.")}
    ${BTN(opts.magicLink, "Open my kit →")}
    ${P("If you didn't request this, you can ignore the email.", true)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

async function send(to: string, r: Rendered) {
  const c = client();
  if (!c) return { skipped: true as const };
  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to,
    subject: r.subject,
    html: r.html,
  });
}

export async function sendKitWelcomeEmail(
  email: string,
  name: string,
  magicLink: string,
) {
  return send(email, renderKitWelcome({ name, magicLink }));
}

export async function sendKitMagicLinkEmail(email: string, magicLink: string) {
  return send(email, renderKitMagicLink({ magicLink }));
}
