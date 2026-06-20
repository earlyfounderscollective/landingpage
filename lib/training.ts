import { getSupabaseAdmin } from "./supabase";

export type TrainingEventStatus = "upcoming" | "replay" | "between";

export type TrainingEvent = {
  id: string;
  title: string;
  starts_at: string | null;
  timezone: string;
  duration_minutes: number;
  zoom_url: string | null;
  replay_url: string | null;
  status: TrainingEventStatus;
  is_active: boolean;
  updated_at: string;
};

/**
 * Returns the single active training event row, or null if none configured.
 * Server-only — uses the service-role Supabase client.
 */
export async function getActiveTrainingEvent(): Promise<TrainingEvent | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("training_event")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getActiveTrainingEvent failed:", error);
    return null;
  }
  return (data as TrainingEvent) ?? null;
}

const TZ_DISPLAY: Record<string, string> = {
  "America/Chicago": "CT",
  "America/New_York": "ET",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
};

export function formatTrainingDateLine(event: TrainingEvent): string {
  if (!event.starts_at) return "";
  const date = new Date(event.starts_at);
  const day = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: event.timezone,
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone,
  });
  const tzAbbr = TZ_DISPLAY[event.timezone] ?? event.timezone;
  return `${day} · ${time} ${tzAbbr}`;
}
