/**
 * Pricing + feature flags for the Done-For-You service.
 *
 * Affirm and installments are wired but disabled until Oge enables them.
 * To turn them on, set NEXT_PUBLIC_DFY_AFFIRM_ENABLED / _INSTALLMENTS_ENABLED
 * to "true" in Vercel env (no code change needed).
 */

export const DFY_PRICING = {
  fullPriceCents: 1_000_000, // $10,000
  installmentCents: 500_000, // $5,000 each (x2)
  affirmMinMonthlyCents: 49_900, // ~$499/mo over 24 months
} as const;

export const DFY_FEATURES = {
  payInFull: true, // always on
  installments: process.env.NEXT_PUBLIC_DFY_INSTALLMENTS_ENABLED === "true",
  affirm: process.env.NEXT_PUBLIC_DFY_AFFIRM_ENABLED === "true",
} as const;

export type DFYPlan = "full" | "installments" | "affirm";

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
