import { NextResponse } from "next/server";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED_SLUGS = new Set([
  "01-offer-clarity",
  "02-business-setup",
  "03-pricing",
  "04-ai-prompts",
  "05-first-30",
  "06-lead-tracker",
  "07-referral-worksheet",
  "08-90-day-roadmap",
  "09-weekly-planner",
  "10-kpi-dashboard",
]);

export async function POST(req: Request) {
  const email = getKitSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = String(body.moduleSlug ?? "");
  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown module" }, { status: 400 });
  }

  const data = body.data ?? {};
  const completed = body.completed === true;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const { error } = await supabase.from("kit_progress").upsert(
    {
      email,
      module_slug: slug,
      data,
      is_completed: completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email,module_slug" },
  );

  if (error) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
