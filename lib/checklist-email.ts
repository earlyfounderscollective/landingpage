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
    .replace(/'/g, "&#39;");
}

const SECTION_TITLE = (n: string, title: string) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9B7A4A;font-weight:600;margin:32px 0 6px 0;">${n}</p>
   <p style="font-family:'Fraunces',Georgia,serif;font-size:20px;color:#23352D;margin:0 0 4px 0;line-height:1.25;letter-spacing:-0.012em;">${title}</p>`;

const SECTION_PROMPT = (text: string) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;color:rgba(17,17,17,0.65);margin:0 0 14px 0;line-height:1.55;font-style:italic;">${text}</p>`;

const CHECK_ITEM = (text: string) =>
  `<p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14.5px;color:rgba(17,17,17,0.82);margin:0 0 8px 0;line-height:1.5;">
    <span style="display:inline-block;width:12px;height:12px;border:1.5px solid #9B7A4A;border-radius:3px;margin-right:10px;vertical-align:-2px;"></span>${text}
  </p>`;

export async function sendChecklistEmail(email: string, name: string) {
  const c = client();
  if (!c) return { skipped: true as const };

  const first = name ? escapeHtml(name.trim().split(/\s+/)[0]) : "";
  const greeting = first ? `Hey ${first},` : "Hey,";

  const inner = `
    <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:30px;line-height:1.18;color:#23352D;margin:0 0 24px 0;letter-spacing:-0.015em;">
      ${greeting}
    </h1>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 16px 0;line-height:1.65;">
      Here's the Founder Sales &amp; Systems Checklist. Read through it once. Then go back and be honest about which boxes you can actually check.
    </p>
    <p style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:16px;color:rgba(17,17,17,0.78);margin:0 0 24px 0;line-height:1.65;">
      Wherever you can't check 80% of the boxes is where your business is actually stuck. Start there.
    </p>

    ${SECTION_TITLE("01", "Clarity")}
    ${SECTION_PROMPT("Can you say your offer in one sentence?")}
    ${CHECK_ITEM("I know exactly what I sell.")}
    ${CHECK_ITEM("I know exactly who it's for.")}
    ${CHECK_ITEM("I know the one outcome they get from buying.")}

    ${SECTION_TITLE("02", "Visibility")}
    ${SECTION_PROMPT("Where do customers actually see you?")}
    ${CHECK_ITEM("I know the one platform my customer spends time on.")}
    ${CHECK_ITEM("I've shown up there at least once this week.")}
    ${CHECK_ITEM("My bio makes the offer clear in one read.")}

    ${SECTION_TITLE("03", "Sales process")}
    ${SECTION_PROMPT("What happens when someone is interested?")}
    ${CHECK_ITEM("Every post or conversation points to one clear next step.")}
    ${CHECK_ITEM("I have a way to capture their email or contact.")}
    ${CHECK_ITEM("I follow up within 48 hours.")}

    ${SECTION_TITLE("04", "Follow-up")}
    ${SECTION_PROMPT("Are leads slipping through?")}
    ${CHECK_ITEM("I keep track of every lead in one place.")}
    ${CHECK_ITEM("I follow up at least twice before assuming it's a no.")}
    ${CHECK_ITEM("I have a script for the objections that come up most.")}

    ${SECTION_TITLE("05", "Systems")}
    ${SECTION_PROMPT("What's the weekly rhythm?")}
    ${CHECK_ITEM("There's a recurring time block where I talk to customers.")}
    ${CHECK_ITEM("There's a recurring time block where I create content.")}
    ${CHECK_ITEM("I review one number every week (leads, sales, or conversations).")}

    ${SECTION_TITLE("06", "Consistency")}
    ${SECTION_PROMPT("What keeps you showing up?")}
    ${CHECK_ITEM("I have at least one person or room that holds me accountable.")}
    ${CHECK_ITEM("I know what I'm working on this week, not just this quarter.")}
    ${CHECK_ITEM("I'm building one thing at a time, not five.")}

    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:18px;color:#23352D;border-left:3px solid #9B7A4A;padding:6px 0 6px 18px;margin:36px 0 28px 0;line-height:1.5;">
      Wherever you can't check 80% of the boxes is where your business is actually stuck. Start there.
    </p>

    <div style="margin:0 0 32px 0;">
      <a href="${env.siteUrl}/apply" style="display:inline-block;background:#23352D;color:#F7F2EA;font-family:ui-sans-serif,system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:0.02em;text-decoration:none;padding:14px 26px;border-radius:9999px;">
        Apply to Early Founders
      </a>
    </div>

    <p style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:17px;color:rgba(35,53,45,0.85);margin:0;">
      Oge
    </p>
  `;

  return c.emails.send({
    from: `Early Founders Collective <${env.resendFromEmail}>`,
    to: email,
    subject: "Your Founder Sales & Systems Checklist",
    html: wrap(inner),
  });
}
