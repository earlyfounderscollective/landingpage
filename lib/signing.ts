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

/**
 * Namespaced variant for the discovery-call admin buttons. Same algorithm,
 * different prefix so tokens can't be replayed across contexts.
 */
export function signDiscoveryDecisionToken(id: string, action: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`discovery:${id}:${action}`)
    .digest("hex");
}

export function verifyDiscoveryDecisionToken(
  id: string,
  action: string,
  token: string,
): boolean {
  const expected = signDiscoveryDecisionToken(id, action);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/**
 * One-click unsubscribe links embedded in checklist nurture emails. Signs
 * the lowercased email so the link can't be guessed or replayed against
 * another address.
 */
export function signChecklistUnsubscribeToken(email: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`checklist_unsub:${email.toLowerCase()}`)
    .digest("hex");
}

export function verifyChecklistUnsubscribeToken(
  email: string,
  token: string,
): boolean {
  const expected = signChecklistUnsubscribeToken(email);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/**
 * Signs a DFY checkout link so only an applicant who's been accepted
 * can hit /dfy/checkout?token=X. The link goes in the acceptance email.
 */
export function signDFYCheckoutToken(applicationId: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`dfy_checkout:${applicationId}`)
    .digest("hex");
}

export function verifyDFYCheckoutToken(
  applicationId: string,
  token: string,
): boolean {
  const expected = signDFYCheckoutToken(applicationId);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/**
 * Signs a "this email was a training registrant" token so links inside
 * training emails can unlock the $47 kit price even if the recipient's
 * registration row is missing or their email matches inexactly. Verifies
 * the email is bound to the token so the link can't be replayed for a
 * different address.
 */
export function signKitRegistrantToken(email: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`kit_registrant:${email.toLowerCase()}`)
    .digest("hex");
}

export function verifyKitRegistrantToken(
  email: string,
  token: string,
): boolean {
  const expected = signKitRegistrantToken(email);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
