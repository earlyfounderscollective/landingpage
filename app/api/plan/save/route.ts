import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const VALID_SLUGS = new Set([
  "01-your-brand",
  "02-your-market",
  "03-your-offer",
  "04-your-plan",
  "05-your-reach",
  "06-your-funnel",
  "07-your-retention",
]);

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const projectId = String(body.projectId ?? "").trim();
  const moduleSlug = String(body.moduleSlug ?? "").trim();
  const answers = body.answers;

  if (!projectId || projectId.length > 64) {
    return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
  }
  if (!VALID_SLUGS.has(moduleSlug)) {
    return NextResponse.json({ error: "Invalid moduleSlug" }, { status: 400 });
  }
  if (typeof answers !== "object" || answers === null || Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }
  // Rough size guard — JSONB can handle a lot, but reject anything absurd.
  const serialized = JSON.stringify(answers);
  if (serialized.length > 200_000) {
    return NextResponse.json({ error: "Answers too large" }, { status: 413 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const nowIso = new Date().toISOString();

  const { error: upErr } = await supabase
    .from("plan_responses")
    .upsert(
      {
        project_id: projectId,
        module_slug: moduleSlug,
        field_key: "answers",
        field_value: answers,
        updated_at: nowIso,
      },
      { onConflict: "project_id,module_slug,field_key" },
    );

  if (upErr) {
    console.error("plan_responses upsert failed:", upErr);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }

  const { error: touchErr } = await supabase
    .from("plan_projects")
    .update({
      last_active_at: nowIso,
      last_module_slug: moduleSlug,
      updated_at: nowIso,
    })
    .eq("id", projectId);

  if (touchErr) {
    console.error("plan_projects touch failed (non-blocking):", touchErr);
  }

  return NextResponse.json({ ok: true, savedAt: nowIso });
}
