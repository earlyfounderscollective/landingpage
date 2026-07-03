import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";
import { isAdmin } from "./admin-auth";
import { getSupabaseAdmin } from "./supabase";

const COOKIE_NAME = "efc_kit_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAGIC_LINK_TTL_MS = 30 * 60 * 1000; // 30 minutes

function sign(payload: string): string {
  return createHmac("sha256", env.adminActionSecret)
    .update(`kit_session:${payload}`)
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

export function buildKitSessionCookie(email: string): {
  name: string;
  value: string;
  maxAge: number;
} {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${exp}|${email.toLowerCase()}`;
  const value = `${Buffer.from(payload).toString("base64url")}:${sign(payload)}`;
  return { name: COOKIE_NAME, value, maxAge: SESSION_TTL_MS / 1000 };
}

export function getKitSessionEmail(): string | null {
  // Owner bypass: if signed in to /admin, treat them as the admin email.
  // Lets the site operator preview /kit/access without buying or magic links.
  if (isAdmin()) return env.adminEmail.toLowerCase();

  const store = cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const [encoded, signature] = cookie.value.split(":");
  if (!encoded || !signature) return null;

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const [expStr, email] = payload.split("|");
  if (!expStr || !email) return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  if (!verify(payload, signature)) return null;

  return email;
}

export const KIT_COOKIE_NAME = COOKIE_NAME;

export async function createMagicToken(email: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString();

  const { error } = await supabase
    .from("kit_access_tokens")
    .insert({ token, email: email.toLowerCase(), expires_at: expiresAt });

  if (error) return null;
  return token;
}

export async function consumeMagicToken(
  token: string,
): Promise<{ email: string } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("kit_access_tokens")
    .select("email, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;

  // Only expiry invalidates a link — NOT a prior "use". Email security
  // scanners and link prefetchers (Gmail, Outlook Safe Links, corporate
  // antivirus) fire a GET on the magic link the instant it lands in the
  // inbox. If we burned the token on that first touch, the human clicking
  // seconds later would be bounced to /login?error=expired — which is exactly
  // the "every time I enter my email it sends me back to the same link" bug
  // buyers were hitting. Keeping the link valid until it expires (30 min)
  // makes prefetch harmless while staying single-purchase and short-lived.
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Stamp first-use for auditing only; don't gate on it.
  if (!data.used_at) {
    await supabase
      .from("kit_access_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);
  }

  return { email: String(data.email).toLowerCase() };
}

export async function isKitBuyer(email: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { data } = await supabase
    .from("kit_orders")
    .select("id")
    .eq("email", email.toLowerCase())
    .in("status", ["paid", "completed", "succeeded"])
    .limit(1);
  return Boolean(data && data.length > 0);
}
