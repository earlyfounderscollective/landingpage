import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabase";

/**
 * Referral program config — bootcamp grads earn $50 cash for each friend
 * who buys the bootcamp. The friend gets $100 off their purchase.
 * Payout becomes eligible 30 days after the friend's cohort ends.
 */
export const REFERRAL = {
  friendDiscountCents: 10_000, // $100 off
  gradPayoutCents: 5_000, // $50 cash to the referrer
  programLengthDays: 28, // 4 weeks
  payoutDelayDays: 30, // wait 30 days after cohort end before grad is paid
} as const;

// Unambiguous alphabet — no 0/O, no 1/I, no L
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function makeCode(len = 6): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/**
 * Returns the existing code for this grad, or generates a new unique one.
 * Idempotent — safe to call multiple times for the same email.
 */
export async function getOrCreateReferralCode(
  email: string,
  orderId?: string | null,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const normalized = email.trim().toLowerCase();

  // Existing?
  const { data: existing } = await supabase
    .from("bootcamp_referral_codes")
    .select("code")
    .eq("grad_email", normalized)
    .maybeSingle();

  if (existing?.code) return existing.code;

  // Generate unique
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = makeCode();
    const { error } = await supabase
      .from("bootcamp_referral_codes")
      .insert({
        code,
        grad_email: normalized,
        grad_order_id: orderId ?? null,
      });
    if (!error) return code;
    // Otherwise it was a collision — try again
  }
  return null;
}

export async function lookupReferralCode(rawCode: string): Promise<{
  code: string;
  gradEmail: string;
} | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  const { data } = await supabase
    .from("bootcamp_referral_codes")
    .select("code, grad_email")
    .eq("code", code)
    .maybeSingle();

  if (!data) return null;
  return { code: data.code, gradEmail: String(data.grad_email) };
}

/**
 * Computes when the referrer's payout becomes eligible — 30 days after
 * the friend's cohort would have ended.
 */
export function computePayoutDueAt(cohortStartIso: string | null): {
  cohortStartDate: string | null;
  payoutDueAt: string;
} {
  const now = Date.now();
  const start = cohortStartIso ? new Date(`${cohortStartIso}T12:00:00`).getTime() : now;
  const cohortEnd = start + REFERRAL.programLengthDays * 24 * 3600_000;
  const due = cohortEnd + REFERRAL.payoutDelayDays * 24 * 3600_000;
  return {
    cohortStartDate: cohortStartIso ?? null,
    payoutDueAt: new Date(due).toISOString(),
  };
}

export async function recordRedemption(opts: {
  code: string;
  friendEmail: string;
  friendOrderId: string | null;
  cohortStartDate: string | null;
}): Promise<{ id: string } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { payoutDueAt } = computePayoutDueAt(opts.cohortStartDate);

  const { data, error } = await supabase
    .from("bootcamp_referral_redemptions")
    .insert({
      code: opts.code,
      friend_email: opts.friendEmail.trim().toLowerCase(),
      friend_order_id: opts.friendOrderId,
      discount_applied_cents: REFERRAL.friendDiscountCents,
      payout_amount_cents: REFERRAL.gradPayoutCents,
      cohort_start_date: opts.cohortStartDate,
      payout_due_at: payoutDueAt,
      payout_status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) return null;
  return { id: data.id };
}
