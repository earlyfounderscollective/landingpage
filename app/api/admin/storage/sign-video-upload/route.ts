import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Returns a signed upload URL for the `videos` Supabase Storage bucket.
 * The caller can then PUT the file bytes directly to that URL — bypassing
 * Vercel's 4.5MB function body limit. Used for VSL uploads (100MB+).
 */
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

  const rawFilename = String(body.filename ?? "").trim();
  if (!rawFilename) {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }
  // Sanitize — strip path separators, normalise spaces.
  const safe = rawFilename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  // Lazily ensure the bucket exists. Public so we can render the URL
  // directly in <video> tags without signing every request.
  try {
    const { data: existing } = await supabase.storage.getBucket("videos");
    if (!existing) {
      await supabase.storage.createBucket("videos", {
        public: true,
        fileSizeLimit: 500 * 1024 * 1024, // 500 MB
        allowedMimeTypes: [
          "video/mp4",
          "video/webm",
          "video/quicktime",
        ],
      });
    }
  } catch (err) {
    console.warn("videos bucket ensure:", err);
  }

  const path = `${Date.now()}-${safe}`;
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Couldn't sign upload" },
      { status: 500 },
    );
  }

  const { data: publicData } = supabase.storage
    .from("videos")
    .getPublicUrl(path);

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: publicData.publicUrl,
  });
}
