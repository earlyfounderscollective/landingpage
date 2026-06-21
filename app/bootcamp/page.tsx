import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FAQAccordion } from "@/components/funnel/FAQAccordion";
import { GuaranteeBadge } from "@/components/funnel/GuaranteeBadge";
import { BOOTCAMP } from "@/lib/bootcamp";
import { CheckoutButton } from "./CheckoutButton";

export const metadata: Metadata = {
  title: "The Bootcamp · Early Founders Collective",
  description:
    "Four weeks. Group cohort. We get you from idea to first paying customers — together. $497.",
};

export default function BootcampPage({
  searchParams,
}: {
  searchParams: { source?: string };
}) {
  const source = searchParams.source ?? "direct";
  const priceLabel = `$${(BOOTCAMP.priceCents / 100).toLocaleString()}`;

  return (
    <>
      <Header tone="dark" />
      <main>
        {/* HERO */}
        <section className="bg-forest text-ivory pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
          <div className="container-page relative">
            <div className="max-w-[860px] mx-auto text-center">
              <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.26em] uppercase text-brass mb-7">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                The Bootcamp · 4 weeks · {priceLabel}
              </p>
              <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[68px] leading-[1.02] tracking-[-0.02em] text-ivory">
                Four weeks. To a real business.
              </h1>
              <p
                className="mt-6 font-handwritten text-brass text-[28px] md:text-[32px] leading-[1.2] -rotate-1"
                style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
              >
                with the people building one too.
              </p>
              <p className="mt-7 max-w-[620px] mx-auto text-[16.5px] md:text-[18px] leading-[1.65] text-ivory/75">
                Twelve people. Four weekly group sessions. The kit, the
                accountability, and a Slack channel that doesn't go quiet
                between calls. By the end you have an offer, a price, a way to
                get customers — and a small room of founders who'll watch you
                build for the next year.
              </p>
              <div className="mt-10">
                <CheckoutButton
                  source={source}
                  label={`Reserve my seat — ${priceLabel}`}
                />
              </div>
              <p className="mt-5 text-[12.5px] text-ivory/55 tracking-[0.1em] uppercase">
                {BOOTCAMP.nextCohort.label} · Limited to 12 founders
              </p>
            </div>
          </div>
        </section>

        {/* WHY THIS EXISTS */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-5">
                Why this exists
              </p>
              <h2 className="font-serif text-[32px] md:text-[42px] leading-[1.1] tracking-[-0.015em] text-forest">
                You don't have a knowledge problem. You have an alone problem.
              </h2>
              <p className="mt-7 text-[16.5px] leading-[1.7] text-ink/72">
                The kit teaches the moves. The trainings show why. But four out
                of five people who buy the kit don't finish it — not because
                it's too hard but because they're doing it alone. The bootcamp
                is what fixes that.
              </p>
            </div>
          </div>
        </section>

        {/* THE 4 WEEKS */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto">
              <div className="text-center mb-14">
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                  The four weeks
                </p>
                <h2 className="font-serif text-[34px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Here's the path.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {WEEKS.map((w) => (
                  <article
                    key={w.n}
                    className="bg-ivory rounded-2xl p-7 md:p-8 border border-line/60 shadow-[0_6px_16px_-10px_rgba(35,53,45,0.08)]"
                  >
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-serif text-[14px] text-brass tracking-[0.08em]">
                        {w.n}
                      </span>
                      <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-mute">
                        {w.label}
                      </span>
                    </div>
                    <h3 className="font-serif text-[22px] md:text-[24px] leading-[1.2] text-forest mb-3">
                      {w.title}
                    </h3>
                    <p className="text-[14.5px] leading-[1.6] text-ink/72 mb-4">
                      {w.desc}
                    </p>
                    <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brass mb-2">
                      Live group call
                    </p>
                    <p className="text-[13.5px] text-ink/72 leading-[1.5]">
                      {w.call}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[920px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                  What's included
                </p>
                <h2 className="font-serif text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Everything you need for {priceLabel}.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {INCLUDED.map((item) => (
                  <div
                    key={item.title}
                    className="bg-bone rounded-2xl p-6 md:p-7 border border-line/60"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-serif text-[19px] md:text-[20px] text-forest leading-[1.25]">
                        {item.title}
                      </h3>
                      <span className="font-serif italic text-[14px] text-brass tabular-nums shrink-0">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[14px] text-ink/72 leading-[1.55]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total stack */}
              <div className="mt-10 bg-forest text-ivory rounded-2xl p-7 md:p-8 text-center">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-3">
                  Total stack value
                </p>
                <p className="font-serif text-[44px] md:text-[52px] leading-none tracking-[-0.018em] line-through text-ivory/55 mb-1.5 tabular-nums">
                  $1,991
                </p>
                <p className="text-[12px] uppercase tracking-[0.22em] text-brass mb-2">
                  Your price today
                </p>
                <p className="font-serif text-[52px] md:text-[60px] leading-none tracking-[-0.018em] text-ivory tabular-nums">
                  {priceLabel}
                </p>
                <div className="mt-7">
                  <CheckoutButton
                    source={source}
                    label="Reserve my seat →"
                    accent
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="bg-bone py-16 md:py-20 grain">
          <div className="container-page">
            <div className="max-w-[820px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
              <GuaranteeBadge />
              <div>
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-3">
                  14-day money back
                </p>
                <h2 className="font-serif text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.012em] text-forest">
                  Show up to week one. If it's not for you, we refund the whole thing.
                </h2>
                <p className="mt-4 text-[15px] text-ink/72 leading-[1.6]">
                  Come to the first session. Try the kit. See the room. If
                  you're not getting value by day 14, email us and we refund —
                  no friction, no "are you sure," nothing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR / NOT FOR */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <Fit title="This is for you if…" items={FIT_YES} tone="yes" />
              <Fit title="This isn't for you if…" items={FIT_NO} tone="no" />
            </div>
          </div>
        </section>

        {/* HOST */}
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
                  style={{ aspectRatio: "4/5", maxHeight: "520px", width: "auto" }}
                />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Who's leading the room
              </p>
              <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.2] tracking-[-0.012em] text-forest">
                You're not working alone.
              </h3>
              <p className="mt-6 text-[16.5px] leading-[1.7] text-ink/72">
                Oge Madu leads the bootcamp out of Houston. We've helped
                founders launch repainting companies, photography studios,
                supplement brands, hair care lines, and event services — most
                of them while working another job.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                  Questions
                </p>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Stuff we get asked.
                </h2>
              </div>
              <FAQAccordion items={FAQ} />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-24 md:py-28">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Last thing
              </p>
              <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.018em] text-ivory">
                Pick the seat. Show up. Build.
              </h2>
              <p className="mt-6 text-[16.5px] leading-[1.7] text-ivory/75">
                {BOOTCAMP.nextCohort.label}. Twelve founders. Four weeks. The
                rest is up to you.
              </p>
              <div className="mt-8">
                <CheckoutButton
                  source={source}
                  label={`Reserve my seat — ${priceLabel}`}
                  accent
                />
              </div>
              <p className="mt-5 text-[12.5px] text-ivory/55 tracking-[0.1em] uppercase">
                14-day money-back guarantee
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const WEEKS = [
  {
    n: "Week 1",
    label: "Offer + positioning",
    title: "Lock the one sentence.",
    desc: "Most early founders can't say what they sell in one sentence. By the end of week one you can — and so can the people in the room with you. We pressure-test it live.",
    call: "90-min group call · 12 founders, 12 offers reviewed.",
  },
  {
    n: "Week 2",
    label: "Pricing + business setup",
    title: "Price what you're worth. Get legal.",
    desc: "Hourly floor, market range, recommended start. Entity, EIN, business banking. The boring stuff that makes the business real — done in a week with help.",
    call: "90-min group call · Bring your pricing draft. Leave with a final number.",
  },
  {
    n: "Week 3",
    label: "First customers",
    title: "Talk to ten people this week.",
    desc: "Inventory who you already know. A-list outreach. Referral asks. Pick the one channel you'll commit to for the next 90 days. By Friday, ten conversations live.",
    call: "90-min group call · We send outreach together on the call.",
  },
  {
    n: "Week 4",
    label: "Pipeline + the next 90 days",
    title: "Make it repeatable without us.",
    desc: "Move the first 10 conversations forward. Templated proposals. The 90-day operating doc you'll run on after the bootcamp ends.",
    call: "90-min group call · Each founder shares their 90-day commitment.",
  },
];

const INCLUDED = [
  {
    title: "4 live group calls (90 min each)",
    desc: "Twelve founders in the room. Real offers reviewed. Real outreach drafted live. Recordings if you miss one.",
    value: "$1,200",
  },
  {
    title: "Build Your Business Kit",
    desc: "Full access to the 6 interactive modules — offer, setup, pricing, AI prompts, first 30 customers, lead tracker.",
    value: "$97",
  },
  {
    title: "Private Slack channel",
    desc: "Daily check-ins with your cohort. We're in there. The point is the room doesn't go quiet between sessions.",
    value: "$397",
  },
  {
    title: "Two office hours sessions",
    desc: "Drop-in Q&A between calls if you're stuck. No appointment, no agenda — just bring the question.",
    value: "$297",
  },
];

const FIT_YES = [
  "You've started — at least an idea you're committed to, or one customer in",
  "You can put 4-6 hours a week into this for four weeks",
  "You learn better with other people building alongside you",
  "You want to talk to actual customers by week three",
];

const FIT_NO = [
  "You haven't picked an idea yet (do the training first — it's free)",
  "You're already at $20K+ monthly (DFY's a better fit at that stage)",
  "You hate group calls and can't make weekly Zoom work",
  "You want a course you watch on your own time (the kit covers that)",
];

const FAQ = [
  {
    q: "When does the next cohort start?",
    a: `${BOOTCAMP.nextCohort.label}. Reservations close 24 hours before week one. We run a new cohort every six weeks — if you miss this one, the next reservation opens automatically.`,
  },
  {
    q: "What if I can't make a live call?",
    a: "Every call is recorded and posted in the Slack channel within 24 hours. You can ask follow-up questions in the channel — we read everything. If you're going to miss two of the four calls, the bootcamp probably isn't the right fit for this cohort.",
  },
  {
    q: "Do I keep the kit after the bootcamp ends?",
    a: "Yes. Lifetime access to all six modules — you'll keep using the lead tracker and pricing template long after the cohort wraps.",
  },
  {
    q: "Is this better than the kit alone?",
    a: "The kit is the material. The bootcamp is the accountability + the room. If you're someone who finishes things on your own, the kit might be enough. If you've ever bought a course and not opened it, the bootcamp is the difference between owning the work and doing it.",
  },
  {
    q: "Can I pay in installments?",
    a: `Right now it's $497 in full. If installments would be the difference between joining or not, email contact@earlyfounderscollective.com and we'll figure something out.`,
  },
  {
    q: "What happens if I want a refund?",
    a: "Show up to week one, try the kit, see the room. If by day 14 you don't think this is for you, email us and we refund the full amount. No phone call, no friction.",
  },
];

function CheckoutWrap({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function Fit({
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
        className={`text-[11px] font-semibold tracking-[0.24em] uppercase mb-4 ${tone === "yes" ? "text-brass" : "text-mute"}`}
      >
        {tone === "yes" ? "Good fit" : "Not a fit"}
      </p>
      <h3 className="font-serif text-[24px] md:text-[28px] leading-[1.2] text-forest mb-6">
        {title}
      </h3>
      <ul className="space-y-3.5">
        {items.map((it) => (
          <li
            key={it}
            className="grid grid-cols-[auto_1fr] gap-3 items-start text-[15px] leading-[1.55] text-ink/72"
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
