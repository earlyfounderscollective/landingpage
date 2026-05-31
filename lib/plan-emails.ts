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

export type Rendered = { subject: string; html: string };

export type ModuleInfo = { slug: string; title: string };

// ───────────────────────────────────────
// 0. Welcome (sent on /api/plan/start)
// ───────────────────────────────────────
export function renderPlanWelcome(opts: { name: string }): Rendered {
  const first = firstNameOf(opts.name);
  const subject = "your Plan is saved";

  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P("Just wanted to say your Plan is saved. Anything you put in stays there, even if you close the tab.")}
    ${P("There's seven modules. Don't try to do them all at once. Pick at it over a few weeks.")}
    ${P("Module 01 is Your Brand. That's the place to start.", true)}
    ${BTN(`${env.siteUrl}/plan/01-your-brand`, "Open Your Brand")}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

// ───────────────────────────────────────
// 1. Inactive 24h (paused mid-module)
// ───────────────────────────────────────
export function renderPlanInactive24h(opts: {
  name: string;
  module: ModuleInfo;
}): Rendered {
  const first = firstNameOf(opts.name);
  const m = escapeHtml(opts.module.title);
  const subject = `your ${m} draft is saved`;

  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P(`You started ${m} yesterday and didn't finish. Just making sure you knew everything's saved.`)}
    ${P("Come back when you have a few minutes. No pressure.", true)}
    ${BTN(`${env.siteUrl}/plan/${opts.module.slug}`, `Pick ${m} back up`)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

// ───────────────────────────────────────
// 2. Inactive 72h (a tactical nudge from Oge)
// ───────────────────────────────────────
export function renderPlanInactive72h(opts: {
  name: string;
  module: ModuleInfo;
  tip: string;
}): Rendered {
  const first = firstNameOf(opts.name);
  const m = escapeHtml(opts.module.title);
  const subject = `stuck on ${m}?`;

  const inner = `
    ${H1(first ? `${first},` : "Hey,")}
    ${P(`A lot of people get stuck on ${m}. You're not alone there.`)}
    ${P(`If I were sitting next to you, here's what I'd say: ${escapeHtml(opts.tip)}`)}
    ${P("Pick it back up when you have a few minutes.", true)}
    ${BTN(`${env.siteUrl}/plan/${opts.module.slug}`, `Open ${m}`)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

// ───────────────────────────────────────
// 3. Inactive 7d (bring it to the room)
// ───────────────────────────────────────
export function renderPlanInactive7d(opts: {
  name: string;
  module: ModuleInfo;
}): Rendered {
  const first = firstNameOf(opts.name);
  const m = escapeHtml(opts.module.title);
  const subject = "checking in";

  const inner = `
    ${H1(first ? `Hey ${first},` : "Hey,")}
    ${P(`It's been about a week since you touched ${m}. No judgement, just checking in.`)}
    ${P("If it helps: finish a rough version this week and drop it in the community. Other people in there are working on the same stuff, and the feedback's usually better than mine alone.", true)}
    ${BTN(`${env.siteUrl}/plan/${opts.module.slug}`, `Open ${m}`)}
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

// ───────────────────────────────────────
// 4. Module complete
// ───────────────────────────────────────
export function renderPlanModuleComplete(opts: {
  name: string;
  completed: ModuleInfo;
  next: ModuleInfo | null;
  modulesProgress: { done: number; total: number };
}): Rendered {
  const first = firstNameOf(opts.name);
  const done = escapeHtml(opts.completed.title);
  const subject = `${done} done`;
  const mp = opts.modulesProgress;

  const inner = `
    ${H1(first ? `${first},` : "")}
    ${P(`Just saw you wrapped ${done}. Nice work.`)}
    ${
      opts.next
        ? P(
            `${escapeHtml(opts.next.title)} is next when you want to keep going. Or take a break. Your work's saved either way.`,
          )
        : P(
            "That was the last module. You can export the full Plan as a PDF when you're ready.",
          )
    }
    ${P(
      mp.done >= mp.total
        ? `All ${mp.total} modules done.`
        : `${mp.done} of ${mp.total} down.`,
      true,
    )}
    ${
      opts.next
        ? BTN(`${env.siteUrl}/plan/${opts.next.slug}`, `Open ${escapeHtml(opts.next.title)}`)
        : BTN(`${env.siteUrl}/plan`, "Back to dashboard")
    }
    ${SIG}
  `;
  return { subject, html: wrap(inner) };
}

// ───────────────────────────────────────
// Sender (used by API routes + cron)
// ───────────────────────────────────────
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

export async function sendPlanWelcomeEmail(email: string, name: string) {
  return send(email, renderPlanWelcome({ name }));
}

export async function sendPlanInactive24h(
  email: string,
  name: string,
  module: ModuleInfo,
) {
  return send(email, renderPlanInactive24h({ name, module }));
}

export async function sendPlanInactive72h(
  email: string,
  name: string,
  module: ModuleInfo,
  tip: string,
) {
  return send(email, renderPlanInactive72h({ name, module, tip }));
}

export async function sendPlanInactive7d(
  email: string,
  name: string,
  module: ModuleInfo,
) {
  return send(email, renderPlanInactive7d({ name, module }));
}

export async function sendPlanModuleComplete(
  email: string,
  name: string,
  completed: ModuleInfo,
  next: ModuleInfo | null,
  modulesProgress: { done: number; total: number },
) {
  return send(
    email,
    renderPlanModuleComplete({ name, completed, next, modulesProgress }),
  );
}

// ───────────────────────────────────────
// Module-specific 72h tips (Oge's voice)
// ───────────────────────────────────────
export const MODULE_TIPS: Record<string, string> = {
  "01-your-brand":
    "Don't write the mission for investors. Write it the way you'd say it out loud to a friend at dinner. That's usually closer to the real one.",
  "02-your-market":
    "Forget the market sizing math for now. Just go have five real conversations with people you think would buy this. What they actually say back is the only thing that matters.",
  "03-your-offer":
    "Read your offer out loud. If it takes more than a sentence to explain what someone gets, it's not ready yet. Keep cutting until it's clear.",
  "04-your-plan":
    "Before anything else, figure out your runway. How many months can you keep going without new income? Once that number's honest, every other number means something.",
  "05-your-reach":
    "Pick one platform. The one your customers are already on. Show up there every week without missing. Spreading yourself across five channels is how people burn out.",
  "06-your-funnel":
    "Write down the five reasons someone won't buy from you, and answer each one in a sentence. That's basically your sales page.",
  "07-your-retention":
    "The first 24 hours after someone pays you is when they decide if they trust you. Get the welcome email out fast. Don't make them wait.",
};
