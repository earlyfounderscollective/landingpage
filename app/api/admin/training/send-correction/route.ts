import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";
import { env } from "@/lib/env";
import { getActiveTrainingEvent } from "@/lib/training";
import { sendTrainingCorrection } from "@/lib/training-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authOk(req: Request): boolean {
  if (isAdmin()) return true;
  if (!env.cronSecret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${env.cronSecret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === env.cronSecret;
}

// One-shot broadcast for correcting a wrong-timing reminder that
// already went out. Admin session OR cron secret required. Sends the
// correction to every registration for the currently active event.
//
// Idempotency: logs into training_email_log with kind="correction" so
// re-running is safe — anyone already corrected is skipped.
export async function POST(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const event = await getActiveTrainingEvent();
  if (!event) {
    return NextResponse.json(
      { error: "No active training event." },
      { status: 400 },
    );
  }

  const { data: regs, error: regsErr } = await supabase
    .from("training_registrations")
    .select("id, email, full_name")
    .eq("event_id", event.id);

  if (regsErr) {
    return NextResponse.json({ error: regsErr.message }, { status: 500 });
  }
  if (!regs || regs.length === 0) {
    return NextResponse.json({ ok: true, eligible: 0, sent: 0, skipped: 0, errors: 0 });
  }

  const { data: alreadySent } = await supabase
    .from("training_email_log")
    .select("registration_id")
    .eq("event_id", event.id)
    .eq("kind", "correction");

  const sentSet = new Set(
    (alreadySent ?? []).map((r) => r.registration_id as string),
  );

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  const errorSamples: string[] = [];

  for (const reg of regs) {
    if (!reg.email) {
      skipped++;
      continue;
    }
    if (sentSet.has(reg.id as string)) {
      skipped++;
      continue;
    }

    try {
      await sendTrainingCorrection(reg.email, reg.full_name ?? "", event);
      await supabase.from("training_email_log").insert({
        registration_id: reg.id,
        event_id: event.id,
        email: reg.email,
        kind: "correction",
      });
      sent++;
    } catch (err) {
      errors++;
      if (errorSamples.length < 5) {
        errorSamples.push(String(err instanceof Error ? err.message : err));
      }
    }
  }

  return NextResponse.json({
    ok: true,
    eventId: event.id,
    eligible: regs.length,
    sent,
    skipped,
    errors,
    errorSamples,
  });
}
