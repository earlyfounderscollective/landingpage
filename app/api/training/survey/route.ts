import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getActiveTrainingEvent } from "@/lib/training";

export const runtime = "nodejs";

function clampRating(v: unknown): number | null {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  if (r < 1 || r > 5) return null;
  return r;
}

function cleanText(v: unknown, max = 2000): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  return s.slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (typeof body._gotcha === "string" && body._gotcha.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const rating = clampRating(body.rating);
  if (rating === null) {
    return NextResponse.json(
      { error: "Please rate the training first" },
      { status: 400 },
    );
  }

  const email =
    String(body.email ?? "").trim().toLowerCase().slice(0, 320) || null;
  const fullName = cleanText(body.name, 200);

  // Best-effort: tie the response to the current training. Not required.
  const event = await getActiveTrainingEvent();

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("training_survey_responses")
      .insert({
        event_id: event?.id ?? null,
        email,
        full_name: fullName,
        rating,
        most_valuable: cleanText(body.most_valuable),
        confusing: cleanText(body.confusing),
        wish_covered: cleanText(body.wish_covered),
        kit_likelihood: clampRating(body.kit_likelihood),
        cohort_likelihood: clampRating(body.cohort_likelihood),
        barrier: cleanText(body.barrier),
        other: cleanText(body.other),
        source: cleanText(body.source, 60) ?? "training_survey",
      });
    if (error) {
      console.error("training_survey_responses insert failed:", error);
      return NextResponse.json({ error: "Could not save" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
