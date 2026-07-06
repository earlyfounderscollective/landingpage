import type { Metadata } from "next";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { StatusBanner } from "@/components/funnel/StatusBanner";
import { getActiveTrainingEvent } from "@/lib/training";
import { getSupabaseAdmin } from "@/lib/supabase";
import { SurveyForm } from "./SurveyForm";

export const metadata: Metadata = {
  title: "Training Feedback · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TrainingSurveyPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  const event = await getActiveTrainingEvent();

  // Personalize from the registration if we can match on email.
  let firstName = "";
  if (email && event) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from("training_registrations")
        .select("full_name")
        .eq("email", email)
        .eq("event_id", event.id)
        .maybeSingle();
      if (data?.full_name) firstName = String(data.full_name).split(/\s+/)[0];
    }
  }

  return (
    <>
      <StatusBanner tone="registered" label="TRAINING FEEDBACK" />
      <main className="bg-ivory min-h-[calc(100vh-100px)]">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-[640px] mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass text-center">
              Two minutes, big impact
            </p>
            <h1 className="mt-4 font-serif text-[30px] sm:text-[38px] leading-[1.08] tracking-[-0.018em] text-forest text-center">
              {firstName
                ? `${firstName}, how was the training?`
                : "How was the training?"}
            </h1>
            <p className="mt-4 text-[15.5px] text-ink/72 leading-[1.6] text-center max-w-[520px] mx-auto">
              I read every one of these. Your honest answers tell me what to
              keep, what to cut, and what to build next. There are no wrong
              answers.
            </p>
            <div className="mt-10">
              <SurveyForm email={email} name={firstName} />
            </div>
          </div>
        </div>
      </main>
      <FunnelFooter />
    </>
  );
}
