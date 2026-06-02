const withoutSystem = [
  "People are interested, but nothing turns into consistent sales.",
  "You post content, but there is no clear next step.",
  "Leads slip through the cracks because follow-up is inconsistent.",
  "You keep changing the offer before the market has enough time to respond.",
  "You work hard, but don’t know which activities are actually creating revenue.",
];

const withSystem = [
  "People understand what you sell and who it is for.",
  "Your content points people toward one clear next step.",
  "Leads are captured, followed up with, and moved toward a decision.",
  "You stay consistent long enough to test what works.",
  "Your week is built around the actions most likely to create customers.",
];

export function Possibility() {
  return (
    <section id="about" className="bg-bone py-24 md:py-36 grain">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-[34px] sm:text-[42px] md:text-[54px] lg:text-[60px] leading-[1.04] tracking-[-0.022em] text-forest text-balance">
            The problem isn&rsquo;t ambition. It&rsquo;s building without a
            sales system.
          </h2>

          <p className="mt-10 font-serif italic text-[18px] md:text-[20px] leading-[1.5] text-ink/70 max-w-2xl mx-auto text-balance">
            Most early-stage founders are not short on effort. They&rsquo;re
            working hard, but they don&rsquo;t have a clear offer, consistent
            visibility, a simple follow-up process, or a structure for turning
            interest into customers.
          </p>
        </div>

        <div
          className="mx-auto mt-16 md:mt-24 h-px w-12 bg-forest/25"
          aria-hidden
        />

        <div className="max-w-5xl mx-auto mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-24">
          {/* Without a sales system */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-forest/55 mb-3">
              01 &middot; Without a sales system
            </p>
            <p className="font-serif italic text-[15px] text-ink/55 mb-9">
              Reaction mode.
            </p>

            <ul className="space-y-5 md:space-y-6">
              {withoutSystem.map((line) => (
                <li
                  key={line}
                  className="text-[16px] md:text-[16.5px] leading-[1.55] text-ink/65"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* With a sales system */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-forest mb-3">
              02 &middot; With a sales system
            </p>
            <p className="font-serif italic text-[15px] text-brass mb-9">
              Operating mode.
            </p>

            <ul className="space-y-5 md:space-y-6">
              {withSystem.map((line) => (
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
          <br className="hidden md:block" /> You need a clearer path to
          customers.
        </p>
      </div>
    </section>
  );
}
