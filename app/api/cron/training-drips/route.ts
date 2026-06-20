import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";
import {
  sendTraining24hReminder,
  sendTraining1hReminder,
  sendTrainingReplayDelivery,
  sendTrainingKitPitch,
} from "@/lib/training-emails";
import type { TrainingEvent } from "@/lib/training";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Kind = "reminder_24h" | "reminder_1h" | "replay_delivery" | "kit_pitch";

function authOk(req: Request): boolean {
  if (!env.cronSecret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${env.cronSecret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === env.cronSecret;
}

export async function GET(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const now = Date.now();
  const summary: Record<Kind, { eligible: number; sent: number; skipped: number; errors: number }> = {
    reminder_24h: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    reminder_1h: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    replay_delivery: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    kit_pitch: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
  };

  // Pull all active or recent training events. Hourly cron only needs to look
  // at events whose start time is +/- ~30h from now (covers all 4 send windows).
  const lookbackHrs = 30;
  const lookaheadHrs = 30;
  const { data: events } = await supabase
    .from("training_event")
    .select("*")
    .eq("is_active", true)
    .gte("starts_at", new Date(now - lookbackHrs * 3600_000).toISOString())
    .lte("starts_at", new Date(now + lookaheadHrs * 3600_000).toISOString());

  const eventList = (events ?? []) as TrainingEvent[];

  for (const event of eventList) {
    if (!event.starts_at) continue;
    const startsMs = new Date(event.starts_at).getTime();
    const endsMs = startsMs + event.duration_minutes * 60_000;

    // Pull all registrations for this event in one query
    const { data: regs } = await supabase
      .from("training_registrations")
      .select("id, email, full_name, vip")
      .eq("event_id", event.id);

    if (!regs || regs.length === 0) continue;

    // Pull what we've already sent for this event
    const { data: logRows } = await supabase
      .from("training_email_log")
      .select("registration_id, kind")
      .eq("event_id", event.id);

    const sentSet = new Set(
      (logRows ?? []).map((r) => `${r.registration_id}:${r.kind}`),
    );

    for (const reg of regs) {
      if (!reg.email) continue;
      const tasks: { kind: Kind; trigger: boolean }[] = [
        {
          kind: "reminder_24h",
          // Send if event starts in 22-26 hours
          trigger: startsMs - now <= 26 * 3600_000 && startsMs - now >= 22 * 3600_000,
        },
        {
          kind: "reminder_1h",
          // Send if event starts in 30-90 minutes
          trigger: startsMs - now <= 90 * 60_000 && startsMs - now >= 30 * 60_000,
        },
        {
          kind: "replay_delivery",
          // Send 15-75 minutes after event ends
          trigger: now - endsMs >= 15 * 60_000 && now - endsMs <= 75 * 60_000,
        },
        {
          kind: "kit_pitch",
          // Send 23-25 hours after event ends
          trigger: now - endsMs >= 23 * 3600_000 && now - endsMs <= 25 * 3600_000,
        },
      ];

      for (const task of tasks) {
        if (!task.trigger) continue;
        if (sentSet.has(`${reg.id}:${task.kind}`)) {
          summary[task.kind].skipped++;
          continue;
        }
        summary[task.kind].eligible++;
        if (dryRun) {
          summary[task.kind].sent++;
          continue;
        }

        try {
          if (task.kind === "reminder_24h") {
            await sendTraining24hReminder(reg.email, reg.full_name ?? "", event);
          } else if (task.kind === "reminder_1h") {
            await sendTraining1hReminder(reg.email, reg.full_name ?? "", event);
          } else if (task.kind === "replay_delivery") {
            await sendTrainingReplayDelivery(
              reg.email,
              reg.full_name ?? "",
              event,
              Boolean(reg.vip),
            );
          } else if (task.kind === "kit_pitch") {
            await sendTrainingKitPitch(reg.email, reg.full_name ?? "");
          }

          await supabase.from("training_email_log").insert({
            registration_id: reg.id,
            event_id: event.id,
            email: reg.email,
            kind: task.kind,
          });
          summary[task.kind].sent++;
        } catch (err) {
          console.error(`Send failed (${task.kind}, reg ${reg.id}):`, err);
          summary[task.kind].errors++;
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    ranAt: new Date(now).toISOString(),
    eventsConsidered: eventList.length,
    summary,
  });
}
