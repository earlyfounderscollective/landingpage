// Render preview HTML for every Plan email template.
// Mirrors lib/plan-emails.ts. Run: node scripts/preview-plan-emails.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = "https://earlyfounderscollective.com";

const wrap = (inner) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;background:#F7F2EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EA;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(17,17,17,0.06);border-radius:16px;padding:48px 40px;">
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 36px 0;">
            <tr><td align="center">
              <img src="${SITE}/email-logo.png" width="180" height="87" alt="Early Founders Collective" style="display:block;width:180px;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;" />
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

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const H1 = (text) =>
  `<h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">${text}</h1>`;

const P = (text, last = false) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 ${last ? "28px" : "16px"} 0;line-height:1.65;">${text}</p>`;

const BTN = (href, label) =>
  `<div style="margin:8px 0 32px 0;">
    <a href="${href}" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">
      ${label}
    </a>
  </div>`;

const SIG = `<p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">Oge</p>`;

const first = "Oge";

const samples = [
  {
    file: "01-welcome.html",
    label: "Welcome (sent on signup)",
    subject: "your Plan is saved",
    inner: `
      ${H1(`Hey ${first},`)}
      ${P("Just wanted to say your Plan is saved. Anything you put in stays there, even if you close the tab.")}
      ${P("There's seven modules. Don't try to do them all at once. Pick at it over a few weeks.")}
      ${P("Module 01 is Your Brand. That's the place to start.", true)}
      ${BTN(`${SITE}/plan/01-your-brand`, "Open Your Brand")}
      ${SIG}
    `,
  },
  {
    file: "02-inactive-24h.html",
    label: "24h paused (example: Your Brand)",
    subject: "your Your Brand draft is saved".replace("your Your", "your"),
    inner: `
      ${H1(`Hey ${first},`)}
      ${P("You started Your Brand yesterday and didn't finish. Just making sure you knew everything's saved.")}
      ${P("Come back when you have a few minutes. No pressure.", true)}
      ${BTN(`${SITE}/plan/01-your-brand`, "Pick Your Brand back up")}
      ${SIG}
    `,
  },
  {
    file: "03-inactive-72h.html",
    label: "72h paused (example: Your Plan, with runway tip)",
    subject: "stuck on Your Plan?",
    inner: `
      ${H1(`${first},`)}
      ${P("A lot of people get stuck on Your Plan. You're not alone there.")}
      ${P("If I were sitting next to you, here's what I'd say: Before anything else, figure out your runway. How many months can you keep going without new income? Once that number's honest, every other number means something.")}
      ${P("Pick it back up when you have a few minutes.", true)}
      ${BTN(`${SITE}/plan/04-your-plan`, "Open Your Plan")}
      ${SIG}
    `,
  },
  {
    file: "04-inactive-7d.html",
    label: "7d paused (example: Your Funnel)",
    subject: "checking in",
    inner: `
      ${H1(`Hey ${first},`)}
      ${P("It's been about a week since you touched Your Funnel. No judgement, just checking in.")}
      ${P("If it helps: finish a rough version this week and drop it in the community. Other people in there are working on the same stuff, and the feedback's usually better than mine alone.", true)}
      ${BTN(`${SITE}/plan/06-your-funnel`, "Open Your Funnel")}
      ${SIG}
    `,
  },
  {
    file: "05-module-complete.html",
    label: "Module complete (example: Your Brand done → Your Market next, 1 of 7)",
    subject: "Your Brand done",
    inner: `
      ${H1(`${first},`)}
      ${P("Just saw you wrapped Your Brand. Nice work.")}
      ${P("Your Market is next when you want to keep going. Or take a break. Your work's saved either way.")}
      ${P("1 of 7 down.", true)}
      ${BTN(`${SITE}/plan/02-your-market`, "Open Your Market")}
      ${SIG}
    `,
  },
];

const HOME = process.env.HOME || "/Users/moneymadu";
const outDir = join(HOME, "Downloads", "efc-plan-emails");
mkdirSync(outDir, { recursive: true });

const indexRows = [];
for (const s of samples) {
  const html = wrap(s.inner);
  const path = join(outDir, s.file);
  writeFileSync(path, html);
  indexRows.push(
    `<li><a href="${s.file}" style="font-family:ui-sans-serif,system-ui,sans-serif;color:#23352D;font-size:15px;text-decoration:none;">${esc(s.label)}</a><br/><span style="font-family:ui-sans-serif,system-ui,sans-serif;color:rgba(17,17,17,0.55);font-size:12.5px;">Subject: <em>${esc(s.subject)}</em></span></li>`,
  );
  console.log(`✓ ${s.file}`);
}

writeFileSync(
  join(outDir, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>EFC Plan email previews</title>
  <body style="font-family:ui-sans-serif,system-ui,sans-serif;background:#F7F2EA;padding:48px 24px;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9B7A4A;margin:0 0 6px 0;">EFC · The Plan</p>
      <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:28px;color:#23352D;margin:0 0 20px 0;letter-spacing:-0.015em;">Email previews</h1>
      <p style="color:rgba(17,17,17,0.6);font-size:14px;margin:0 0 24px 0;line-height:1.55;">
        Five emails members will see. Click any to open the rendered version.
      </p>
      <ol style="padding-left:18px;line-height:2.1;">${indexRows.join("")}</ol>
    </div>
  </body>`,
);

console.log(`\nPreviews → ${outDir}`);
console.log(`Open: ${outDir}/index.html`);
