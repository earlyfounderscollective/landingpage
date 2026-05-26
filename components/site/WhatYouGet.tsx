const pillars = [
  {
    n: "01",
    title: "Weekly Accountability",
    body: "Stay focused and keep moving forward consistently even when motivation fades.",
  },
  {
    n: "02",
    title: "Live Coaching & Support",
    body: "Get feedback, direction, and clarity when you feel stuck or overwhelmed.",
  },
  {
    n: "03",
    title: "Execution Systems",
    body: "Simple frameworks and systems that help you organize your business and simplify your next steps.",
  },
  {
    n: "04",
    title: "A Real Community",
    body: "Build alongside other early-stage business owners who understand what this journey actually feels like.",
  },
  {
    n: "05",
    title: "Momentum Tracking",
    body: "Measure progress without obsessing over perfection.",
  },
  {
    n: "06",
    title: "Simplified Strategy",
    body: "Cut through the noise and focus on what actually moves your business forward.",
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
            A structure designed to help you keep moving forward.
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
