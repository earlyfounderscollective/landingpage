import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getActiveTrainingEvent } from "@/lib/training";
import { sendTrainingRegistrationEmail } from "@/lib/training-emails";

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
  const source = String(body.source ?? "training").trim().slice(0, 60);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (email.length > 320) {
    return NextResponse.json({ error: "Email too long" }, { status: 400 });
  }

  const event = await getActiveTrainingEvent();
  if (!event) {
    return NextResponse.json(
      { error: "No active training scheduled" },
      { status: 503 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("training_registrations")
      .upsert(
        {
          email,
          full_name: name || null,
          event_id: event.id,
          source,
        },
        { onConflict: "email,event_id" },
      );
    if (error) {
      console.error("training_registrations upsert failed:", error);
    }
  }

  try {
    await sendTrainingRegistrationEmail(email, name, event);
  } catch (err) {
    console.error("training confirmation email failed (non-blocking):", err);
  }

  return NextResponse.json({ ok: true });
}
