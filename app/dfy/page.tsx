import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";

export const metadata: Metadata = {
  title: "Done-For-You · Early Founders Collective",
  description:
    "Work with Early Founders Collective for six weeks to build your business — offer, pricing, entity, first 30 customers, side-by-side.",
};

// Drop a video URL here once recorded — YouTube / Vimeo / Loom / MP4 all work.
const DFY_VIDEO_URL: string | null = null;

export default function DFYPage() {
  return (
    <>
      <Header tone="dark" />
      <main>
        {/* HERO */}
        <section className="bg-forest text-ivory pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
          <div className="container-page relative">
            <div className="max-w-[820px] mx-auto text-center">
              <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.26em] uppercase text-brass mb-7">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                Done-For-You · By application
              </p>
              <h1 className="font-serif text-[40px] sm:text-[52px] md:text-[64px] leading-[1.02] tracking-[-0.02em] text-ivory">
                Some founders shouldn't be doing this alone.
              </h1>
              <p
                className="mt-6 font-handwritten text-brass text-[26px] md:text-[30px] leading-[1.2] -rotate-1"
                style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
              >
                if that's you, this is for you.
              </p>
              <p className="mt-7 max-w-[620px] mx-auto text-[16.5px] md:text-[18px] leading-[1.65] text-ivory/75">
                Six weeks of working side-by-side. We rebuild your offer with
                you, fix your pricing, hand you the operating systems, and walk
                you through your first 30 customers. By the end you have a
                business — not a side hustle pretending.
              </p>

              <div className="mt-12">
                <VSLEmbed url={DFY_VIDEO_URL} />
              </div>

              <div className="mt-10">
                <Link
                  href="/dfy/apply"
                  className="inline-flex items-center justify-center bg-brass text-ivory px-8 py-4 rounded-full text-[13.5px] font-semibold tracking-[0.06em] uppercase hover:bg-[#8a6c3f] transition-colors shadow-[0_22px_50px_-18px_rgba(155,122,74,0.65)]"
                >
                  Apply to work with us →
                </Link>
              </div>
              <p className="mt-5 text-[12.5px] text-ivory/55 tracking-[0.1em] uppercase">
                Limited to 4 founders per cohort
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
                The kit works. So does the training. But some people don't need more material.
              </h2>
              <p className="mt-7 text-[16.5px] leading-[1.7] text-ink/72">
                They need someone in the room. Telling them what to charge.
                Telling them which offer to kill. Sending the cold DM with them
                so they actually send it. That's what this is.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT'S IN IT */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto">
              <div className="text-center mb-14">
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                  The six weeks
                </p>
                <h2 className="font-serif text-[34px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Here's exactly what we do.
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
                      You leave with
                    </p>
                    <ul className="space-y-1.5">
                      {w.deliverables.map((d) => (
                        <li
                          key={d}
                          className="grid grid-cols-[auto_1fr] gap-2 text-[13.5px] text-ink/75 leading-[1.5] items-start"
                        >
                          <span
                            className="mt-[8px] h-1 w-1 rounded-full bg-brass"
                            aria-hidden
                          />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[920px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                  Pricing
                </p>
                <h2 className="font-serif text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.018em] text-forest">
                  Two ways in.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <PricingCard
                  tier="Done-With-You"
                  desc="You do the work. We review every week, push you forward, unstick the things that stall."
                  price="$2,997"
                  perks={[
                    "6 weekly 1-on-1 Zoom calls (60 min)",
                    "Weekly written feedback on your kit work",
                    "Voice memo Q&A between calls",
                    "Private text thread with the team",
                  ]}
                  cta="Apply for DWY →"
                  href="/dfy/apply?tier=dwy"
                />
                <PricingCard
                  tier="Done-For-You"
                  desc="We do the work. You answer questions, own decisions, and review what we built before it ships."
                  price="$10,000"
                  perks={[
                    "Everything in DWY plus —",
                    "We write your offer + sales page",
                    "We set up entity + payments + tracking",
                    "We send the first batch of outreach with you",
                    "First 10 customers landed before week 6",
                  ]}
                  highlight
                  cta="Apply for DFY →"
                  href="/dfy/apply?tier=dfy"
                />
              </div>

              <p className="mt-10 text-center text-[13.5px] text-mute leading-[1.6] max-w-[560px] mx-auto">
                Paid in two installments — half before week one, half before
                week four. If after week one you don't think this is for you,
                we refund the first payment in full. No friction.
              </p>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR / NOT FOR */}
        <section className="bg-bone py-20 md:py-24 grain">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <Fit
                title="This is for you if…"
                items={FIT_YES}
                tone="yes"
              />
              <Fit
                title="This isn't for you if…"
                items={FIT_NO}
                tone="no"
              />
            </div>
          </div>
        </section>

        {/* HOST */}
        <section className="bg-ivory py-20 md:py-24">
          <div className="container-page">
            <div className="max-w-[820px] mx-auto text-center">
              <div className="inline-block mb-8">
                <Image
                  src="/founder-portrait.jpg"
                  alt="Oge Madu"
                  width={140}
                  height={140}
                  className="rounded-full border-2 border-brass shadow-[0_18px_40px_-16px_rgba(35,53,45,0.35)]"
                />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Who you're working with
              </p>
              <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.2] tracking-[-0.012em] text-forest">
                Led by Oge Madu. Backed by Early Founders Collective.
              </h3>
              <p className="mt-6 text-[16.5px] leading-[1.7] text-ink/72">
                We've helped founders launch repainting companies, photography
                studios, supplement brands, hair care lines, and event services
                — most of them while working another job. The pattern is the
                same every time: the people who win pick one offer, charge what
                it's worth, and talk to ten people a day. We'll help you do
                that.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-24 md:py-28">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto text-center">
              <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.018em] text-ivory">
                Want to talk?
              </h2>
              <p className="mt-6 text-[16.5px] leading-[1.7] text-ivory/75">
                The application takes 4 minutes. We read every one. If it's a
                fit, we'll email you to set up a 15-minute call.
              </p>
              <Link
                href="/dfy/apply"
                className="mt-8 inline-flex items-center justify-center bg-brass text-ivory px-8 py-4 rounded-full text-[13.5px] font-semibold tracking-[0.06em] uppercase hover:bg-[#8a6c3f] transition-colors shadow-[0_22px_50px_-18px_rgba(155,122,74,0.65)]"
              >
                Start my application →
              </Link>
              <p className="mt-5 text-[12.5px] text-ivory/55 tracking-[0.1em] uppercase">
                Currently accepting applications
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
    label: "Diagnosis",
    title: "Pin down what's actually broken.",
    desc: "Most early founders think the problem is marketing or pricing. It's almost always something else. Week one is finding the real root.",
    deliverables: [
      "Honest read on your business",
      "One thing to fix this week",
    ],
  },
  {
    n: "Week 2",
    label: "Offer",
    title: "Rebuild the offer.",
    desc: "We rewrite what you sell, who it's for, and the result. By end of week, you can say it in one sentence and defend it.",
    deliverables: [
      "Your one-sentence offer",
      "Three competitor gap analyses",
    ],
  },
  {
    n: "Week 3",
    label: "Pricing & operations",
    title: "Lock the price + the systems.",
    desc: "Entity, banking, payments, tracking. The boring stuff that makes the business real. Plus a price you can defend.",
    deliverables: [
      "Final pricing defended in writing",
      "Entity + payments wired",
      "Bookkeeping system in place",
    ],
  },
  {
    n: "Week 4",
    label: "Sales mechanism",
    title: "Build the way customers find you.",
    desc: "One channel, one cadence, one tracker. We pick what fits you — not the influencer playbook.",
    deliverables: [
      "Picked distribution channel + cadence",
      "Outreach scripts in your voice",
      "First batch of 20 outreach sent",
    ],
  },
  {
    n: "Week 5",
    label: "Pipeline",
    title: "Move the first 10 conversations forward.",
    desc: "You'll have leads by now. This week we work each one — proposals, follow-ups, objection handling.",
    deliverables: [
      "10 active conversations in your tracker",
      "Templated proposal + follow-up",
    ],
  },
  {
    n: "Week 6",
    label: "Lock-in",
    title: "Make it repeatable without me.",
    desc: "The 90-day operating doc you'll run on after the engagement ends. Plus what we keep, what we kill.",
    deliverables: [
      "90-day operating doc",
      "One number to chase for next quarter",
    ],
  },
];

const FIT_YES = [
  "You've already started — you have at least one customer or 6 months of building",
  "You'd rather get told the answer than figure it out alone",
  "You can put 4-6 hours a week into this for six weeks",
  "You're willing to do the unsexy work (entity filing, pricing math, cold outreach)",
];

const FIT_NO = [
  "You haven't picked an idea yet (do the kit first)",
  "You want validation more than feedback",
  "You're already at $20K+ monthly — you need an operator, not me",
  "You hate Zoom and can't make weekly calls work",
];

function PricingCard({
  tier,
  desc,
  price,
  perks,
  cta,
  href,
  highlight,
}: {
  tier: string;
  desc: string;
  price: string;
  perks: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl p-7 md:p-9 border-2 ${
        highlight
          ? "bg-forest text-ivory border-brass shadow-[0_30px_70px_-30px_rgba(35,53,45,0.55)]"
          : "bg-bone text-forest border-line/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <p
          className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase ${highlight ? "text-brass" : "text-brass"}`}
        >
          {tier}
        </p>
        {highlight && (
          <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase bg-brass text-ivory px-2 py-1 rounded-full">
            Most chosen
          </span>
        )}
      </div>
      <p
        className={`text-[15px] leading-[1.55] mb-6 ${highlight ? "text-ivory/80" : "text-ink/72"}`}
      >
        {desc}
      </p>
      <p
        className={`font-serif text-[44px] md:text-[52px] leading-none tracking-[-0.018em] mb-7 ${highlight ? "text-ivory" : "text-forest"}`}
      >
        {price}
      </p>
      <ul className="space-y-2.5 mb-8">
        {perks.map((p) => (
          <li
            key={p}
            className="grid grid-cols-[auto_1fr] gap-2.5 items-start text-[14.5px] leading-[1.5]"
          >
            <span
              className={`mt-[8px] h-1.5 w-1.5 rounded-full ${highlight ? "bg-brass" : "bg-brass"}`}
            />
            <span className={highlight ? "text-ivory/85" : "text-ink/72"}>
              {p}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block text-center rounded-full px-6 py-3.5 text-[13px] font-semibold tracking-[0.05em] uppercase transition-colors ${
          highlight
            ? "bg-brass text-ivory hover:bg-[#8a6c3f]"
            : "bg-forest text-ivory hover:bg-ink"
        }`}
      >
        {cta}
      </Link>
    </article>
  );
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
