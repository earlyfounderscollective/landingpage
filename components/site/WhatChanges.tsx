const shifts = [
  { n: "01", line: "Less consumption, more decision." },
  { n: "02", line: "Less reacting, more priority." },
  { n: "03", line: "Less pivoting, more finishing." },
  { n: "04", line: "Less guessing, more system." },
];

export function WhatChanges() {
  return (
    <section className="bg-forest text-ivory py-24 md:py-36 grain relative overflow-hidden">
      <div className="container-page relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <span className="eyebrow-dark">What Changes Here</span>
            <h2 className="mt-6 font-serif text-[36px] md:text-[48px] lg:text-[56px] leading-[1.04] tracking-[-0.022em] text-ivory text-balance">
              The work becomes simpler.
            </h2>
          </div>

          <ol className="mt-16 md:mt-20 border-y border-ivory/15">
            {shifts.map((s, i) => (
              <li
                key={s.n}
                className={`grid grid-cols-[auto_1fr] items-baseline gap-6 md:gap-10 py-7 md:py-9 ${
                  i < shifts.length - 1 ? "border-b border-ivory/12" : ""
                }`}
              >
                <span className="font-serif text-[18px] md:text-[20px] tracking-[0.04em] text-brass">
                  {s.n}
                </span>
                <p className="font-serif text-[22px] md:text-[28px] leading-[1.22] text-ivory text-balance">
                  {s.line}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-14 md:mt-20 text-center font-serif italic text-[18px] md:text-[22px] leading-[1.5] text-ivory/80 text-balance">
            Same work. Different operating system.
          </p>
        </div>
      </div>
    </section>
  );
}
