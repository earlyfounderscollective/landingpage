import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { addToKit } from "@/lib/kit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Adds an email to Kit (optionally tagged). Called by ManyChat's External
 * Request action after it captures an email in a DM, so leads flow into Kit
 * without any credential living inside ManyChat.
 *
 * Auth: a shared secret via ?key=... or the x-kit-sync-secret header.
 * Body: { "email": "...", "tag": "ai-os" }
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const provided =
    url.searchParams.get("key") ??
    req.headers.get("x-kit-sync-secret") ??
    "";
  if (!env.kitSyncSecret || provided !== env.kitSyncSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!env.kitApiKey) {
    return NextResponse.json({ error: "Kit not configured" }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  const tag = body.tag ? String(body.tag).trim().slice(0, 60) : null;

  const result = await addToKit(email, tag);
  if (!result.ok) {
    return NextResponse.json({ error: "Kit subscribe failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, tagged: result.tagged });
}
