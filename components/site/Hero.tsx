import Link from "next/link";
import { FounderVideo } from "./FounderVideo";

export function Hero() {
  return (
    <section className="relative bg-ivory overflow-hidden grain">
      <div className="container-page pt-[110px] sm:pt-[130px] md:pt-[160px] pb-12 md:pb-16 relative z-10">
        <div className="max-w-[820px] mx-auto text-center">
          <h1 className="font-serif text-forest">
            <span className="block text-[26px] sm:text-[34px] md:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.018em]">
              Build the structure
            </span>
            <span className="block hand text-[42px] sm:text-[52px] md:text-[68px] lg:text-[78px] leading-[0.95] text-brass mt-1 sm:mt-2 -rotate-[2deg]">
              that gets you customers.
            </span>
          </h1>

          <p className="mt-7 sm:mt-8 max-w-[600px] mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-ink/72">
            A founder community for early-stage business owners who want more
            customers, better systems, and consistent momentum.
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

        <div className="mt-7 sm:mt-8 md:mt-10 flex flex-col items-center gap-3.5">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-forest text-ivory text-[14px] sm:text-[15px] font-medium tracking-[0.02em] px-9 sm:px-10 py-4 sm:py-[18px] transition-all duration-500 ease-editorial hover:bg-ink hover:-translate-y-[1px]"
          >
            Apply for Access
          </Link>
          <p className="font-serif italic text-[12.5px] sm:text-[13px] text-brass/90 tracking-[0.01em]">
            Month-to-month membership
          </p>
          <a
            href="#checklist"
            className="mt-1 text-[13px] sm:text-[13.5px] font-medium text-forest/75 hover:text-forest underline underline-offset-[6px] decoration-brass/60 decoration-1 transition-colors"
          >
            Download the Founder Sales &amp; Systems Checklist
          </a>
        </div>
      </div>
    </section>
  );
}
