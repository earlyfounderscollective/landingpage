"use server";

import { applicationSchema, type ApplicationInput } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAdminNotification, sendApplicantConfirmation } from "@/lib/emails";

export type SubmitResult =
  | { ok: true; id: string | null }
  | { ok: false; fieldErrors?: Record<string, string>; message?: string };

export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors, message: "Please review the highlighted fields." };
  }

  const data: ApplicationInput = parsed.data;
  let id: string | null = null;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("applications")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        social_link: data.socialLink,
        current_build: data.currentBuild,
        stage: data.stage,
        execution_challenge: data.executionChallenge,
        progress_goal: data.progressGoal,
        why_join: data.whyJoin,
        participate_weekly: data.participateWeekly,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert failed", error);
      return {
        ok: false,
        message:
          "Something went wrong saving your application. Please email contact@earlyfounderscollective.com — we'll take it from there.",
      };
    }
    id = inserted?.id ?? null;
  } else {
    console.warn(
      "Supabase env not configured — application not persisted. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  try {
    await Promise.allSettled([
      sendApplicantConfirmation(data),
      sendAdminNotification(data, id ?? undefined),
    ]);
  } catch (e) {
    console.error("Resend send failed", e);
  }

  return { ok: true, id };
}
