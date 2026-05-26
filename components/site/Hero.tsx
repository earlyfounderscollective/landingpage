import Link from "next/link";
import { FounderVideo } from "./FounderVideo";

export function Hero() {
  return (
    <section className="relative bg-ivory overflow-hidden grain">
      <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[170px] pb-12 md:pb-16 relative z-10">
        <div className="max-w-[820px] mx-auto text-center">
          <h1 className="font-serif text-[26px] sm:text-[34px] md:text-[46px] lg:text-[54px] leading-[1.08] tracking-[-0.018em] text-forest text-balance">
            Grow your business with more clarity, consistency, and momentum
            over the next 180 days &mdash; without trying to figure everything
            out alone.
          </h1>
        </div>

        <div
          id="founder-video"
          className="mt-7 sm:mt-8 md:mt-10 max-w-5xl mx-auto scroll-mt-32"
        >
          <FounderVideo
            label="Ogechukwu Madu — A note from the founder"
            poster="/media/founder-headshot.jpg"
          />
        </div>

        <div className="mt-7 sm:mt-8 md:mt-10 flex flex-col items-center text-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-forest text-ivory text-[14px] sm:text-[15px] font-medium tracking-[0.02em] px-9 sm:px-10 py-4 sm:py-[18px] transition-all duration-500 ease-editorial hover:bg-ink hover:-translate-y-[1px]"
          >
            Apply Now
          </Link>
          <p className="mt-5 text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-forest/55">
            Applications reviewed manually
          </p>
        </div>
      </div>
    </section>
  );
}
