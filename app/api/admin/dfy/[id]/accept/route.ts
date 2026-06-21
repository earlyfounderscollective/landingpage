import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { signDFYCheckoutToken } from "@/lib/signing";
import { sendDFYAcceptanceEmail } from "@/lib/dfy-email";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data: app, error: fetchErr } = await supabase
    .from("dfy_applications")
    .select("id, email, full_name, status")
    .eq("id", params.id)
    .maybeSingle();

  if (fetchErr || !app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const { error: updateErr } = await supabase
    .from("dfy_applications")
    .update({ status: "accepted" })
    .eq("id", params.id);

  if (updateErr) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  const token = signDFYCheckoutToken(app.id);
  const checkoutUrl = `${env.siteUrl}/dfy/checkout?app=${app.id}&token=${token}`;

  try {
    await sendDFYAcceptanceEmail({
      email: app.email,
      fullName: app.full_name,
      checkoutUrl,
    });
  } catch (err) {
    console.error("DFY acceptance email failed:", err);
    // Don't fail the request — admin can resend manually if needed
  }

  return NextResponse.json({ ok: true, checkoutUrl });
}
