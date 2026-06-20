import { NextResponse } from "next/server";
import { consumeMagicToken, buildKitSessionCookie } from "@/lib/kit-auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      `${env.siteUrl}/kit/access/login?error=missing`,
    );
  }

  const result = await consumeMagicToken(token);
  if (!result) {
    return NextResponse.redirect(
      `${env.siteUrl}/kit/access/login?error=expired`,
    );
  }

  const cookie = buildKitSessionCookie(result.email);
  const res = NextResponse.redirect(`${env.siteUrl}/kit/access`);
  res.cookies.set(cookie.name, cookie.value, {
    maxAge: cookie.maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
