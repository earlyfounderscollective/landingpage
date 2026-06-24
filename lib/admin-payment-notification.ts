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

export type AdminPaymentArgs = {
  product: "kit_order" | "bootcamp_order" | "dfy_payment" | "training_vip";
  email: string;
  name?: string | null;
  amountCents: number;
  source?: string | null;
  refCode?: string | null;
  stripeSessionId?: string | null;
};

const PRODUCT_LABEL: Record<AdminPaymentArgs["product"], string> = {
  kit_order: "Build Your Business Kit",
  bootcamp_order: "Founders Foundation (Bootcamp)",
  dfy_payment: "Done-For-You",
  training_vip: "Training VIP Upgrade",
};

const Row = (label: string, value?: string | null) => {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(17,17,17,0.45);width:140px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:14.5px;color:#23352D;line-height:1.5;">${escapeHtml(value)}</td>
    </tr>`;
};

export async function sendAdminPaymentNotification(args: AdminPaymentArgs) {
  const c = client();
  if (!c) return { skipped: true as const };

  const product = PRODUCT_LABEL[args.product];
  const amount = `$${(args.amountCents / 100).toFixed(2)}`;
  const isFree = args.amountCents === 0;

  const subject = isFree
    ? `[TEST $0] ${product} · ${args.name || args.email}`
    : `${amount} sale · ${product} · ${args.name || args.email}`;

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;background:#F7F2EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EA;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(17,17,17,0.06);border-radius:16px;padding:40px;">
        <tr><td>
          <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9B7A4A;font-weight:600;margin:0 0 12px 0;">
            ${isFree ? "Test purchase (100% off)" : "Payment received"}
          </p>
          <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:36px;line-height:1.1;color:#23352D;margin:0 0 6px 0;letter-spacing:-0.018em;">
            ${amount}
          </h1>
          <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;color:rgba(17,17,17,0.65);margin:0 0 28px 0;">
            ${escapeHtml(product)}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${Row("Customer", args.name || "(no name)")}
            ${Row("Email", args.email)}
            ${Row("Source", args.source)}
            ${Row("Referral", args.refCode)}
            ${Row("Stripe ID", args.stripeSessionId)}
          </table>
          <p style="margin:28px 0 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12px;color:rgba(17,17,17,0.5);line-height:1.55;">
            Full record in <a href="${env.siteUrl}/admin" style="color:#23352D;text-decoration:underline;">/admin</a> and on the
            <a href="https://dashboard.stripe.com/payments" style="color:#23352D;text-decoration:underline;">Stripe dashboard</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: env.adminEmail,
    replyTo: args.email,
    subject,
    html,
  });
}
