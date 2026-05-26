"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is this a course?",
    a: "No. There are no modules to binge, no homework piling up, no replays to fall behind on. Early Founders Collective is a live execution environment built around weekly progress, real conversations, and honest feedback from people actively building.",
  },
  {
    q: "Who is this for?",
    a: "Early-stage business owners who are tired of trying to figure everything out themselves. People running real products, services, software, communities, or brands. You don't need a polished company. You need a genuine commitment to execute consistently.",
  },
  {
    q: "Do I need revenue already?",
    a: "No. Members range from pre-launch builders to owners with early revenue. What matters is that you're actually building, not just thinking about it.",
  },
  {
    q: "What happens after I apply?",
    a: "Every application is reviewed manually. If it looks like a strong fit, you'll receive next steps with payment and onboarding within 5 business days. If not, you'll still hear back either way.",
  },
  {
    q: "How much time should I commit?",
    a: "Plan on a few focused hours each week. Enough to show up to the live call, share progress, and meaningfully participate. The rhythm is what makes the room work.",
  },
  {
    q: "Is this online or in person?",
    a: "The core community is online. That's where the weekly conversations, accountability, and execution support live. In-person mastermind gatherings are offered separately as optional experiences at an additional cost, so the people who want a deeper in-room moment can opt in without it being bundled into the base membership.",
  },
  {
    q: "What if I'm still at the idea stage?",
    a: "That's welcome, as long as you're genuinely trying to build, not just thinking about it. The earliest stages are often where the room helps the most.",
  },
  {
    q: "How does payment work?",
    a: "Application first. If accepted, you'll be invited to complete payment via Stripe. We don't collect payment from applicants who aren't a fit.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Membership is month-to-month, so you can step away when the season calls for it. This is a room, not a contract.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-ivory section grain">
      <div className="container-page">
        <div className="max-w-narrow mx-auto text-center mb-16 md:mb-20">
          <span className="eyebrow">Questions</span>
          <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
          <h2 className="font-serif text-display-lg text-forest text-balance">
            A few honest answers.
          </h2>
          <p className="mt-6 text-[15.5px] leading-[1.65] text-ink/65">
            Still curious? Reach out at{" "}
            <a
              href="mailto:contact@earlyfounderscollective.com"
              className="link-underline text-forest"
            >
              contact@earlyfounderscollective.com
            </a>
            .
          </p>
        </div>

        <ul className="max-w-3xl mx-auto divide-y divide-line/70 border-y border-line/70">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full py-7 md:py-8 flex items-start justify-between gap-6 text-left group"
                >
                  <span className="font-serif text-[19px] md:text-[22px] leading-[1.3] text-forest pr-4 text-balance">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 ease-editorial ${
                      isOpen
                        ? "rotate-45 bg-forest text-ivory border-forest"
                        : "border-forest/25 text-forest group-hover:border-forest/60"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 1V11M1 6H11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-editorial ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 md:pb-10 max-w-2xl">
                      <p className="text-[16px] md:text-[16.5px] leading-[1.7] text-ink/75">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
