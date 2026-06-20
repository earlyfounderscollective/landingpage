import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const VALID_STATUSES = new Set(["upcoming", "replay", "between"]);

export async function PATCH(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim().slice(0, 200);
  const startsAtDate = String(body.starts_at_date ?? "").trim();
  const startsAtTime = String(body.starts_at_time ?? "").trim();
  const timezone = String(body.timezone ?? "America/Chicago").trim().slice(0, 60);
  const durationMinutes = Number(body.duration_minutes) || 40;
  const zoomUrl = String(body.zoom_url ?? "").trim();
  const replayUrl = String(body.replay_url ?? "").trim();
  const status = String(body.status ?? "between").trim();

  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Compose starts_at as ISO timestamp from date + time + tz.
  // We treat the input as a wall-clock time in the given timezone.
  let startsAtIso: string | null = null;
  if (startsAtDate && startsAtTime) {
    // Build a Date assuming the input is in the chosen timezone.
    // Trick: format the same wall-clock to UTC by using Intl.DateTimeFormat in reverse.
    const naive = new Date(`${startsAtDate}T${startsAtTime}:00`);
    // naive is interpreted as local server time. We need it in the target tz.
    // Compute the offset for that tz at that moment.
    const tzNow = new Date(
      naive.toLocaleString("en-US", { timeZone: timezone }),
    );
    const utcNow = new Date(
      naive.toLocaleString("en-US", { timeZone: "UTC" }),
    );
    const offset = utcNow.getTime() - tzNow.getTime();
    const actual = new Date(naive.getTime() + offset);
    startsAtIso = actual.toISOString();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data: activeRow } = await supabase
    .from("training_event")
    .select("id")
    .eq("is_active", true)
    .maybeSingle();

  if (!activeRow) {
    return NextResponse.json(
      { error: "No active training row to update" },
      { status: 500 },
    );
  }

  const { error } = await supabase
    .from("training_event")
    .update({
      title,
      starts_at: startsAtIso,
      timezone,
      duration_minutes: durationMinutes,
      zoom_url: zoomUrl || null,
      replay_url: replayUrl || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", activeRow.id);

  if (error) {
    console.error("training_event update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
