import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const COOKIE_NAME = "efc_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sign(payload: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`admin_session:${payload}`)
    .digest("hex");
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * Returns true if the request is from a logged-in admin.
 * Reads the signed cookie set by /api/admin/login.
 */
export function isAdmin(): boolean {
  const store = cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const [expStr, signature] = cookie.value.split(":");
  if (!expStr || !signature) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  return verify(expStr, signature);
}

/**
 * Builds the signed session cookie value. Used by /api/admin/login.
 */
export function buildSessionCookie(): {
  name: string;
  value: string;
  maxAge: number;
} {
  const exp = Date.now() + SESSION_TTL_MS;
  const value = `${exp}:${sign(String(exp))}`;
  return { name: COOKIE_NAME, value, maxAge: SESSION_TTL_MS / 1000 };
}

/**
 * Compares a password against the ADMIN_PASSWORD env var in constant time.
 */
export function checkAdminPassword(password: string): boolean {
  const expected = env.adminPassword;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(password));
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
