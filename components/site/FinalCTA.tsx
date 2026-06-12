import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="bg-forest text-ivory section grain relative overflow-hidden">
      <div className="container-page relative z-10">
        <div className="max-w-narrow mx-auto text-center">
          <p className="hand text-[34px] md:text-[42px] leading-none text-brass/90 rotate-[-2deg]">
            Your next 180 days do not need to look like your last 180.
          </p>

          <h2 className="mt-10 md:mt-14 font-serif text-display-xl text-ivory text-balance">
            Stop building without a clear path to customers.
          </h2>

          <div className="mt-12 max-w-xl mx-auto space-y-5 text-[17px] md:text-[18px] leading-[1.72] text-ivory/80">
            <p>You already have the ambition.</p>
            <p>
              Now you need clarity, structure, visibility, follow-up, and the
              right room to help you keep building.
            </p>
            <p className="font-serif italic text-ivory">
              If this feels like the kind of room you have been needing, apply
              for access below.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ivory text-forest px-10 py-[20px] text-[14.5px] font-medium tracking-[0.02em] transition-all duration-500 ease-editorial hover:bg-bone hover:-translate-y-[1px]"
            >
              Apply for Access
            </Link>
            <p className="mt-5 font-serif italic text-[13.5px] text-brass">
              Month-to-month membership
            </p>
            <p className="mt-3 text-[12px] uppercase tracking-[0.28em] text-ivory/55">
              Applications reviewed manually &middot; Reply within 2-3 days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
