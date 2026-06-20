import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED = new Set(["new", "contacted", "scheduled", "closed", "passed"]);

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = String(body.status ?? "");
  if (!ALLOWED.has(status)) {
    return NextResponse.json({ error: "Bad status" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { error } = await supabase
    .from("dfy_applications")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
