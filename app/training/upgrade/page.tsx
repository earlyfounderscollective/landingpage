import type { Metadata } from "next";
import Link from "next/link";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { StatusBanner } from "@/components/funnel/StatusBanner";
import { UpgradeCTA } from "@/components/funnel/UpgradeCTA";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { CountdownTimer } from "@/components/funnel/CountdownTimer";
import { BonusCard } from "@/components/funnel/BonusCard";
import {
  getActiveTrainingEvent,
  formatTrainingDateLine,
} from "@/lib/training";
import { SITE_VIDEOS } from "@/lib/site-videos";

export const metadata: Metadata = {
  title: "Lifetime access — $17 · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TrainingUpgradePage({
  searchParams,
}: {
  searchParams: { email?: string; name?: string };
}) {
  const email = (searchParams.email ?? "").trim();
  const name = (searchParams.name ?? "").trim();

  const event = await getActiveTrainingEvent();
  const dateLine = event ? formatTrainingDateLine(event) : "";
  const isUpcoming = event?.status === "upcoming" && event.starts_at;

  return (
    <>
      <StatusBanner tone="registered" />

      <main>
        {/* HERO — DARK */}
        <section className="bg-[#1a2a23] text-ivory">
          <div className="container-page py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center max-w-[1100px] mx-auto">
              {/* LEFT: offer */}
              <div className="text-center md:text-left">
                {isUpcoming && (
                  <div className="inline-flex items-center gap-2 bg-forest/60 border border-ivory/15 rounded-full px-3.5 py-1.5 mb-6">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a]" />
                    <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/85">
                      Live Virtual Event · {new Date(event.starts_at!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: event.timezone })}
                    </span>
                  </div>
                )}

                <h1 className="font-serif text-[32px] sm:text-[40px] md:text-[44px] lg:text-[48px] leading-[1.08] tracking-[-0.018em] text-ivory">
                  Watch a quick message from Oge to maximize the training.
                </h1>

                {dateLine && (
                  <div className="mt-7 flex items-center justify-center md:justify-start gap-2">
                    <span aria-hidden>📅</span>
                    <p className="font-serif italic text-[16px] md:text-[18px] text-brass">
                      {dateLine}
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <UpgradeCTA email={email} name={name} />
                </div>

                <div className="mt-4">
                  <Link
                    href={`/training/confirmed${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                    className="text-[13px] text-ivory/55 hover:text-ivory underline underline-offset-4 decoration-ivory/25"
                  >
                    No thanks, I don't want lifetime access
                  </Link>
                </div>
              </div>

              {/* RIGHT: video + countdown */}
              <div>
                <VSLEmbed url={SITE_VIDEOS.trainingUpgrade} />

                {isUpcoming && event?.starts_at && (
                  <div className="mt-6 bg-forest/40 border border-ivory/12 rounded-2xl px-5 py-4 flex flex-col items-center sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="inline-flex items-center gap-1.5 shrink-0">
                      <span aria-hidden className="text-[#d23a3a]">⚠</span>
                      <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/75">
                        Training starts in
                      </span>
                    </div>
                    <div className="sm:flex-1 sm:flex sm:justify-end">
                      <CountdownTimer targetIso={event.starts_at} tone="dark" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* WHY UPGRADE */}
        <section className="bg-ivory py-16 md:py-24">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto text-center">
              <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] tracking-[-0.018em] text-forest">
                Why you should upgrade
                <span className="text-ink/55"> (yes... it's just $17)</span>
              </h2>
            </div>

            <div className="max-w-[960px] mx-auto mt-14 md:mt-20 space-y-16 md:space-y-24">
              <BonusCard
                number="01"
                title="The Replay — Forever."
                body={
                  <>
                    <p>
                      Free registrants get the replay for 48 hours. After that it disappears. VIPs keep it forever, no expiration.
                    </p>
                    <p>
                      Watch it on a Saturday morning. Watch it three months from now when you're stuck on the part about pricing. Bookmark a specific moment and come back to it next year when you're scaling. It's yours.
                    </p>
                    <p>
                      Most people will get the most value not from watching once, but from coming back to specific parts at specific moments in the build.
                    </p>
                  </>
                }
              />

              <BonusCard
                number="02"
                title="The Searchable Transcript."
                reverse
                body={
                  <>
                    <p>
                      A full searchable PDF transcript of the training delivered within 48 hours of the live event ending. Yours to keep.
                    </p>
                    <p>
                      Cmd-F on the parts you need. Paste sections into Notion. Share a specific quote with a partner. The transcript is what lets the training become a reference document instead of a one-time event.
                    </p>
                    <p>
                      Combined with the lifetime replay, you get both — the original training to rewatch, and the transcript to scan, search, and quote.
                    </p>
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* RE-CTA */}
        <section className="bg-[#1a2a23] text-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[540px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
                Lifetime access
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[34px] leading-[1.12] tracking-[-0.018em] text-ivory">
                For the price of a lunch, keep it forever.
              </h2>
              <p className="mt-4 font-serif text-[44px] md:text-[52px] leading-none text-brass">
                $17
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.2em] text-ivory/55">
                One-time. Yours.
              </p>

              <div className="mt-9">
                <UpgradeCTA email={email} name={name} />
              </div>

              <div className="mt-5">
                <Link
                  href={`/training/confirmed${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                  className="text-[13px] text-ivory/55 hover:text-ivory underline underline-offset-4 decoration-ivory/25"
                >
                  No thanks, the 48-hour replay is fine
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
    </>
  );
}
