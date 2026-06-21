import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";
import { ensureBucket } from "@/lib/ai-images";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_SIZES = new Set([
  "1024x1024",
  "1024x1792",
  "1792x1024",
]);

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!env.openaiApiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = String(body.prompt ?? "").trim().slice(0, 4000);
  const size = String(body.size ?? "1024x1024");
  const quality = body.quality === "hd" ? "hd" : "standard";
  const style = body.style === "natural" ? "natural" : "vivid";
  const slotKey =
    typeof body.slot_key === "string" && body.slot_key.length > 0
      ? body.slot_key
      : null;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }
  if (!ALLOWED_SIZES.has(size)) {
    return NextResponse.json({ error: "Invalid size" }, { status: 400 });
  }

  // Call gpt-image-1 (the current image-generation model). Returns base64.
  // gpt-image-1 supports `quality` (low|medium|high|auto) but NOT `style`
  // or `response_format`. Output is always base64 in `data[0].b64_json`.
  const apiQuality = quality === "hd" ? "high" : "medium";
  let bytes: Buffer;
  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size,
        quality: apiQuality,
      }),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("OpenAI error:", errText);
      let detail = errText;
      try {
        const parsed = JSON.parse(errText);
        detail = parsed?.error?.message || parsed?.error?.code || errText;
      } catch {
        /* keep raw text */
      }
      return NextResponse.json(
        { error: `OpenAI: ${detail}` },
        { status: 502 },
      );
    }
    const json = await r.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json(
        { error: "OpenAI returned no image data." },
        { status: 502 },
      );
    }
    bytes = Buffer.from(b64, "base64");
  } catch (err) {
    console.error("OpenAI request failed:", err);
    return NextResponse.json(
      { error: "OpenAI request failed." },
      { status: 502 },
    );
  }

  // Upload to Supabase Storage
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  await ensureBucket();

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
  const { error: uploadErr } = await supabase.storage
    .from("ai-images")
    .upload(filename, bytes, {
      contentType: "image/png",
      cacheControl: "31536000",
    });

  if (uploadErr) {
    console.error("Storage upload failed:", uploadErr);
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadErr.message}` },
      { status: 500 },
    );
  }

  const { data: publicData } = supabase.storage
    .from("ai-images")
    .getPublicUrl(filename);
  const imageUrl = publicData.publicUrl;

  // gpt-image-1 pricing: medium ~$0.04, high ~$0.17-0.25 (varies by size)
  const centsCost = quality === "hd" ? (size === "1024x1024" ? 17 : 25) : 4;

  // History
  await supabase.from("ai_image_history").insert({
    image_url: imageUrl,
    prompt,
    model: "gpt-image-1",
    size,
    quality,
    style,
    cents_cost: centsCost,
  });

  // Optional slot assignment
  if (slotKey) {
    await supabase.from("ai_image_slots").upsert(
      {
        slot_key: slotKey,
        image_url: imageUrl,
        prompt,
        model: "gpt-image-1",
        size,
        quality,
        style,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slot_key" },
    );
  }

  return NextResponse.json({
    ok: true,
    image_url: imageUrl,
    assigned_slot: slotKey,
  });
}
