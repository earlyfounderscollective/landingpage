/**
 * AI image slot system.
 *
 * Pages reference images by named slot (e.g. "bootcamp.hero"). Admin
 * generates an image via DALL-E 3 in /admin/images, picks a slot to
 * assign it to, and the next page render picks up the new URL.
 *
 * Storage flow on generate:
 *   1. OpenAI returns a temp URL.
 *   2. We download the bytes server-side.
 *   3. Upload to Supabase Storage bucket `ai-images` (auto-created on
 *      first call).
 *   4. Insert into ai_image_history.
 *   5. If slot_key was provided, upsert ai_image_slots.
 */
import { getSupabaseAdmin } from "./supabase";

export type ImageSlotKey =
  | "bootcamp.hero"
  | "bootcamp.foundation_clarity"
  | "bootcamp.foundation_structure"
  | "bootcamp.foundation_customers"
  | "bootcamp.foundation_growth"
  | "dfy.hero"
  | "kit.hero"
  | "home.hero";

export const SLOTS: { key: ImageSlotKey; label: string; hint: string }[] = [
  {
    key: "bootcamp.hero",
    label: "Bootcamp · Hero background",
    hint: "Abstract editorial graphic behind the headline. Brass + forest, no text.",
  },
  {
    key: "bootcamp.foundation_clarity",
    label: "Bootcamp · Foundation 1 (Clarity)",
    hint: "Illustration evoking clarity — minimal, on-brand.",
  },
  {
    key: "bootcamp.foundation_structure",
    label: "Bootcamp · Foundation 2 (Structure)",
    hint: "Illustration evoking structure / scaffolding.",
  },
  {
    key: "bootcamp.foundation_customers",
    label: "Bootcamp · Foundation 3 (Customers)",
    hint: "Illustration evoking conversations / people / connection.",
  },
  {
    key: "bootcamp.foundation_growth",
    label: "Bootcamp · Foundation 4 (Growth)",
    hint: "Illustration evoking growth / momentum / 90-day path.",
  },
  {
    key: "dfy.hero",
    label: "DFY · Hero background",
    hint: "Premium editorial graphic for the Done-For-You page.",
  },
  {
    key: "kit.hero",
    label: "Kit · Hero",
    hint: "Sales page hero for Build Your Business Kit.",
  },
  {
    key: "home.hero",
    label: "Home · Hero",
    hint: "Main marketing site hero.",
  },
];

export async function getImageSlot(
  key: ImageSlotKey,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ai_image_slots")
    .select("image_url")
    .eq("slot_key", key)
    .maybeSingle();
  return data?.image_url ?? null;
}

export async function getAllImageSlots(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};
  const { data } = await supabase
    .from("ai_image_slots")
    .select("slot_key, image_url");
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.slot_key as string] = row.image_url as string;
  }
  return map;
}

/**
 * Ensures the public 'ai-images' bucket exists. Safe to call repeatedly —
 * Supabase returns a friendly error if it already exists and we swallow it.
 */
export async function ensureBucket() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    const { data: existing } = await supabase.storage.getBucket("ai-images");
    if (existing) return;
  } catch {
    /* fall through */
  }
  try {
    await supabase.storage.createBucket("ai-images", {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });
  } catch (err) {
    // Bucket may already exist — log but don't throw
    console.warn("ai-images bucket create:", err);
  }
}

export type ImageRecord = {
  id: string;
  image_url: string;
  prompt: string | null;
  model: string | null;
  size: string | null;
  quality: string | null;
  style: string | null;
  created_at: string;
};

export async function getRecentHistory(limit = 24): Promise<ImageRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_image_history")
    .select("id, image_url, prompt, model, size, quality, style, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as ImageRecord[];
}
