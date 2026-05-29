import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendPlanWelcomeEmail } from "@/lib/plan-emails";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (typeof body._gotcha === "string" && body._gotcha.length > 0) {
    return NextResponse.json({ ok: true, projectId: "honeypot" });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (email.length > 320) {
    return NextResponse.json({ error: "Email too long" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data: existing, error: lookupErr } = await supabase
    .from("plan_projects")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupErr) {
    console.error("plan_projects lookup failed:", lookupErr);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ projectId: existing.id, isNew: false });
  }

  const firstName = name.split(" ")[0] || "";
  const title = firstName ? `${firstName}'s Plan` : "My Plan";

  const { data: inserted, error: insertErr } = await supabase
    .from("plan_projects")
    .insert({
      email,
      name: name || null,
      title,
      status: "active",
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("plan_projects insert failed:", insertErr);
    return NextResponse.json({ error: "Could not create project" }, { status: 500 });
  }

  try {
    await sendPlanWelcomeEmail(email, name);
  } catch (err) {
    console.error("Welcome email failed (non-blocking):", err);
  }

  return NextResponse.json({ projectId: inserted.id, isNew: true });
}
