import type { Metadata } from "next";
import Link from "next/link";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import {
  getActiveTrainingEvent,
  formatTrainingDateLine,
} from "@/lib/training";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "You're in · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TrainingConfirmedPage({
  searchParams,
}: {
  searchParams: { email?: string; session_id?: string; vip?: string };
}) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  const isVip = searchParams.vip === "1";

  const event = await getActiveTrainingEvent();
  const dateLine = event ? formatTrainingDateLine(event) : "";

  // Try to look up the registrant's first name from the row.
  let firstName = "";
  const supabase = getSupabaseAdmin();
  if (supabase && email) {
    const { data } = await supabase
      .from("training_registrations")
      .select("full_name")
      .eq("email", email)
      .maybeSingle();
    if (data?.full_name) {
      firstName = String(data.full_name).split(/\s+/)[0];
    }
  }

  const mode = event?.status ?? "between";
  const headline = firstName ? `You're in, ${firstName}.` : "You're in.";

  return (
    <>
      <FunnelHeader tone="auto" />
      <main className="bg-ivory min-h-screen">
        <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[160px] pb-16 md:pb-24">
          <div className="max-w-[620px] mx-auto text-center">
            <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass">
              You're in
            </p>

            <h1 className="mt-6 font-serif text-[36px] sm:text-[44px] md:text-[54px] leading-[1.05] tracking-[-0.018em] text-forest">
              {headline}
            </h1>

            {mode === "upcoming" && event?.starts_at && (
              <>
                <p className="mt-7 font-serif italic text-[18px] md:text-[20px] text-brass">
                  {dateLine}
                </p>

                {event.zoom_url && (
                  <div className="mt-10 bg-bone border border-line/60 rounded-2xl p-6 md:p-7 text-left">
                    <p className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-mute mb-2">
                      Zoom link
                    </p>
                    <a
                      href={event.zoom_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif text-[15px] md:text-[16px] text-forest break-all hover:text-brass"
                    >
                      {event.zoom_url}
                    </a>
                    <p className="mt-4 text-[13px] text-mute leading-[1.55]">
                      Same link sits in the confirmation email we just sent you. Check spam if it isn't in your inbox in 5 minutes.
                    </p>
                  </div>
                )}
              </>
            )}

            {mode === "replay" && (
              <p className="mt-7 text-[15px] md:text-[16px] text-ink/72 leading-[1.65] max-w-[460px] mx-auto">
                Check your inbox for the replay link.{" "}
                {isVip
                  ? "Yours forever — no expiration."
                  : "Free replay window is 48 hours from when you opened the email."}
              </p>
            )}

            {mode === "between" && (
              <p className="mt-7 text-[15px] md:text-[16px] text-ink/72 leading-[1.65] max-w-[460px] mx-auto">
                The next training drops soon. We'll email you the moment a date is set.
              </p>
            )}

            {isVip && (
              <div className="mt-10 bg-forest text-ivory rounded-2xl p-6 md:p-7">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-brass">
                  VIP — lifetime access
                </p>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-ivory/85">
                  You'll keep the replay forever. The searchable transcript lands in your inbox within 48 hours of the training ending.
                </p>
              </div>
            )}

            <p className="mt-12 text-[14px] text-mute">
              Need anything?{" "}
              <a
                href="mailto:contact@earlyfounderscollective.com"
                className="text-forest underline underline-offset-4 hover:text-brass"
              >
                contact@earlyfounderscollective.com
              </a>
            </p>

            <p className="mt-14 font-serif italic text-[16px] text-forest/75">
              Oge
            </p>

            <div className="mt-12">
              <Link
                href="/"
                className="text-[13px] text-mute hover:text-forest underline underline-offset-4 decoration-line"
              >
                Back to early founders collective →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <FunnelFooter />
    </>
  );
}
