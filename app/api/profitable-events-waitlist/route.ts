import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { addToKit } from "@/lib/kit";
import { ebook } from "@/lib/ebook";
import { sendEbookWaitlistEmail } from "@/lib/ebook-emails";
import { env } from "@/lib/env";
import {
  sendConversionEvent,
  clientIpFromRequest,
} from "@/lib/meta-conversions";

export const runtime = "nodejs";

/**
 * Ebook waitlist signup. Writes to Supabase (so the list survives even if an
 * external service is down), tags the subscriber in Kit for the launch
 * sequence, sends the confirmation, and fires a Lead event.
 *
 * Only the confirmation email blocks the response. A Kit or Supabase hiccup
 * should never cost a signup.
 */
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
  const source = String(body.source ?? ebook.defaultSource)
    .trim()
    .slice(0, 60);
  // Client-supplied for Meta Pixel/CAPI deduplication
  const metaEventId =
    typeof body.meta_event_id === "string"
      ? body.meta_event_id.slice(0, 128)
      : null;
  const metaFbc = typeof body.meta_fbc === "string" ? body.meta_fbc : null;
  const metaFbp = typeof body.meta_fbp === "string" ? body.meta_fbp : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (email.length > 320) {
    return NextResponse.json({ error: "Email too long" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from("ebook_waitlist")
      .upsert(
        { email, name: name || null, source },
        { onConflict: "email" },
      );
    if (error) {
      console.error("ebook_waitlist upsert failed (non-blocking):", error);
    }
  }

  if (env.kitApiKey) {
    const kit = await addToKit(email, ebook.kitTag).catch((err) => {
      console.error("Kit subscribe failed (non-blocking):", err);
      return { ok: false, tagged: false };
    });
    if (!kit.ok) {
      console.error("Kit subscribe returned not-ok for", email);
    }
  }

  try {
    await sendEbookWaitlistEmail(email, name);
  } catch (err) {
    console.error("ebook waitlist confirmation failed:", err);
    // The signup is already saved, so don't make them submit again.
  }

  // Server-side Meta Conversions API event (Lead). The Pixel fires the
  // matching client-side event with the same meta_event_id for dedup.
  if (metaEventId && env.metaPixelId && env.metaConversionsApiToken) {
    const [firstName, ...rest] = name.split(/\s+/);
    sendConversionEvent({
      eventName: "Lead",
      eventId: metaEventId,
      eventSourceUrl: `${env.siteUrl}${ebook.path}`,
      email,
      firstName: firstName || null,
      lastName: rest.join(" ") || null,
      clientIp: clientIpFromRequest(req),
      userAgent: req.headers.get("user-agent"),
      fbc: metaFbc,
      fbp: metaFbp,
    }).catch((err) =>
      console.error("Meta CAPI Lead failed (non-blocking):", err),
    );
  }

  return NextResponse.json({ ok: true });
}
