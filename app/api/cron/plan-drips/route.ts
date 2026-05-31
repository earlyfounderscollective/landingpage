import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  MODULE_TIPS,
  sendPlanInactive24h,
  sendPlanInactive72h,
  sendPlanInactive7d,
} from "@/lib/plan-emails";
import { moduleBySlug } from "@/lib/plan-modules";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

type Kind = "inactive_24h" | "inactive_72h" | "inactive_7d";

type Window = {
  kind: Kind;
  startAgoMs: number; // last_active_at must be >= now - startAgoMs
  endAgoMs: number; // last_active_at must be < now - endAgoMs
};

// Each window is 24h wide so a daily run catches everyone at the right age.
const WINDOWS: Window[] = [
  { kind: "inactive_24h", startAgoMs: 48 * HOUR_MS, endAgoMs: 24 * HOUR_MS },
  { kind: "inactive_72h", startAgoMs: 96 * HOUR_MS, endAgoMs: 72 * HOUR_MS },
  { kind: "inactive_7d", startAgoMs: 8 * DAY_MS, endAgoMs: 7 * DAY_MS },
];

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function authOk(req: Request): boolean {
  // Vercel cron sends `Authorization: Bearer ${CRON_SECRET}` automatically.
  // Also allow ?secret= for manual smoke tests.
  if (!env.cronSecret) {
    // No secret configured. In production this should never be the case;
    // refuse to run to fail loud rather than silently send to everyone.
    return false;
  }
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
  const summary: Record<string, { eligible: number; sent: number; skipped: number; errors: number }> = {
    inactive_24h: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    inactive_72h: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
    inactive_7d: { eligible: 0, sent: 0, skipped: 0, errors: 0 },
  };

  for (const win of WINDOWS) {
    const startIso = new Date(now - win.startAgoMs).toISOString();
    const endIso = new Date(now - win.endAgoMs).toISOString();

    const { data: candidates, error } = await supabase
      .from("plan_projects")
      .select("id, email, name, last_module_slug, last_active_at")
      .gte("last_active_at", startIso)
      .lt("last_active_at", endIso)
      .not("last_module_slug", "is", null)
      .not("email", "is", null);

    if (error) {
      console.error(`Candidate query failed (${win.kind}):`, error);
      continue;
    }

    summary[win.kind].eligible = candidates?.length ?? 0;

    for (const c of candidates ?? []) {
      const moduleSlug = c.last_module_slug as string;
      const moduleInfo = moduleBySlug(moduleSlug);
      if (!moduleInfo) {
        summary[win.kind].skipped++;
        continue;
      }

      // Have we already sent this drip for this project + module?
      const { data: existing } = await supabase
        .from("plan_email_log")
        .select("id")
        .eq("project_id", c.id)
        .eq("kind", win.kind)
        .eq("module_slug", moduleSlug)
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
        if (win.kind === "inactive_24h") {
          await sendPlanInactive24h(c.email!, c.name ?? "", {
            slug: moduleInfo.slug,
            title: moduleInfo.title,
          });
        } else if (win.kind === "inactive_72h") {
          const tip = MODULE_TIPS[moduleSlug] ?? "";
          await sendPlanInactive72h(
            c.email!,
            c.name ?? "",
            { slug: moduleInfo.slug, title: moduleInfo.title },
            tip,
          );
        } else if (win.kind === "inactive_7d") {
          await sendPlanInactive7d(c.email!, c.name ?? "", {
            slug: moduleInfo.slug,
            title: moduleInfo.title,
          });
        }

        await supabase.from("plan_email_log").insert({
          project_id: c.id,
          kind: win.kind,
          module_slug: moduleSlug,
        });

        summary[win.kind].sent++;
      } catch (err) {
        console.error(`Send failed (${win.kind}, project ${c.id}):`, err);
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
