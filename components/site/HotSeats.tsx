const bullets = [
  "Live business audits",
  "Offer feedback",
  "Sales and follow-up troubleshooting",
  "Founder hot seats",
  "Monthly build sessions",
  "Practical next steps, not theory",
];

export function HotSeats() {
  return (
    <section className="bg-bone py-24 md:py-32 grain border-t border-forest/10">
      <div className="container-page">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <span className="eyebrow">Inside the Room</span>
            <div className="rule mt-6 mb-8" aria-hidden />
            <h2 className="font-serif text-[32px] md:text-[42px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-forest text-balance">
              Founder hot seats &amp; build sessions.
            </h2>
            <div className="mt-7 space-y-4 text-[15.5px] md:text-[16px] leading-[1.62] text-ink/72 max-w-prose">
              <p>
                Inside Early Founders we work through real businesses, real
                offers, real sales problems, and real systems.
              </p>
              <p className="font-serif italic text-forest/85 text-[17px] md:text-[18px] leading-[1.5]">
                Bring what you&rsquo;re building. Get feedback. Leave with
                clearer next steps.
              </p>
            </div>
          </div>

          <ul className="lg:col-span-6 lg:pt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {bullets.map((b) => (
              <li
                key={b}
                className="grid grid-cols-[auto_1fr] items-baseline gap-3.5 text-[15.5px] leading-[1.5] text-ink/85"
              >
                <span className="mt-[10px] h-[1.5px] w-3 bg-brass" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
