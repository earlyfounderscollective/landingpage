import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = (searchParams.get("projectId") ?? "").trim();
  const moduleSlug = (searchParams.get("moduleSlug") ?? "").trim();

  if (!projectId || !moduleSlug) {
    return NextResponse.json(
      { error: "Missing projectId or moduleSlug" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("plan_responses")
    .select("field_value, updated_at")
    .eq("project_id", projectId)
    .eq("module_slug", moduleSlug)
    .eq("field_key", "answers")
    .maybeSingle();

  if (error) {
    console.error("plan_responses load failed:", error);
    return NextResponse.json({ error: "Load failed" }, { status: 500 });
  }

  return NextResponse.json({
    answers: data?.field_value ?? null,
    updatedAt: data?.updated_at ?? null,
  });
}
