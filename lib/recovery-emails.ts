import { Resend } from "resend";
import { env } from "./env";
import { signKitRegistrantToken } from "./signing";

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

function firstOf(name: string): string {
  return name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";
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

const SIG = `<p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">— The EFC team</p>`;

export type ProductType =
  | "kit_order"
  | "bootcamp_order"
  | "dfy_payment"
  | "training_vip";

export type RecoveryKind = "expired" | "declined";

type Args = {
  email: string;
  name?: string;
  productType: ProductType;
  recoveryKind: RecoveryKind;
  applicationId?: string | null;
  dfyToken?: string | null;
};

function productCopy(productType: ProductType): {
  product: string;
  // Page URL the recovery link should send them back to
  pageHref: (args: Args) => string;
} {
  if (productType === "kit_order") {
    return {
      product: "Build Your Business Kit",
      pageHref: (a) => {
        const params = new URLSearchParams();
        if (a.email) {
          params.set("email", a.email);
          // If they came in as a training registrant, regenerate the token
          // so the discount price stays unlocked.
          params.set("t", signKitRegistrantToken(a.email));
        }
        const qs = params.toString();
        return `${env.siteUrl}/kit${qs ? `?${qs}` : ""}`;
      },
    };
  }
  if (productType === "bootcamp_order") {
    return {
      product: "Founders Foundation",
      pageHref: () => `${env.siteUrl}/bootcamp`,
    };
  }
  if (productType === "dfy_payment") {
    return {
      product: "Done-For-You",
      pageHref: (a) => {
        if (a.applicationId && a.dfyToken) {
          return `${env.siteUrl}/dfy/checkout?app=${a.applicationId}&token=${a.dfyToken}`;
        }
        return `${env.siteUrl}/dfy`;
      },
    };
  }
  // training_vip
  return {
    product: "VIP training upgrade",
    pageHref: (a) =>
      `${env.siteUrl}/training/upgrade${a.email ? `?email=${encodeURIComponent(a.email)}` : ""}`,
  };
}

function render(args: Args): { subject: string; html: string } {
  const first = firstOf(args.name ?? "");
  const { product, pageHref } = productCopy(args.productType);
  const href = pageHref(args);

  if (args.recoveryKind === "declined") {
    const subject = first ? `${first}, your card didn't go through` : "Your card didn't go through";
    const inner = `
      ${H1(first ? `${first},` : "Hey,")}
      ${P(`Your card was declined when we tried to charge for <strong style="color:#23352D;">${escapeHtml(product)}</strong>.`)}
      ${P("Usually this is a bank flagging the charge as unusual — most cards work on the second try, or just try a different card.")}
      ${P("Click below and we'll send you back to checkout. Same price, same details.", true)}
      ${BTN(href, "Try again →")}
      ${P("If you keep hitting issues, just reply to this email and we'll sort it.", true)}
      ${SIG}
    `;
    return { subject, html: wrap(inner) };
  }

  // expired / abandoned
  const subject = first ? `${first}, you didn't finish` : "You didn't finish";
  const inner = `
    ${H1(first ? `${first},` : "Hey,")}
    ${P(`You opened checkout for <strong style="color:#23352D;">${escapeHtml(product)}</strong> but didn't finish.`)}
    ${P("No pressure — but if it was a quick distraction, here's the link to pick up where you left off. Same price, same details.", true)}
    ${BTN(href, `Continue to ${escapeHtml(product)} →`)}
    ${P("If you changed your mind, you can ignore this. We won't bug you again.", true)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

export async function sendRecoveryEmail(args: Args) {
  const c = client();
  if (!c) return { skipped: true as const };
  const r = render(args);
  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: args.email,
    subject: r.subject,
    html: r.html,
  });
}
