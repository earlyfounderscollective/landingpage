import { createHmac, timingSafeEqual } from "crypto";
import { env } from "./env";

/**
 * Deterministically signs an application decision URL so the one-click
 * Accept / Decline / Waitlist buttons inside the admin notification email
 * can't be guessed or replayed by anyone who doesn't hold the secret.
 *
 * The token is HMAC-SHA256(`${id}:${action}`, ADMIN_ACTION_SECRET) hex-encoded.
 */
export function signDecisionToken(id: string, action: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`${id}:${action}`)
    .digest("hex");
}

export function verifyDecisionToken(
  id: string,
  action: string,
  token: string,
): boolean {
  const expected = signDecisionToken(id, action);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
