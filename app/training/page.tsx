import type { Metadata } from "next";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import { TrainingForm } from "@/components/funnel/TrainingForm";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { StickyTrainingCTA } from "@/components/funnel/StickyTrainingCTA";
import { CountdownTimer } from "@/components/funnel/CountdownTimer";
import { VideoReviews } from "@/components/site/VideoReviews";
import {
  getActiveTrainingEvent,
  formatTrainingDateLine,
} from "@/lib/training";

export const metadata: Metadata = {
  title:
    "Free Live Training — The difference between a side hustle and a real business · Early Founders Collective",
  description:
    "A free live training for working adults with a skill, side hustle, or business idea — and a 9-to-5 they're not ready to quit.",
};

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const event = await getActiveTrainingEvent();
  const mode = event?.status ?? "between";

  let pillLabel = "UPCOMING · NEXT DATE TBA";
  let ctaLabel = "Notify Me";
  let ctaSubline = "Get notified when the date is set";
  let helperText = "We'll email you the moment a date is set.";

  if (mode === "upcoming" && event?.starts_at) {
    const dateShort = new Date(event.starts_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    pillLabel = `LIVE TRAINING · ${dateShort.toUpperCase()}`;
    ctaLabel = "Reserve My Seat";
    ctaSubline = formatTrainingDateLine(event);
    helperText = "Zoom link sent to your inbox after registration.";
  } else if (mode === "replay" && event?.replay_url) {
    pillLabel = "REPLAY AVAILABLE";
    ctaLabel = "Watch the Replay";
    ctaSubline = "Watch anytime";
    helperText = "Replay link sent to your inbox after registration.";
  }

  const isUpcoming = mode === "upcoming" && event?.starts_at;

  return (
    <>
      <FunnelHeader tone="light" />
      <main className="pb-[100px] md:pb-0">
        {/* HERO — DARK */}
        <section className="relative bg-[#1a2a23] text-ivory overflow-hidden">
          <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[160px] pb-12 md:pb-16">
            <div className="max-w-[820px] mx-auto text-center">
              {/* Event pill */}
              <div className="inline-flex items-center gap-2 bg-forest/60 border border-ivory/15 rounded-full px-4 py-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a] animate-pulse" />
                <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/85">
                  {pillLabel}
                </span>
              </div>

              {/* Headline */}
              <h1 className="mt-7 sm:mt-8 font-serif text-ivory">
                <span className="block text-[28px] sm:text-[38px] md:text-[48px] lg:text-[54px] leading-[1.06] tracking-[-0.018em]">
                  The difference between a
                  <br className="hidden sm:block" /> side hustle and a real business
                </span>
                <span className="block hand text-[44px] sm:text-[58px] md:text-[68px] leading-[0.95] text-brass mt-3 sm:mt-4 -rotate-[2deg]">
                  isn't talent.
                </span>
              </h1>

              <p className="mt-7 font-serif italic text-[18px] sm:text-[20px] md:text-[22px] leading-[1.4] text-ivory/85">
                It's knowing how to build it.
              </p>

              <p className="mt-7 max-w-[520px] mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-ivory/70">
                If you've ever been paid for what you're good at, you're probably closer than you think. This training will show you what to do next.
              </p>
            </div>

            {/* VSL */}
            <div className="mt-10 md:mt-12">
              <VSLEmbed url={event?.video_url} />
            </div>

            {/* CTA + Countdown */}
            <div className="mt-10 md:mt-12 max-w-[520px] mx-auto text-center">
              <TrainingForm
                mode={mode}
                ctaLabel={ctaLabel}
                ctaSubline={ctaSubline}
                helperText={helperText}
                variant="modal"
              />
            </div>

            {/* Countdown */}
            {isUpcoming && event?.starts_at && (
              <div className="mt-10 md:mt-12 max-w-[560px] mx-auto">
                <div className="bg-forest/40 border border-ivory/12 rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="inline-flex items-center gap-1.5 shrink-0">
                    <span aria-hidden className="text-[#d23a3a]">⚠</span>
                    <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/75">
                      Training starts in
                    </span>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <CountdownTimer targetIso={event.starts_at} tone="dark" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TESTIMONIALS — REAL VIDEO REVIEWS */}
        <VideoReviews />

        {/* IN THIS LIVE TRAINING */}
        <section className="bg-bone py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass text-center">
                In This Live Training You'll Learn
              </p>

              <ul className="mt-10 space-y-7 md:space-y-8">
                {[
                  "How to know if your idea is actually worth pursuing.",
                  "The right order to build your business.",
                  "What makes customers trust one business over another.",
                  "The mistakes that keep good side hustles from becoming great businesses.",
                  "The next steps to take whether you're just getting started or already making money.",
                ].map((line) => (
                  <li
                    key={line}
                    className="grid grid-cols-[auto_1fr] items-baseline gap-4"
                  >
                    <span className="mt-[12px] h-[1.5px] w-3 bg-brass shrink-0" aria-hidden />
                    <span className="font-serif text-[18px] md:text-[20px] leading-[1.45] text-forest">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* HOSTED BY */}
        <section className="bg-ivory py-16 md:py-24">
          <div className="container-page">
            <div className="max-w-[920px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
              <figure className="mx-auto md:mx-0 max-w-[280px] md:max-w-[320px] w-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-forest/10 shadow-card">
                  <img
                    src="/media/founder-portrait.jpg"
                    alt="Oge Madu"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </figure>

              <div className="text-center md:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                  Hosted by Oge Madu
                </p>
                <div className="mt-7 space-y-4 text-[16px] md:text-[16.5px] leading-[1.7] text-ink/78">
                  <p>
                    Over the last decade, I've built businesses across different industries and learned that successful businesses may look different, but they usually have the same foundation.
                  </p>
                  <p>This training is about helping you build yours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DARK RE-CTA */}
        <section className="bg-[#1a2a23] text-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[540px] mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-forest/60 border border-ivory/15 rounded-full px-4 py-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a]" />
                <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/85">
                  {pillLabel}
                </span>
              </div>

              <h2 className="mt-7 font-serif text-[28px] md:text-[36px] leading-[1.12] tracking-[-0.018em] text-ivory">
                {mode === "upcoming"
                  ? "Reserve your seat."
                  : mode === "replay"
                    ? "Watch the replay."
                    : "Be first in line."}
              </h2>

              <div className="mt-9 flex justify-center">
                <TrainingForm
                  mode={mode}
                  ctaLabel={ctaLabel}
                  ctaSubline={ctaSubline}
                  helperText={helperText}
                  variant="modal"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
      <StickyTrainingCTA mode={mode} ctaLabel={ctaLabel} helperText={helperText} />
    </>
  );
}
