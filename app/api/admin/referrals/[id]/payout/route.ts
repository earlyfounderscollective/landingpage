import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED = new Set(["paid", "voided", "eligible"]);

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

  const action = String(body.action ?? "");
  if (!ALLOWED.has(action)) {
    return NextResponse.json({ error: "Bad action" }, { status: 400 });
  }

  const reason =
    typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : null;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const patch: Record<string, unknown> = { payout_status: action };
  if (action === "paid") {
    patch.paid_at = new Date().toISOString();
    patch.void_reason = null;
  } else if (action === "voided") {
    patch.void_reason = reason;
    patch.paid_at = null;
  } else {
    patch.paid_at = null;
    patch.void_reason = null;
  }

  const { error } = await supabase
    .from("bootcamp_referral_redemptions")
    .update(patch)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
