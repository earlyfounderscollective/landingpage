import Link from "next/link";

const shifts = [
  { before: "Posting without a goal", after: "Pointing every post at one offer" },
  { before: "Hoping leads come back", after: "Following up so they don’t slip" },
  { before: "Changing the offer every month", after: "Letting one offer earn its test" },
  { before: "Reacting to whatever’s loudest", after: "Running the week around what creates customers" },
];

export function RealProblem() {
  return (
    <section className="bg-ivory py-24 md:py-36 grain border-t border-forest/10">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 max-w-5xl mx-auto items-start">
          {/* LEFT: diagnosis */}
          <div className="lg:col-span-5">
            <span className="eyebrow">The Honest Part</span>
            <h2 className="mt-6 font-serif text-[36px] md:text-[48px] lg:text-[56px] leading-[1.04] tracking-[-0.022em] text-forest text-balance">
              You need a clearer path to customers.
            </h2>
            <p className="mt-8 text-[16px] md:text-[16.5px] leading-[1.6] text-ink/70 max-w-sm">
              You&rsquo;re not short on effort. You&rsquo;re short on a simple
              system that captures interest, follows up consistently, and turns
              it into customers.
            </p>
          </div>

          {/* RIGHT: instead of → do this */}
          <div className="lg:col-span-7 lg:pt-2">
            <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-x-6 md:gap-x-8 pb-5 md:pb-6 border-b border-forest/15">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-forest/55">
                Instead of
              </p>
              <span aria-hidden className="text-forest/30 text-[14px]">
                &rarr;
              </span>
              <p className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-forest">
                Do this
              </p>
            </div>

            <ul>
              {shifts.map((s, i) => (
                <li
                  key={s.before}
                  className={`grid grid-cols-[1fr_auto_1fr] items-baseline gap-x-6 md:gap-x-8 py-6 md:py-8 ${
                    i < shifts.length - 1
                      ? "border-b border-forest/10"
                      : ""
                  }`}
                >
                  <span className="text-[14.5px] md:text-[15.5px] leading-[1.4] text-ink/55">
                    {s.before}
                  </span>
                  <span aria-hidden className="text-forest/25 text-[12px]">
                    &rarr;
                  </span>
                  <span className="font-serif text-[18px] md:text-[20px] leading-[1.3] text-forest text-balance">
                    {s.after}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA — centered under the full section */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-forest text-ivory text-[14px] font-medium tracking-[0.02em] px-10 py-[18px] transition-all duration-500 ease-editorial hover:bg-ink hover:-translate-y-[1px]"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
