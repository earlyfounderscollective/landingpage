import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slotKey = String(body.slot_key ?? "");
  const imageUrl = String(body.image_url ?? "");
  const clear = body.clear === true;

  if (!slotKey) {
    return NextResponse.json({ error: "slot_key required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  if (clear) {
    await supabase.from("ai_image_slots").delete().eq("slot_key", slotKey);
    return NextResponse.json({ ok: true, cleared: true });
  }

  if (!imageUrl) {
    return NextResponse.json({ error: "image_url required" }, { status: 400 });
  }

  const { error } = await supabase.from("ai_image_slots").upsert(
    {
      slot_key: slotKey,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slot_key" },
  );

  if (error) {
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
