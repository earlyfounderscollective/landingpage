import { NextResponse } from "next/server";
import { KIT_COOKIE_NAME } from "@/lib/kit-auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KIT_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

export async function GET() {
  const res = NextResponse.redirect(`${env.siteUrl}/kit/access/login`);
  res.cookies.set(KIT_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
