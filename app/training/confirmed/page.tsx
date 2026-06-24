import type { Metadata } from "next";
import Link from "next/link";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { StatusBanner } from "@/components/funnel/StatusBanner";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { CalendarButtons } from "@/components/funnel/CalendarButtons";
import { ScreenshotSave } from "@/components/funnel/ScreenshotSave";
import { BootcampPitchCard } from "@/components/funnel/BootcampPitchCard";
import { SITE_VIDEOS } from "@/lib/site-videos";
import {
  getActiveTrainingEvent,
  formatTrainingDateLine,
} from "@/lib/training";
import { getSupabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

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
  const mode = event?.status ?? "between";
  const isUpcoming = mode === "upcoming" && event?.starts_at;

  // Look up first name for personal headline.
  let firstName = "";
  const supabase = getSupabaseAdmin();
  if (supabase && email) {
    const { data } = await supabase
      .from("training_registrations")
      .select("full_name")
      .eq("email", email)
      .maybeSingle();
    if (data?.full_name) firstName = String(data.full_name).split(/\s+/)[0];
  }

  const calendarTitle =
    event?.title ?? "Turn Your Side Hustle Into a Legitimate Business";
  const calendarDescription = event?.zoom_url
    ? `Join: ${event.zoom_url}\n\nHosted by Oge Madu · Early Founders Collective`
    : "Hosted by Oge Madu · Early Founders Collective";

  const liveUrl = event?.zoom_url ?? null;

  return (
    <>
      <StatusBanner tone={isVip ? "vip-success" : "free-success"} />

      <main>
        {/* TOP — your registration / order details */}
        <section className="bg-ivory pt-12 md:pt-16 pb-10 md:pb-12">
          <div className="container-page">
            <div className="max-w-[600px] mx-auto text-center">
              <h1 className="font-serif text-[28px] sm:text-[34px] md:text-[40px] leading-[1.1] tracking-[-0.018em] text-forest uppercase">
                {isVip ? "Your Order Details Inside:" : "Your Registration Details"}
              </h1>
              <p className="mt-2 text-[16px] md:text-[18px] text-ink/72">
                {firstName ? `Are inside this video, ${firstName}.` : "Are inside this video."}
              </p>
            </div>

            <div className="mt-10 max-w-[760px] mx-auto">
              <VSLEmbed url={SITE_VIDEOS.trainingConfirmed} />
            </div>

            {isVip && (
              <div className="mt-8 max-w-[560px] mx-auto">
                <Link
                  href="/kit"
                  className="block bg-brass text-ivory text-center py-5 px-6 rounded-2xl shadow-[0_22px_50px_-18px_rgba(155,122,74,0.6)] hover:bg-[#8a6c3f] transition-colors"
                >
                  <p className="font-semibold text-[13px] md:text-[14px] tracking-[0.12em] uppercase">
                    Want to go deeper? Get Build Your Business Kit.
                  </p>
                  <p className="mt-1 text-[12px] tracking-[0.1em] uppercase text-ivory/85">
                    Add to my order now →
                  </p>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* DATE + CALENDAR */}
        {isUpcoming && event?.starts_at && (
          <section className="bg-bone py-14 md:py-16 grain">
            <div className="container-page">
              <div className="max-w-[560px] mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-ivory/80 border border-line/60 rounded-full px-4 py-2 mb-6">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a]" />
                  <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-mute">
                    Live Virtual Event ·{" "}
                    {new Date(event.starts_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: event.timezone,
                    })}
                  </span>
                </div>

                <h2 className="font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.018em] text-forest">
                  {new Date(event.starts_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: event.timezone,
                  })}{" "}
                  {event.timezone.replace("America/", "").replace("_", " ")}
                </h2>

                <div className="mt-9">
                  <CalendarButtons
                    title={calendarTitle}
                    startsAt={event.starts_at}
                    durationMinutes={event.duration_minutes}
                    description={calendarDescription}
                    location={event.zoom_url ?? "Zoom"}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SCREENSHOT & SAVE */}
        {isUpcoming && (
          <ScreenshotSave
            liveTitle={calendarTitle}
            dateLine={dateLine}
            liveUrl={liveUrl}
          />
        )}

        {/* VIP HOUSEKEEPING / FREE HOUSEKEEPING */}
        <section className="bg-ivory py-14 md:py-20">
          <div className="container-page">
            <div className="max-w-[580px] mx-auto">
              {isVip ? (
                <>
                  <p className="font-serif text-[20px] md:text-[24px] leading-[1.35] text-forest text-center">
                    If you're seeing this page it means{" "}
                    <span className="border-b-2 border-brass">you upgraded to VIP.</span>
                  </p>
                  <h3 className="mt-9 font-serif text-[22px] md:text-[26px] leading-[1.25] text-forest text-center">
                    So a couple of housekeeping items:
                  </h3>
                  <ul className="mt-8 space-y-7 text-[15.5px] md:text-[16px] leading-[1.6] text-ink/80">
                    <Bullet>
                      <strong className="text-forest">Your registration is confirmed</strong> and your Zoom link is already in your inbox. Save this page or screenshot it just in case.
                    </Bullet>
                    <Bullet>
                      <strong className="text-forest">Your VIP perks unlock after the training.</strong> Within 48 hours of the live training ending we'll send you the lifetime replay link and the searchable transcript.
                    </Bullet>
                    <Bullet>
                      <strong className="text-forest">If you have any issues</strong>, reply to your order confirmation email or message{" "}
                      <a
                        href="mailto:contact@earlyfounderscollective.com"
                        className="text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                      >
                        contact@earlyfounderscollective.com
                      </a>{" "}
                      and we'll sort it.
                    </Bullet>
                    {isUpcoming && (
                      <Bullet>
                        <strong className="text-forest">Show up live if you can.</strong>{" "}
                        Join at the date and time above. The Zoom link is in your inbox and on this page. Don't share the link — it may not work.
                      </Bullet>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-serif text-[20px] md:text-[24px] leading-[1.35] text-forest text-center">
                    A couple of quick things before we go.
                  </p>
                  <ul className="mt-9 space-y-7 text-[15.5px] md:text-[16px] leading-[1.6] text-ink/80">
                    <Bullet>
                      <strong className="text-forest">Check your inbox</strong> for the confirmation email with the Zoom link. If you don't see it within 5 minutes, check spam.
                    </Bullet>
                    <Bullet>
                      <strong className="text-forest">Show up live if you can.</strong> Free registrants get the replay for 48 hours after the training. After that it disappears.
                    </Bullet>
                    <Bullet>
                      <strong className="text-forest">If you have any issues</strong>, reply to the confirmation email or message{" "}
                      <a
                        href="mailto:contact@earlyfounderscollective.com"
                        className="text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                      >
                        contact@earlyfounderscollective.com
                      </a>
                      .
                    </Bullet>
                  </ul>

                  {/* Soft VIP nudge for non-VIPs */}
                  {isUpcoming && (
                    <div className="mt-12 bg-bone border border-line/60 rounded-2xl p-6 md:p-7 text-center">
                      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
                        Want to keep it forever?
                      </p>
                      <p className="mt-3 font-serif text-[18px] md:text-[20px] leading-[1.3] text-forest">
                        Upgrade to VIP for lifetime replay + searchable transcript.
                      </p>
                      <Link
                        href={`/training/upgrade${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-forest text-ivory px-7 py-3 text-[13.5px] font-medium hover:bg-ink transition-colors"
                      >
                        Add VIP for $17 →
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Kit pitch for everyone after training */}
              {(mode === "replay" || mode === "between") && (
                <>
                  <div className="mt-12 bg-forest text-ivory rounded-2xl p-6 md:p-7 text-center">
                    <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
                      Next step
                    </p>
                    <p className="mt-3 font-serif text-[18px] md:text-[20px] leading-[1.3] text-ivory">
                      Take what you just learned and run with it.
                    </p>
                    <p className="mt-3 text-[14px] text-ivory/75 leading-[1.55]">
                      Build Your Business Kit has the worksheets, templates, and AI prompts to set up the business in a weekend.
                    </p>
                    <Link
                      href={`/kit${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                      className="mt-5 inline-flex items-center justify-center rounded-full bg-brass text-ivory px-7 py-3 text-[13.5px] font-semibold tracking-[0.04em] uppercase hover:bg-[#8a6c3f] transition-colors"
                    >
                      Get Build Your Business Kit →
                    </Link>
                  </div>
                  <BootcampPitchCard
                    variant="after-kit"
                    source="training_confirmed_post"
                  />
                </>
              )}

              {/* Upcoming-event variant: surface bootcamp BEFORE the event so
                  attendees have context for the pitch they'll hear live. */}
              {isUpcoming && (
                <BootcampPitchCard
                  variant="after-kit"
                  source="training_confirmed_upcoming"
                />
              )}

              <p className="mt-14 font-serif italic text-[17px] text-forest/80 text-center">
                Oge
              </p>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-3.5 items-start">
      <span
        className="mt-[9px] h-1.5 w-1.5 rounded-full bg-brass shrink-0"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}
