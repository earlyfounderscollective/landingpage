import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendDFYApplicationAdminEmail, type DFYApplication } from "@/lib/dfy-email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (k: string, max = 2000) => String(body[k] ?? "").trim().slice(0, max);
  const email = str("email", 320).toLowerCase();
  const full_name = str("full_name", 200);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!full_name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const row = {
    full_name,
    email,
    phone: str("phone", 60) || null,
    business_name: str("business_name", 200) || null,
    business_stage: str("business_stage", 200) || null,
    monthly_revenue: str("monthly_revenue", 100) || null,
    what_you_sell: str("what_you_sell", 4000) || null,
    biggest_blocker: str("biggest_blocker", 4000) || null,
    budget: str("budget", 100) || null,
    timeline: str("timeline", 100) || null,
    status: "new",
  };

  const supabase = getSupabaseAdmin();
  let insertedId = "";
  if (supabase) {
    const { data, error } = await supabase
      .from("dfy_applications")
      .insert(row)
      .select("id")
      .single();
    if (error) {
      console.error("dfy_applications insert failed:", error);
      return NextResponse.json({ error: "Couldn't save" }, { status: 500 });
    }
    insertedId = data?.id ?? "";
  }

  try {
    await sendDFYApplicationAdminEmail({
      id: insertedId,
      ...row,
    } as DFYApplication);
  } catch (err) {
    console.error("dfy admin email failed (non-blocking):", err);
  }

  return NextResponse.json({ ok: true });
}
