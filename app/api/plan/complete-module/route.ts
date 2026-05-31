import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendPlanModuleComplete } from "@/lib/plan-emails";
import {
  PLAN_MODULES,
  TOTAL_MODULES,
  moduleBySlug,
  nextModuleAfter,
} from "@/lib/plan-modules";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const projectId = String(body.projectId ?? "").trim();
  const moduleSlug = String(body.moduleSlug ?? "").trim();

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }
  const moduleInfo = moduleBySlug(moduleSlug);
  if (!moduleInfo) {
    return NextResponse.json({ error: "Invalid moduleSlug" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const nowIso = new Date().toISOString();

  // Check if this module is already marked complete (don't re-send email).
  const { data: existing } = await supabase
    .from("plan_progress")
    .select("is_completed")
    .eq("project_id", projectId)
    .eq("module_slug", moduleSlug)
    .maybeSingle();

  const wasAlreadyComplete = existing?.is_completed === true;

  const { error: upErr } = await supabase
    .from("plan_progress")
    .upsert(
      {
        project_id: projectId,
        module_slug: moduleSlug,
        is_completed: true,
        completed_at: nowIso,
        updated_at: nowIso,
      },
      { onConflict: "project_id,module_slug" },
    );

  if (upErr) {
    console.error("plan_progress upsert failed:", upErr);
    return NextResponse.json({ error: "Could not mark complete" }, { status: 500 });
  }

  await supabase
    .from("plan_projects")
    .update({
      last_active_at: nowIso,
      last_module_slug: moduleSlug,
      updated_at: nowIso,
    })
    .eq("id", projectId);

  // Count how many modules are now complete for this project.
  const { data: completedRows } = await supabase
    .from("plan_progress")
    .select("module_slug")
    .eq("project_id", projectId)
    .eq("is_completed", true);

  const validSlugs = new Set(PLAN_MODULES.map((m) => m.slug));
  const completedCount =
    completedRows?.filter((r) => validSlugs.has(r.module_slug)).length ?? 1;

  const nextModule = nextModuleAfter(moduleSlug);

  if (!wasAlreadyComplete) {
    // Fetch email + name for the project.
    const { data: project } = await supabase
      .from("plan_projects")
      .select("email, name")
      .eq("id", projectId)
      .maybeSingle();

    if (project?.email) {
      try {
        await sendPlanModuleComplete(
          project.email,
          project.name ?? "",
          { slug: moduleInfo.slug, title: moduleInfo.title },
          nextModule ? { slug: nextModule.slug, title: nextModule.title } : null,
          { done: completedCount, total: TOTAL_MODULES },
        );
        await supabase.from("plan_email_log").insert({
          project_id: projectId,
          kind: "module_complete",
          module_slug: moduleSlug,
        });
      } catch (err) {
        console.error("Module complete email failed (non-blocking):", err);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    completedCount,
    totalModules: TOTAL_MODULES,
    nextSlug: nextModule?.slug ?? null,
    wasAlreadyComplete,
  });
}
