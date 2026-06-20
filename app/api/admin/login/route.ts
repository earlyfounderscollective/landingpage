import { NextResponse } from "next/server";
import { buildSessionCookie, checkAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (!checkAdminPassword(password)) {
    // 1s delay to slow down brute force
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookie = buildSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cookie.maxAge,
  });
  return res;
}
