export type KitModuleSlug =
  | "01-offer-clarity"
  | "02-business-setup"
  | "03-pricing"
  | "04-ai-prompts"
  | "05-first-30"
  | "06-lead-tracker";

export type KitModule = {
  n: string;
  slug: KitModuleSlug;
  title: string;
  desc: string;
  estimate: string;
};

export const KIT_MODULES: KitModule[] = [
  {
    n: "01",
    slug: "01-offer-clarity",
    title: "Offer Clarity Worksheet",
    desc: "Get to your one-sentence offer. What you sell, who it's for, what changes.",
    estimate: "20 min",
  },
  {
    n: "02",
    slug: "02-business-setup",
    title: "Business Setup Checklist",
    desc: "Entity, EIN, business banking, payments. Skip the consultant.",
    estimate: "30 min",
  },
  {
    n: "03",
    slug: "03-pricing",
    title: "Pricing Model Template",
    desc: "Hourly floor, market range, recommended start. The price you'll defend.",
    estimate: "15 min",
  },
  {
    n: "04",
    slug: "04-ai-prompts",
    title: "10 AI Prompts I Actually Use",
    desc: "Copy/paste prompts for offer, pricing, outreach, and objections.",
    estimate: "10 min",
  },
  {
    n: "05",
    slug: "05-first-30",
    title: "First 30 Customers Playbook",
    desc: "Five-day execution sprint. A-list outreach, referral asks, distribution.",
    estimate: "1 week",
  },
  {
    n: "06",
    slug: "06-lead-tracker",
    title: "Lead Tracker Sheet",
    desc: "Where every conversation goes. Pipeline value, status, follow-up dates.",
    estimate: "ongoing",
  },
];
