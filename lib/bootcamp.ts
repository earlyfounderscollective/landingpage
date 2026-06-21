import { getSupabaseAdmin } from "./supabase";

export type BootcampConfig = {
  id: string;
  cohortStartDate: string | null; // ISO date string
  cohortLabel: string;
  priceCents: number;
  originalPriceCents: number;
  isOpen: boolean;
  videoUrl: string | null;
};

const FALLBACK: BootcampConfig = {
  id: "fallback",
  cohortStartDate: null,
  cohortLabel: "Next cohort opens soon",
  priceCents: 49_700,
  originalPriceCents: 99_700,
  isOpen: true,
  videoUrl: null,
};

export async function getBootcampConfig(): Promise<BootcampConfig> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return FALLBACK;

  const { data, error } = await supabase
    .from("bootcamp_config")
    .select(
      "id, cohort_start_date, cohort_label, price_cents, original_price_cents, is_open, video_url",
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    id: data.id,
    cohortStartDate: data.cohort_start_date ?? null,
    cohortLabel: data.cohort_label ?? FALLBACK.cohortLabel,
    priceCents: data.price_cents ?? FALLBACK.priceCents,
    originalPriceCents: data.original_price_cents ?? FALLBACK.originalPriceCents,
    isOpen: data.is_open ?? true,
    videoUrl: data.video_url ?? null,
  };
}

export function formatCohortDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
