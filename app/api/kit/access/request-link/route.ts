import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createMagicToken, isKitBuyer } from "@/lib/kit-auth";
import { sendKitMagicLinkEmail } from "@/lib/kit-emails";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

  const buyer = await isKitBuyer(email);
  if (!buyer) {
    // Don't leak whether email exists. Always return success.
    return NextResponse.json({ ok: true });
  }

  const token = await createMagicToken(email);
  if (!token) {
    return NextResponse.json({ ok: true });
  }

  const magicLink = `${env.siteUrl}/api/kit/access/verify?token=${token}`;
  await sendKitMagicLinkEmail(email, magicLink).catch(() => null);

  return NextResponse.json({ ok: true });
}
