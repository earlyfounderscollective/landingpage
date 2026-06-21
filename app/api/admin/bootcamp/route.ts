import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cohort_start_date =
    typeof body.cohort_start_date === "string" && body.cohort_start_date
      ? body.cohort_start_date
      : null;
  const cohort_label = String(body.cohort_label ?? "").trim().slice(0, 200);
  const price_cents = Math.max(0, Math.round(Number(body.price_cents ?? 0)));
  const original_price_cents = Math.max(
    0,
    Math.round(Number(body.original_price_cents ?? 0)),
  );
  const is_open = body.is_open === true;

  if (!cohort_label) {
    return NextResponse.json({ error: "Label required" }, { status: 400 });
  }
  if (price_cents <= 0) {
    return NextResponse.json({ error: "Price must be > 0" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Single-row config — update the active row, or insert if missing
  const { data: existing } = await supabase
    .from("bootcamp_config")
    .select("id")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const patch = {
    cohort_start_date,
    cohort_label,
    price_cents,
    original_price_cents,
    is_open,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("bootcamp_config")
      .update(patch)
      .eq("id", existing.id);
    if (error) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("bootcamp_config")
      .insert({ ...patch, is_active: true });
    if (error) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
