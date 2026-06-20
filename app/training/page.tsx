import type { Metadata } from "next";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import { TrainingForm } from "@/components/funnel/TrainingForm";
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

  // Default mode is "between" if no event row exists yet.
  const mode = event?.status ?? "between";

  let eyebrow = "FREE LIVE TRAINING · COMING SOON";
  let dateLine = "Next training drops soon. Get notified when it does.";
  let ctaLabel = "Notify Me";
  let helperText = "We'll email you the moment a date is set.";

  if (mode === "upcoming" && event?.starts_at) {
    eyebrow = `FREE LIVE TRAINING · ${event.duration_minutes ?? 40} MINUTES`;
    dateLine = formatTrainingDateLine(event);
    ctaLabel = "Reserve My Seat";
    helperText = "Zoom link sent to your inbox after registration.";
  } else if (mode === "replay") {
    eyebrow = "FREE TRAINING · WATCH ANYTIME";
    dateLine = "Available to watch now";
    ctaLabel = "Watch the Replay";
    helperText = "Replay link sent to your inbox after registration.";
  }

  return (
    <>
      <FunnelHeader tone="light" />
      <main>
        {/* HERO — Forest background for visual differentiation */}
        <section className="relative bg-forest text-ivory overflow-hidden">
          <div className="container-page pt-[140px] sm:pt-[160px] md:pt-[180px] pb-16 md:pb-24">
            <div className="max-w-[760px] mx-auto text-center">
              <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass">
                {eyebrow}
              </p>

              <h1 className="mt-7 font-serif text-ivory">
                <span className="block text-[30px] sm:text-[40px] md:text-[50px] lg:text-[56px] leading-[1.08] tracking-[-0.018em]">
                  The difference between a
                  <br />
                  side hustle and a real business
                </span>
                <span className="block hand text-[42px] sm:text-[52px] md:text-[64px] leading-[0.95] text-brass mt-3 sm:mt-4 -rotate-[2deg]">
                  isn't talent.
                </span>
              </h1>

              <p className="mt-8 font-serif italic text-[18px] sm:text-[20px] md:text-[22px] leading-[1.45] text-ivory/85">
                It's knowing how to build it.
              </p>

              <p className="mt-7 max-w-[520px] mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-ivory/70">
                If you've ever been paid for what you're good at, you're
                probably closer than you think. This training will show you
                what to do next.
              </p>

              <p className="mt-10 text-[14px] text-brass font-medium">
                {dateLine}
              </p>

              <div className="mt-7">
                <TrainingForm
                  mode={mode}
                  ctaLabel={ctaLabel}
                  helperText={helperText}
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOSTED BY */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                Hosted by Oge Madu
              </p>
              <div className="mt-7 space-y-4 text-[16px] md:text-[16.5px] leading-[1.7] text-ink/78">
                <p>
                  Over the last decade, I've built businesses across different
                  industries and learned that successful businesses may look
                  different, but they usually have the same foundation.
                </p>
                <p>This training is about helping you build yours.</p>
              </div>
            </div>
          </div>
        </section>

        {/* IN 40 MINUTES YOU'LL LEARN */}
        <section className="bg-bone py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass text-center">
                In 40 Minutes You'll Learn
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
                    <span
                      className="mt-[12px] h-[1.5px] w-3 bg-brass shrink-0"
                      aria-hidden
                    />
                    <span className="font-serif text-[18px] md:text-[20px] leading-[1.45] text-forest">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* RE-PITCH CTA */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <h2 className="font-serif text-[28px] md:text-[36px] leading-[1.15] tracking-[-0.018em] text-forest">
                {mode === "upcoming"
                  ? "Reserve your seat. Watch live or catch the replay."
                  : mode === "replay"
                    ? "Watch the replay. On your schedule."
                    : "Be first in line. Get notified when the next one drops."}
              </h2>

              <p className="mt-5 text-[14px] text-brass font-medium">
                {dateLine}
              </p>

              <div className="mt-8">
                <TrainingForm
                  mode={mode}
                  ctaLabel={ctaLabel}
                  helperText={helperText}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
    </>
  );
}
