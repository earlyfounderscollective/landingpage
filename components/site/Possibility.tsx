const withoutStructure = [
  "You start every week without a clear priority.",
  "You react to your inbox instead of running your day.",
  "You consume strategy content and still can't decide what to do.",
  "You move between three projects without finishing one.",
  "You make decisions on instinct because there's no framework underneath.",
];

const withStructure = [
  "You walk into Monday knowing the one thing that moves the business this week.",
  "You operate from a system, not from your inbox.",
  "You stop chasing information and start using what you already have.",
  "You finish what you start because you only commit to what fits.",
  "You decide against a simple operating model, not from anxiety.",
];

export function Possibility() {
  return (
    <section id="about" className="bg-bone py-24 md:py-36 grain">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-[34px] sm:text-[42px] md:text-[54px] lg:text-[60px] leading-[1.04] tracking-[-0.022em] text-forest text-balance">
            The problem isn&rsquo;t ambition. It&rsquo;s operating without
            structure.
          </h2>

          <p className="mt-10 font-serif italic text-[18px] md:text-[20px] leading-[1.5] text-ink/70 max-w-2xl mx-auto text-balance">
            Most early-stage business owners aren&rsquo;t short on effort.
            They&rsquo;re scattered across too many decisions, too much
            information, and no clear priorities &mdash; moving reactively
            instead of operationally.
          </p>
        </div>

        <div
          className="mx-auto mt-16 md:mt-24 h-px w-12 bg-forest/25"
          aria-hidden
        />

        <div className="max-w-5xl mx-auto mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-24">
          {/* Without structure */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-forest/55 mb-3">
              01 &mdash; Without structure
            </p>
            <p className="font-serif italic text-[15px] text-ink/55 mb-9">
              Reaction mode.
            </p>

            <ul className="space-y-5 md:space-y-6">
              {withoutStructure.map((line) => (
                <li
                  key={line}
                  className="text-[16px] md:text-[16.5px] leading-[1.55] text-ink/65"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* With structure */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-forest mb-3">
              02 &mdash; With structure
            </p>
            <p className="font-serif italic text-[15px] text-brass mb-9">
              Operating mode.
            </p>

            <ul className="space-y-5 md:space-y-6">
              {withStructure.map((line) => (
                <li
                  key={line}
                  className="font-serif text-[17.5px] md:text-[18.5px] leading-[1.45] text-forest text-balance"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="max-w-2xl mx-auto mt-16 md:mt-20 text-center font-serif italic text-[20px] md:text-[24px] leading-[1.45] text-forest/85 text-balance">
          You don&rsquo;t need more hustle.
          <br className="hidden md:block" /> You need a simpler way to operate.
        </p>
      </div>
    </section>
  );
}
