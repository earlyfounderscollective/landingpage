import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FAQAccordion } from "@/components/funnel/FAQAccordion";
import { getBootcampConfig, formatCohortDate } from "@/lib/bootcamp";
import { CheckoutButton } from "./CheckoutButton";

export const metadata: Metadata = {
  title: "Founders Foundation · Early Founders Collective",
  description:
    "A 4-week guided program to turn your skill, side hustle, or business idea into a legitimate business. $497.",
};

export const dynamic = "force-dynamic";

export default async function BootcampPage({
  searchParams,
}: {
  searchParams: { source?: string };
}) {
  const source = searchParams.source ?? "direct";
  const config = await getBootcampConfig();
  const priceLabel = `$${(config.priceCents / 100).toLocaleString()}`;
  const originalLabel = `$${(config.originalPriceCents / 100).toLocaleString()}`;
  const cohortDate = formatCohortDate(config.cohortStartDate);

  return (
    <>
      <Header tone="dark" />
      <main>
        {/* HERO */}
        <section className="bg-forest text-ivory pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
          <div className="container-page relative">
            <div className="max-w-[820px] mx-auto text-center">
              <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.3em] uppercase text-brass mb-7">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                Founders Foundation · 4 weeks
              </p>
              <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[64px] leading-[1.04] tracking-[-0.02em] text-ivory">
                Build the foundation every real business needs.
              </h1>
              <div className="mt-9 max-w-[640px] mx-auto text-[16.5px] md:text-[18px] leading-[1.7] text-ivory/78 space-y-5">
                <p>
                  A 4-week guided program designed to help you turn your skill,
                  side hustle, or business idea into a legitimate business
                  that's structured, professional, and ready to grow.
                </p>
                <p>
                  Whether you're a photographer, painter, event planner,
                  consultant, real estate professional, trainer, creator, or
                  service provider, the goal is the same:
                </p>
                <p
                  className="font-serif italic text-[24px] md:text-[28px] text-brass leading-[1.2]"
                  style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
                >
                  Build something real.
                </p>
              </div>
              <div className="mt-10">
                <CheckoutButton
                  source={source}
                  label="Join Founders Foundation"
                />
                <div className="mt-5 inline-flex items-baseline gap-3">
                  <span className="text-[12px] font-semibold tracking-[0.22em] uppercase text-ivory/55">
                    Investment
                  </span>
                  <span className="font-serif text-[24px] text-ivory/55 line-through tabular-nums">
                    {originalLabel}
                  </span>
                  <span className="font-serif text-[28px] text-brass tabular-nums">
                    {priceLabel}
                  </span>
                </div>
              </div>
              {config.cohortLabel && (
                <p className="mt-6 text-[12px] text-ivory/55 tracking-[0.18em] uppercase">
                  {config.cohortLabel}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEAVE WITH */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  What you'll leave with
                </p>
                <h2 className="font-serif text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.018em] text-forest">
                  By the end of Founders Foundation, you'll have:
                </h2>
              </div>

              <ul className="space-y-4 max-w-[600px] mx-auto">
                {LEAVE_WITH.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-4 items-start text-[16px] md:text-[17px] leading-[1.6] text-forest"
                  >
                    <span
                      className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-ivory"
                      aria-hidden
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6.5L4.5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-14 max-w-[520px] mx-auto text-center space-y-2">
                <p className="font-serif text-[22px] md:text-[26px] leading-[1.3] text-ink/55 italic">
                  This isn't about consuming more content.
                </p>
                <p className="font-serif text-[24px] md:text-[30px] leading-[1.25] text-forest">
                  It's about building a business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY THIS EXISTS */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto">
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  Why Founders Foundation exists
                </p>
                <h2 className="font-serif text-[32px] md:text-[42px] leading-[1.1] tracking-[-0.015em] text-forest">
                  Most people don't fail because they lack talent.
                </h2>
              </div>

              <div className="space-y-5 text-[16.5px] md:text-[17px] leading-[1.75] text-ink/75 max-w-[600px] mx-auto">
                <p>
                  Most people fail because nobody teaches them how to turn a
                  skill into a business.
                </p>
                <p>
                  So they spend months jumping between YouTube videos, Google
                  searches, podcasts, and random advice trying to figure out
                  what to do next.
                </p>
                <p>
                  Founders Foundation was built to simplify the process.
                </p>
                <p className="font-serif text-[19px] md:text-[20px] text-forest italic leading-[1.5] pt-2">
                  Instead of wondering where to start, you'll follow a proven
                  roadmap and build alongside people doing the same thing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE FOUR FOUNDATIONS */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto">
              <div className="text-center mb-14">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  The Four Foundations
                </p>
                <h2 className="font-serif text-[34px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                  The path is the same every time.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {FOUNDATIONS.map((f, i) => (
                  <article
                    key={f.title}
                    className="bg-bone rounded-2xl p-7 md:p-9 border border-line/60"
                  >
                    <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-mute mb-2">
                      Foundation {NUM[i]}
                    </p>
                    <h3 className="font-serif text-[30px] md:text-[34px] leading-[1.1] tracking-[-0.015em] text-forest mb-5">
                      {f.title}
                    </h3>
                    <p className="text-[15px] leading-[1.65] text-ink/72 mb-4">
                      {f.lead}
                    </p>
                    {f.body && (
                      <p className="text-[15px] leading-[1.65] text-ink/72">
                        {f.body}
                      </p>
                    )}
                    {f.list && (
                      <ul className="space-y-1.5 mt-3 text-[15px] leading-[1.55] text-ink/72">
                        {f.list.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[920px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  What's included
                </p>
                <h2 className="font-serif text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Everything you need to build.
                </h2>
              </div>

              <div className="space-y-5">
                {INCLUDED.map((item) => (
                  <div
                    key={item.title}
                    className="bg-ivory rounded-2xl p-7 md:p-9 border border-line/60"
                  >
                    <h3 className="font-serif text-[22px] md:text-[24px] leading-[1.2] text-forest mb-3">
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className="text-[15.5px] leading-[1.65] text-ink/72">
                        {item.body}
                      </p>
                    )}
                    {item.list && (
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-[15px] leading-[1.55] text-ink/72">
                        {item.list.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                    {item.foot && (
                      <p className="mt-3 text-[14.5px] leading-[1.65] text-ink/65">
                        {item.foot}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHO THIS IS FOR / NOT FOR */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <FitColumn title="Who this is for" items={FIT_YES} tone="yes" />
              <FitColumn title="Who this is not for" items={FIT_NO} tone="no" />
            </div>
          </div>
        </section>

        {/* MEET YOUR HOST */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[820px] mx-auto text-center">
              <div className="mb-9 inline-block relative">
                <div
                  className="absolute -inset-3 bg-brass/20 rounded-2xl blur-xl"
                  aria-hidden
                />
                <Image
                  src="/media/speaking.jpg"
                  alt="Oge Madu speaking"
                  width={420}
                  height={520}
                  className="relative rounded-2xl object-cover shadow-[0_30px_70px_-25px_rgba(35,53,45,0.45)]"
                  style={{
                    aspectRatio: "4/5",
                    maxHeight: "520px",
                    width: "auto",
                  }}
                />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                Meet your host
              </p>
              <h3 className="font-serif text-[32px] md:text-[38px] leading-[1.15] tracking-[-0.015em] text-forest">
                Oge Madu
              </h3>
              <div className="mt-7 max-w-[580px] mx-auto space-y-5 text-[16.5px] leading-[1.7] text-ink/75">
                <p>
                  Over the last decade, Oge has built businesses across multiple
                  industries including home services, consumer products,
                  finance, real estate, and community organizations.
                </p>
                <p>Along the way, he learned something important:</p>
                <p className="font-serif text-[19px] md:text-[20px] text-forest italic leading-[1.5]">
                  Successful businesses often look completely different on the
                  surface, but they usually have the same foundation.
                </p>
                <p>
                  Founders Foundation is the roadmap he wishes he had when he
                  started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AFTER GRADUATION */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  What happens after graduation?
                </p>
                <h2 className="font-serif text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Graduation isn't the end.
                </h2>
                <p className="mt-3 font-serif italic text-[22px] md:text-[24px] text-brass leading-[1.3]">
                  It's the beginning.
                </p>
              </div>

              <div className="bg-bone rounded-2xl p-7 md:p-9 border border-line/60 max-w-[640px] mx-auto">
                <p className="text-[15.5px] leading-[1.65] text-ink/72 mb-5">
                  After completing Founders Foundation, graduates receive:
                </p>
                <ul className="space-y-3">
                  {AFTER_GRADUATION.map((g) => (
                    <li
                      key={g}
                      className="grid grid-cols-[auto_1fr] gap-3.5 items-start text-[15.5px] leading-[1.55] text-forest"
                    >
                      <span
                        className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-ivory"
                        aria-hidden
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6.5L4.5 9L10 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 pt-6 border-t border-line/60 text-[15.5px] leading-[1.7] text-ink/72">
                  Early Founders Collective is designed for founders who want
                  ongoing accountability, implementation, networking, and
                  support as they continue building their businesses.
                </p>
                <p className="mt-3 font-serif italic text-[16px] text-forest/85 leading-[1.5]">
                  Because building a business doesn't end after four weeks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  Frequently asked questions
                </p>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Quick answers.
                </h2>
              </div>
              <FAQAccordion
                items={[
                  {
                    q: "When does the next cohort start?",
                    a: cohortDate
                      ? `The next cohort begins ${cohortDate}.`
                      : "The next cohort opens soon. Reserve your seat and we'll email you the start date.",
                  },
                  {
                    q: "What if I miss a session?",
                    a: "Every session is recorded and available to participants.",
                  },
                  {
                    q: "Do I keep access to the toolkit?",
                    a: "Yes. You'll retain access to the Business Builder Toolkit after the program ends.",
                  },
                  {
                    q: "How much time should I expect to commit?",
                    a: "Plan for approximately 4-6 hours per week, including live sessions and implementation.",
                  },
                  {
                    q: "Will this work for my type of business?",
                    a: "Founders Foundation is designed around business fundamentals that apply across industries. The businesses may be different. The foundation is often the same.",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-24 md:py-28">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto text-center">
              <h2 className="font-serif text-[36px] md:text-[50px] leading-[1.05] tracking-[-0.018em] text-ivory">
                You already have the skill.
              </h2>
              <p
                className="mt-4 font-serif italic text-brass text-[26px] md:text-[32px] leading-[1.2]"
                style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
              >
                Now it's time to build the business.
              </p>
              <p className="mt-7 text-[16px] md:text-[17px] leading-[1.7] text-ivory/75 max-w-[560px] mx-auto">
                Join Founders Foundation and spend the next four weeks building
                something you're proud to put your name on.
              </p>
              <div className="mt-9">
                <CheckoutButton
                  source={source}
                  label="Join Founders Foundation"
                  accent
                />
                <div className="mt-5 inline-flex items-baseline gap-3">
                  <span className="text-[12px] font-semibold tracking-[0.22em] uppercase text-ivory/55">
                    Investment
                  </span>
                  <span className="font-serif text-[22px] text-ivory/55 line-through tabular-nums">
                    {originalLabel}
                  </span>
                  <span className="font-serif text-[26px] text-brass tabular-nums">
                    {priceLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const LEAVE_WITH = [
  "A clear offer you can confidently explain",
  "Pricing that makes sense for your market",
  "A professional business foundation",
  "A customer acquisition plan",
  "A 90-day roadmap for growth",
  "A community of founders building alongside you",
];

const NUM = ["One", "Two", "Three", "Four"];

const FOUNDATIONS: {
  title: string;
  lead: string;
  body?: string;
  list?: string[];
}[] = [
  {
    title: "Clarity",
    lead: "Know exactly what you sell, who it's for, and why someone should choose you.",
    body: "By the end of week one, you'll be able to clearly explain your business and confidently communicate the value you provide.",
  },
  {
    title: "Structure",
    lead: "Build the foundation that makes your business legitimate.",
    list: ["Business setup", "Pricing", "Systems", "Processes"],
    body: "The pieces most people skip until they become problems.",
  },
  {
    title: "Customers",
    lead: "Learn how to generate conversations, referrals, and opportunities.",
    body: "You'll identify the people most likely to buy from you and create a practical plan for getting in front of them. No complicated funnels. No expensive ads. Just focused action.",
  },
  {
    title: "Growth",
    lead: "Build your 90-day roadmap.",
    body: "Know what to focus on. Know what to ignore. Know what actions move your business forward. Leave with a clear plan instead of more uncertainty.",
  },
];

const INCLUDED: {
  title: string;
  body?: string;
  list?: string[];
  foot?: string;
}[] = [
  {
    title: "Four Live Implementation Sessions",
    body: "Build alongside other founders in a structured environment focused on execution, feedback, and progress.",
  },
  {
    title: "Business Builder Toolkit",
    body: "Everything you'll need to build your foundation:",
    list: [
      "Templates",
      "Worksheets",
      "Business planning resources",
      "Pricing frameworks",
      "Customer acquisition exercises",
      "AI prompts",
      "Launch checklists",
    ],
  },
  {
    title: "Session Recordings",
    body: "Miss a session? Every call is recorded so you can revisit the material and continue making progress.",
  },
  {
    title: "Office Hours",
    body: "Additional opportunities to ask questions, get feedback, and work through roadblocks.",
  },
  {
    title: "Founder Community",
    body: "Build relationships with other people who are actively working on their businesses.",
    foot: "Because entrepreneurship is hard enough without doing it alone.",
  },
];

const FIT_YES = [
  "You've been paid for a skill, service, or expertise.",
  "You have a business idea you're serious about pursuing.",
  "You're ready to stop treating your side hustle like a hobby.",
  "You want structure, accountability, and direction.",
  "You can commit 4-6 hours per week for four weeks.",
];

const FIT_NO = [
  "People looking for overnight success.",
  "People unwilling to take action.",
  "People who want to passively watch videos.",
  "Established businesses already operating at an advanced level.",
];

const AFTER_GRADUATION = [
  "Founders Foundation Certificate of Completion",
  "Alumni Network Access",
  "Invitation to join Early Founders Collective",
];

function FitColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "yes" | "no";
}) {
  return (
    <div>
      <p
        className={`text-[11px] font-semibold tracking-[0.26em] uppercase mb-4 ${tone === "yes" ? "text-brass" : "text-mute"}`}
      >
        {tone === "yes" ? "Good fit" : "Not a fit"}
      </p>
      <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.15] text-forest mb-7">
        {title}
      </h3>
      <ul className="space-y-3.5">
        {items.map((it) => (
          <li
            key={it}
            className="grid grid-cols-[auto_1fr] gap-3 items-start text-[15.5px] leading-[1.55] text-ink/72"
          >
            <span
              className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone === "yes" ? "bg-forest text-ivory" : "bg-bone border border-line text-ink/40"}`}
            >
              {tone === "yes" ? (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6.5L4.5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3L9 9M9 3L3 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
