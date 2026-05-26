import Stripe from "stripe";
import { env } from "./env";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (cached) return cached;
  if (!env.stripeSecretKey) return null;
  cached = new Stripe(env.stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
    appInfo: {
      name: "Early Founders Collective",
      url: env.siteUrl,
    },
  });
  return cached;
}
