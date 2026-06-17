import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  sendChecklistNurture1,
  sendChecklistNurture2,
  sendChecklistNurture3,
} from "@/lib/checklist-email";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

type Kind = "day3" | "day7" | "day14";

type Window = {
  kind: Kind;
  startAgoMs: number;
  endAgoMs: number;
};

// Each window is 24h wide so a daily run catches everyone at the right age.
const WINDOWS: Window[] = [
  { kind: "day3", startAgoMs: 4 * DAY_MS, endAgoMs: 3 * DAY_MS },
  { kind: "day7", startAgoMs: 8 * DAY_MS, endAgoMs: 7 * DAY_MS },
  { kind: "day14", startAgoMs: 15 * DAY_MS, endAgoMs: 14 * DAY_MS },
];

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function authOk(req: Request): boolean {
  if (!env.cronSecret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${env.cronSecret}`) return true;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === env.cronSecret) return true;
  return false;
}

export async function GET(req: Request) {
  if (!authOk(req)) return unauthorized();

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const now = Date.now();
  const summary: Record<
    string,
    { eligible: number; sent: number; skipped: number; errors: number }
  > = {
    day3: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    day7: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    day14: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
  };

  for (const win of WINDOWS) {
    const startIso = new Date(now - win.startAgoMs).toISOString();
    const endIso = new Date(now - win.endAgoMs).toISOString();

    const { data: candidates, error } = await supabase
      .from("checklist_subscribers")
      .select("email, name, created_at, unsubscribed_at")
      .gte("created_at", startIso)
      .lt("created_at", endIso)
      .is("unsubscribed_at", null);

    if (error) {
      console.error(`Candidate query failed (${win.kind}):`, error);
      continue;
    }

    summary[win.kind].eligible = candidates?.length ?? 0;

    for (const c of candidates ?? []) {
      const email = c.email as string;

      // Skip if they've applied to EFC.
      const { data: app } = await supabase
        .from("applications")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (app) {
        summary[win.kind].skipped++;
        continue;
      }

      // Skip if they've submitted a discovery call.
      const { data: discovery } = await supabase
        .from("discovery_applications")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (discovery) {
        summary[win.kind].skipped++;
        continue;
      }

      // Skip if we've already sent this drip.
      const { data: existing } = await supabase
        .from("checklist_drip_log")
        .select("id")
        .eq("email", email)
        .eq("kind", win.kind)
        .maybeSingle();
      if (existing) {
        summary[win.kind].skipped++;
        continue;
      }

      if (dryRun) {
        summary[win.kind].sent++;
        continue;
      }

      try {
        const name = (c.name as string | null) ?? "";
        if (win.kind === "day3") await sendChecklistNurture1(email, name);
        else if (win.kind === "day7") await sendChecklistNurture2(email, name);
        else await sendChecklistNurture3(email, name);

        await supabase
          .from("checklist_drip_log")
          .insert({ email, kind: win.kind });

        summary[win.kind].sent++;
      } catch (err) {
        console.error(`Send failed (${win.kind}, ${email}):`, err);
        summary[win.kind].errors++;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    ranAt: new Date(now).toISOString(),
    summary,
  });
}
