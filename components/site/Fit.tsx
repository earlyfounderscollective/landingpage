const forYou = [
  "You know you are capable of more but struggle staying consistent alone.",
  "You feel overwhelmed by everything you “should” be doing.",
  "You are tired of trying to figure business out by yourself.",
  "You want structure, accountability, and clear direction.",
  "You are ready to stop overthinking and start executing.",
  "You want people around you who actually understand what you are trying to build.",
  "You are serious about growth and willing to do the work.",
];

const notForYou = [
  "You are looking for shortcuts.",
  "You want motivation without execution.",
  "You constantly jump from idea to idea without committing.",
  "You avoid accountability or honest feedback.",
  "You want passive content without participation.",
  "You are unwilling to simplify, focus, and do the work consistently.",
];

function Check({ tone = "forest" }: { tone?: "forest" | "bone" }) {
  return (
    <span
      className={`mt-[3px] inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border ${
        tone === "forest"
          ? "border-forest/30 text-forest"
          : "border-ivory/30 text-ivory"
      }`}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path
          d="M2 5.5L4.5 8L9 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Cross({ tone = "ivory" }: { tone?: "ivory" | "forest" }) {
  return (
    <span
      className={`mt-[3px] inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border ${
        tone === "ivory"
          ? "border-ivory/30 text-ivory/70"
          : "border-forest/30 text-forest/70"
      }`}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <path
          d="M1 1L8 8M8 1L1 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Fit() {
  return (
    <section className="bg-bone section grain">
      <div className="container-page">
        <div className="max-w-narrow mx-auto text-center mb-16 md:mb-20">
          <span className="eyebrow">Is This For You?</span>
          <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
          <h2 className="font-serif text-display-lg text-forest text-balance">
            Who this room is for.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line/60 border border-line/60 rounded-card overflow-hidden">
          {/* For you */}
          <div className="bg-ivory p-8 md:p-12 lg:p-14">
            <p className="eyebrow mb-6">This Is For You If&hellip;</p>
            <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.2] text-forest mb-10">
              You&rsquo;re ready to build with structure.
            </h3>
            <ul className="space-y-5">
              {forYou.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[auto_1fr] items-start gap-4 text-[16px] md:text-[16.5px] leading-[1.55] text-ink/85"
                >
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not for you */}
          <div className="bg-forest text-ivory p-8 md:p-12 lg:p-14 grain relative">
            <p className="eyebrow-dark mb-6">This Probably Isn&rsquo;t For You If&hellip;</p>
            <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.2] text-ivory mb-10">
              You&rsquo;re looking for something else.
            </h3>
            <ul className="space-y-5 relative z-10">
              {notForYou.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[auto_1fr] items-start gap-4 text-[16px] md:text-[16.5px] leading-[1.55] text-ivory/85"
                >
                  <Cross />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
