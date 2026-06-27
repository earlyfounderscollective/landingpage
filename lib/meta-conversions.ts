import { createHash } from "node:crypto";
import { env } from "./env";

/**
 * Meta Conversions API (server-side event tracking) helper.
 *
 * Why: iOS 14.5+ blocks ~30% of pixel events. Ad blockers block more.
 * CAPI lets us fire the same events from our server so Meta's optimizer
 * still gets the signal — and Meta dedupes against the client pixel
 * event using a matching `event_id`.
 *
 * What we send: hashed PII (email, phone) + IP + user-agent.
 * Meta uses these to match the conversion to the user who saw the ad.
 *
 * Reference: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

function sha256Lower(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export type ConversionEventArgs = {
  eventName: "Lead" | "CompleteRegistration" | "Purchase" | "InitiateCheckout" | "ViewContent";
  // Same UUID/ID used by the client pixel — Meta dedupes against this.
  eventId: string;
  // ISO timestamp; if omitted, defaults to now.
  eventTime?: number;
  // The page URL where the event happened.
  eventSourceUrl?: string;
  // User identifiers — all optional. The MORE we send, the higher
  // Meta's match quality (and the better the ads optimization).
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  // Network signals — pull from the incoming HTTP request.
  clientIp?: string | null;
  userAgent?: string | null;
  // Meta click ID + browser ID — typically read from cookies on the
  // client and passed through to the server. If we don't have them
  // it still works, just lower match quality.
  fbc?: string | null;
  fbp?: string | null;
  // Optional custom value (e.g. a $0 lead, a $497 purchase).
  valueCents?: number;
  currency?: string;
};

export async function sendConversionEvent(
  args: ConversionEventArgs,
): Promise<{ sent: true } | { skipped: true } | { error: string }> {
  if (!env.metaPixelId || !env.metaConversionsApiToken) {
    return { skipped: true };
  }

  const userData: Record<string, string | string[]> = {};
  if (args.email) userData.em = sha256Lower(args.email);
  if (args.phone) {
    // Strip non-digits, then hash. Per Meta spec: no leading +, no spaces.
    const digits = args.phone.replace(/\D/g, "");
    if (digits) userData.ph = sha256Lower(digits);
  }
  if (args.firstName) userData.fn = sha256Lower(args.firstName);
  if (args.lastName) userData.ln = sha256Lower(args.lastName);
  if (args.clientIp) userData.client_ip_address = args.clientIp;
  if (args.userAgent) userData.client_user_agent = args.userAgent;
  if (args.fbc) userData.fbc = args.fbc;
  if (args.fbp) userData.fbp = args.fbp;

  const customData: Record<string, unknown> = {};
  if (typeof args.valueCents === "number") {
    customData.value = args.valueCents / 100;
    customData.currency = args.currency ?? "USD";
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: args.eventName,
        event_time: args.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: args.eventId,
        event_source_url: args.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        ...(Object.keys(customData).length ? { custom_data: customData } : {}),
      },
    ],
  };
  if (env.metaTestEventCode) {
    body.test_event_code = env.metaTestEventCode;
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${env.metaPixelId}/events?access_token=${encodeURIComponent(env.metaConversionsApiToken)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Meta CAPI error:", res.status, text);
      return { error: `Meta CAPI ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("Meta CAPI request failed:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Extracts the best-available client IP from a Next.js Request. Trusts
 * the standard reverse-proxy headers set by Vercel.
 */
export function clientIpFromRequest(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}
