const pillars = [
  {
    n: "01",
    title: "Offer Clarity",
    body: "Simplify what you sell, who it is for, and why people should care.",
  },
  {
    n: "02",
    title: "Visibility & Content",
    body: "Learn how to show up consistently so people actually understand what you do.",
  },
  {
    n: "03",
    title: "Sales & Follow-Up",
    body: "Build a simple process for capturing leads, following up, and turning interest into customers.",
  },
  {
    n: "04",
    title: "Execution Systems",
    body: "Create workflows that help you operate the business instead of constantly reacting.",
  },
  {
    n: "05",
    title: "Weekly Accountability",
    body: "Stay focused on the actions that actually move the business forward.",
  },
  {
    n: "06",
    title: "Founder Community",
    body: "Build around other early-stage business owners who understand the pressure, uncertainty, and ambition of the season you're in.",
  },
];

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="bg-ivory section grain">
      <div className="container-page">
        <div className="max-w-narrow mx-auto text-center">
          <span className="eyebrow">Inside the Community</span>
          <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
          <h2 className="font-serif text-display-lg text-forest text-balance">
            What we actually work on together.
          </h2>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line/60 border border-line/60 rounded-card overflow-hidden">
          {pillars.map((p) => (
            <article
              key={p.n}
              className="bg-ivory p-8 md:p-10 lg:p-12 transition-colors duration-500 ease-editorial hover:bg-bone"
            >
              <p className="font-serif text-[15px] tracking-[0.04em] text-brass">
                {p.n}
              </p>
              <h3 className="mt-5 font-serif text-[26px] md:text-[28px] leading-[1.2] text-forest">
                {p.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink/70">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
