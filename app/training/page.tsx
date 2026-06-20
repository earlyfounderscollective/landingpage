import type { Metadata } from "next";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { TrainingForm } from "@/components/funnel/TrainingForm";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { StickyTrainingCTA } from "@/components/funnel/StickyTrainingCTA";
import { InlineCountdown } from "@/components/funnel/CountdownTimer";
import { VideoReviews } from "@/components/site/VideoReviews";
import Link from "next/link";
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
  let ctaSubline: string | undefined;
  let helperText = "We'll email you the moment a date is set.";

  if (mode === "upcoming" && event?.starts_at) {
    const dateShort = new Date(event.starts_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    pillLabel = `LIVE TRAINING · ${dateShort.toUpperCase()}`;
    ctaLabel = "Claim My Free Seat";
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
      <main className="pb-[100px] md:pb-0">
        {/* HERO — FOREST */}
        <section className="relative bg-forest text-ivory overflow-hidden">
          <div className="container-page pt-10 sm:pt-12 md:pt-14 pb-12 md:pb-16">
            {/* Logo — prominent center-top */}
            <div className="flex justify-center">
              <Link href="/" aria-label="Early Founders Collective — Home">
                <img
                  src="/logo.png"
                  alt="Early Founders Collective"
                  className="h-12 md:h-16 w-auto brightness-0 invert opacity-95"
                  loading="eager"
                />
              </Link>
            </div>

            <div className="max-w-[820px] mx-auto text-center mt-10 md:mt-12">
              {/* Event pill */}
              <div className="inline-flex items-center gap-2 bg-forest/60 border border-ivory/20 rounded-full px-4 py-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a] animate-pulse" />
                <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/90">
                  {pillLabel}
                </span>
              </div>

              {/* H1 */}
              <h1 className="mt-7 sm:mt-8 font-serif text-ivory">
                <span className="block text-[28px] sm:text-[38px] md:text-[48px] lg:text-[54px] leading-[1.06] tracking-[-0.018em]">
                  <span className="text-brass/90">“</span>
                  The difference between a side hustle
                  <br className="hidden sm:block" /> and a real business
                  <span className="hand text-[44px] sm:text-[58px] md:text-[68px] leading-[0.95] text-brass mx-1 -rotate-[2deg] inline-block align-baseline">
                    isn't talent.
                  </span>
                  <span className="text-brass/90">”</span>
                </span>
              </h1>

              <p className="mt-7 font-serif italic text-[18px] sm:text-[20px] md:text-[22px] leading-[1.4] text-ivory/85">
                It's knowing how to build it.
              </p>

              <p className="mt-7 max-w-[520px] mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-ivory/72">
                If you've ever been paid for what you're good at, you're probably closer than you think. This training will show you what to do next.
              </p>
            </div>

            {/* VSL */}
            <div className="mt-10 md:mt-12">
              <VSLEmbed url={event?.video_url} />
            </div>

            {/* CTA */}
            <div className="mt-10 md:mt-12 max-w-[520px] mx-auto text-center">
              <TrainingForm
                mode={mode}
                ctaLabel={ctaLabel}
                ctaSubline={ctaSubline}
                helperText={helperText}
                variant="modal"
              />
            </div>

            {/* Inline countdown — single row */}
            {isUpcoming && event?.starts_at && (
              <div className="mt-8 md:mt-10 flex justify-center">
                <InlineCountdown targetIso={event.starts_at} />
              </div>
            )}
          </div>
        </section>

        {/* SOCIAL PROOF — REAL VIDEO REVIEWS */}
        <section className="bg-ivory pt-12 md:pt-16 pb-2">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto text-center mb-2">
              <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
                Founders Oge has worked with
              </p>
            </div>
          </div>
        </section>
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

        {/* DARK RE-CTA — matches Hormozi's bottom navy section */}
        <section className="bg-[#1a2230] text-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[540px] mx-auto text-center">
              <h2 className="font-serif text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.018em] text-ivory">
                Attend the live training
              </h2>

              <div className="mt-8 flex justify-center">
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
