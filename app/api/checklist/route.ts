import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendChecklistEmail } from "@/lib/checklist-email";

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
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().toLowerCase();
  const source = String(body.source ?? "homepage").trim().slice(0, 60);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (email.length > 320) {
    return NextResponse.json({ error: "Email too long" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("checklist_subscribers")
      .upsert(
        { email, name: name || null, source },
        { onConflict: "email" },
      );
    if (error) {
      console.error("checklist_subscribers upsert failed (non-blocking):", error);
    }
  }

  try {
    await sendChecklistEmail(email, name);
  } catch (err) {
    console.error("Checklist email failed:", err);
    return NextResponse.json(
      { error: "Could not send the checklist. Try again in a minute." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
