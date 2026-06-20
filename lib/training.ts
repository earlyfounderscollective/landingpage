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
  video_url: string | null;
  status: TrainingEventStatus;
  is_active: boolean;
  updated_at: string;
};

export type EmbedResult =
  | { type: "youtube" | "vimeo" | "loom"; embedUrl: string }
  | { type: "mp4"; embedUrl: string }
  | { type: "unknown"; embedUrl: string }
  | { type: "none" };

/**
 * Detects which embed format a video URL is and returns the iframe-safe URL.
 * Supports YouTube, Vimeo, Loom, direct MP4. Falls back to raw URL.
 */
export function detectVideoEmbed(url: string | null | undefined): EmbedResult {
  if (!url) return { type: "none" };
  const trimmed = url.trim();
  if (!trimmed) return { type: "none" };

  const yt = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&modestbranding=1&rel=0&playsinline=1`,
    };
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&playsinline=1`,
    };
  }

  const loom = trimmed.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/i);
  if (loom) {
    return {
      type: "loom",
      embedUrl: `https://www.loom.com/embed/${loom[1]}?autoplay=1&muted=1`,
    };
  }

  if (/\.(mp4|webm|mov)$/i.test(trimmed)) {
    return { type: "mp4", embedUrl: trimmed };
  }

  return { type: "unknown", embedUrl: trimmed };
}

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
