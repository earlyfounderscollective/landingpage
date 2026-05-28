import Link from "next/link";
import { FounderVideo } from "./FounderVideo";

export function Hero() {
  return (
    <section className="relative bg-ivory overflow-hidden grain">
      <div className="container-page pt-[110px] sm:pt-[130px] md:pt-[160px] pb-12 md:pb-16 relative z-10">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass">
            For early-stage business owners
          </p>

          <h1 className="mt-5 sm:mt-7 font-serif text-forest">
            <span className="block text-[26px] sm:text-[34px] md:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.018em]">
              Grow your business with more
            </span>
            <span className="block hand text-[42px] sm:text-[52px] md:text-[68px] lg:text-[78px] leading-[0.95] text-brass mt-1 sm:mt-2 -rotate-[2deg]">
              clarity, consistency &amp; momentum
            </span>
            <span className="block mt-2 sm:mt-3 text-[18px] sm:text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.014em] text-forest/85">
              over the next 180 days.
            </span>
          </h1>

          <p className="mt-6 sm:mt-7 max-w-[460px] mx-auto text-[14px] sm:text-[15px] leading-[1.55] text-ink/70">
            <span className="font-semibold text-forest">Without</span> burning
            out, second-guessing yourself, or starting over every month.
          </p>
        </div>

        <div
          id="founder-video"
          className="mt-9 sm:mt-10 md:mt-12 max-w-5xl mx-auto scroll-mt-32"
        >
          <FounderVideo
            label="Ogechukwu Madu, a note from the founder"
            poster="/founder-poster.jpg"
          />
        </div>

        <div className="mt-7 sm:mt-8 md:mt-10 flex justify-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-forest text-ivory text-[14px] sm:text-[15px] font-medium tracking-[0.02em] px-9 sm:px-10 py-4 sm:py-[18px] transition-all duration-500 ease-editorial hover:bg-ink hover:-translate-y-[1px]"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
