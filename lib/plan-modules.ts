export type ModuleDef = {
  slug: string;
  title: string;
  sequence: number;
};

export const PLAN_MODULES: ModuleDef[] = [
  { slug: "01-your-brand", title: "Your Brand", sequence: 1 },
  { slug: "02-your-market", title: "Your Market", sequence: 2 },
  { slug: "03-your-offer", title: "Your Offer", sequence: 3 },
  { slug: "04-your-plan", title: "Your Plan", sequence: 4 },
  { slug: "05-your-reach", title: "Your Reach", sequence: 5 },
  { slug: "06-your-funnel", title: "Your Funnel", sequence: 6 },
  { slug: "07-your-retention", title: "Your Retention", sequence: 7 },
];

export const TOTAL_MODULES = PLAN_MODULES.length;

const BY_SLUG = new Map(PLAN_MODULES.map((m) => [m.slug, m]));

export function moduleBySlug(slug: string): ModuleDef | null {
  return BY_SLUG.get(slug) ?? null;
}

export function nextModuleAfter(slug: string): ModuleDef | null {
  const cur = BY_SLUG.get(slug);
  if (!cur) return null;
  return PLAN_MODULES.find((m) => m.sequence === cur.sequence + 1) ?? null;
}
