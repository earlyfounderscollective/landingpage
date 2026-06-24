import type { Metadata } from "next";
import Link from "next/link";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import { KitCheckoutForm } from "@/components/funnel/KitCheckoutForm";
import { VideoReviews } from "@/components/site/VideoReviews";
import {
  OfferClarityMockup,
  BusinessSetupMockup,
  PricingMockup,
  AIPromptsMockup,
  PlaybookMockup,
  LeadTrackerMockup,
} from "@/components/funnel/KitMockups";
import { FAQAccordion } from "@/components/funnel/FAQAccordion";
import { GuaranteeBadge } from "@/components/funnel/GuaranteeBadge";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyKitRegistrantToken } from "@/lib/signing";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { MobileStickyCTA } from "@/components/funnel/MobileStickyCTA";
import { SITE_VIDEOS } from "@/lib/site-videos";

export const metadata: Metadata = {
  title:
    "Build Your Business Kit — Set up the business in a weekend · Early Founders Collective",
  description:
    "Six tools. One weekend. Set up the business side of your side hustle. $47 for training registrants.",
};

export const dynamic = "force-dynamic";

const FULL_PRICE_CENTS = 9700;
const REGISTRANT_PRICE_CENTS = 4700;
const BUMP_PRICE_CENTS = 1700;

async function isTrainingRegistrant(email: string): Promise<boolean> {
  if (!email) return false;
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { data } = await supabase
    .from("training_registrations")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}


const MODULES = [
  {
    n: "01",
    title: "Offer Clarity Worksheet",
    tag: "Lock what you sell.",
    body:
      "Turn what you do into a one-sentence offer somebody will pay for. The questions walk you through customer, outcome, price, and the exact words to use when someone asks.",
    bullets: [
      "Six guided questions that compound into a single offer line",
      "Worked examples from Paint HTX, Phēnyx, and SoleTies",
      "Pressure-test prompts so you know it's ready before you say it out loud",
    ],
    Visual: OfferClarityMockup,
  },
  {
    n: "02",
    title: "Business Setup Checklist",
    tag: "Get the legal + financial spine right.",
    body:
      "LLC vs sole prop, EIN, business bank, bookkeeping, insurance, contracts. Plain English. The order you actually need to do them in.",
    bullets: [
      "Entity decision tool — 4 questions to LLC vs Sole Prop vs S-Corp",
      "State-by-state filing links + the literal click-by-click",
      "Banking, payment processor, and bookkeeping setup in under 90 minutes",
    ],
    Visual: BusinessSetupMockup,
  },
  {
    n: "03",
    title: "Pricing Model Template",
    tag: "Price like a business, not like a side hustler.",
    body:
      "How to price a service the way a real business does. Time inputs, market data, your unique add. The template gives you a recommended price range with reasoning.",
    bullets: [
      "Time math + your hourly floor + market comps",
      "Tier templates — basic, standard, premium (auto-fills three prices)",
      "Payment terms + deposit guidance + late-payment language",
    ],
    Visual: PricingMockup,
  },
  {
    n: "04",
    title: "10 AI Prompts I Actually Use",
    tag: "Stop fighting ChatGPT.",
    body:
      "The prompts I run every week — brand voice, customer research, pricing logic, objection responses, content. Drop them in ChatGPT or Claude, get usable output back the first try.",
    bullets: [
      "Voice translator — turn raw notes into your brand voice without AI tells",
      "Reverse review research — mine competitor reviews to find market gaps",
      "Objection responder — pre-written responses for the 5 most common buyer hesitations",
    ],
    Visual: AIPromptsMockup,
  },
  {
    n: "05",
    title: "First 30 Customers Playbook",
    tag: "Land your first 30 paying customers without paid ads.",
    body:
      "A 5-day execution sprint. Inventory, outreach scripts, referral asks, distribution channel selection, weekly rhythm. Templates auto-fill from your offer.",
    bullets: [
      "Day-by-day plan for the first week with specific deliverables",
      "Outreach templates customized to your business type",
      "Distribution channel matrix — service businesses, creators, coaches, product",
    ],
    Visual: PlaybookMockup,
  },
  {
    n: "06",
    title: "Lead Tracker Sheet",
    tag: "Stop losing leads in DMs and group chats.",
    body:
      "One sheet. Built to actually use. Auto-calculates pipeline value, conversion rate, and average close. Flags stale leads. Exports to Google Sheets if you want it outside the kit.",
    bullets: [
      "Real-time pipeline + conversion stats",
      "Stale-lead detection (auto-flags anything >14 days)",
      "Browser notification opt-in for follow-up reminders",
    ],
    Visual: LeadTrackerMockup,
  },
];

export default async function KitPage({
  searchParams,
}: {
  searchParams: { email?: string; t?: string };
}) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  // Signed token from training emails unlocks the $47 price even when the
  // DB lookup misses (e.g. case mismatch on the email row). DB lookup is
  // still the source of truth — token is the secondary path.
  const tokenOk = Boolean(
    email && searchParams.t && verifyKitRegistrantToken(email, searchParams.t),
  );
  const isRegistrant = tokenOk || (await isTrainingRegistrant(email));

  const priceCents = isRegistrant ? REGISTRANT_PRICE_CENTS : FULL_PRICE_CENTS;

  return (
    <>
      <FunnelHeader tone="light" />
      <main>
        {/* HERO — DARK */}
        <section className="relative bg-forest text-ivory overflow-hidden">
          <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[160px] pb-12 md:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 md:gap-14 items-center max-w-[1100px] mx-auto">
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass">
                  Digital kit · Yours forever
                </p>

                <h1 className="mt-6 sm:mt-7 font-serif text-ivory">
                  <span className="block text-[34px] sm:text-[46px] md:text-[54px] lg:text-[60px] leading-[1.04] tracking-[-0.022em]">
                    Build Your Business Kit
                  </span>
                  <span className="block hand text-[36px] sm:text-[44px] md:text-[52px] leading-[0.95] text-brass mt-4 -rotate-[2deg]">
                    set up the business in a weekend.
                  </span>
                </h1>

                <p className="mt-7 max-w-[480px] mx-auto lg:mx-0 text-[15px] sm:text-[16px] leading-[1.6] text-ivory/72">
                  Six tools — worksheets, templates, AI prompts, the playbook. The exact structure I use across every business I've built.
                </p>

                <div className="mt-9 flex flex-col items-center lg:items-start gap-2.5">
                  {isRegistrant && (
                    <p className="text-[12px] uppercase tracking-[0.22em] text-ivory/60">
                      <span className="line-through decoration-[1.5px] decoration-ivory/40 mr-2">$97</span>
                      <span className="text-brass font-semibold">Your registrant price</span>
                    </p>
                  )}
                  <p className="font-serif text-[52px] md:text-[64px] leading-none text-ivory tracking-[-0.018em]">
                    ${priceCents / 100}
                  </p>
                  <p className="text-[12px] uppercase tracking-[0.2em] text-ivory/55">
                    One-time. Instant access.
                  </p>
                </div>

                <div id="buy" className="mt-8 scroll-mt-24">
                  <KitCheckoutForm
                    prefillEmail={email}
                    priceCents={priceCents}
                    bumpPriceCents={BUMP_PRICE_CENTS}
                    isRegistrant={isRegistrant}
                    registrantToken={searchParams.t}
                  />
                </div>
              </div>

              {/* HERO VISUAL — VSL (top of hero on mobile, right column on desktop) */}
              <div className="order-1 lg:order-2">
                <VSLEmbed url={SITE_VIDEOS.kitMain} />
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE — INTRO */}
        <section className="bg-ivory pt-16 md:pt-24 pb-4">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                What's actually inside
              </p>
              <h2 className="mt-5 font-serif text-[32px] md:text-[44px] leading-[1.06] tracking-[-0.02em] text-forest">
                The six tools.
              </h2>
              <p className="mt-6 text-[15.5px] md:text-[16.5px] leading-[1.65] text-ink/72">
                Each one solves a specific bottleneck. Walk through them in order. The structure is the same one I use across every business I build.
              </p>
            </div>
          </div>
        </section>

        {/* MODULES — ALTERNATING ROWS */}
        <section className="bg-ivory py-12 md:py-16">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto space-y-20 md:space-y-28">
              {MODULES.map((m, i) => {
                const Visual = m.Visual;
                const reverse = i % 2 === 1;
                return (
                  <div
                    key={m.n}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
                  >
                    <div className="max-w-[420px] mx-auto md:mx-0">
                      <Visual />
                    </div>
                    <div>
                      <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
                        Module {m.n}
                      </p>
                      <h3 className="mt-3 font-serif text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.018em] text-forest">
                        {m.title}
                      </h3>
                      <p className="mt-2 font-serif italic text-[16px] md:text-[18px] text-brass">
                        {m.tag}
                      </p>
                      <p className="mt-5 text-[15.5px] md:text-[16px] leading-[1.65] text-ink/72">
                        {m.body}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {m.bullets.map((b) => (
                          <li key={b} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                            <Check />
                            <span className="text-[15px] leading-[1.55] text-ink/80">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MID-CTA */}
        <section className="bg-forest text-ivory py-12 md:py-14">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
                Add it to my weekend
              </p>
              <p className="mt-4 font-serif text-[22px] md:text-[28px] leading-[1.25] text-ivory">
                Six tools. Yours forever. ${priceCents / 100}.
              </p>
              <div className="mt-7">
                <KitCheckoutForm
                  prefillEmail={email}
                  priceCents={priceCents}
                  bumpPriceCents={BUMP_PRICE_CENTS}
                  isRegistrant={isRegistrant}
                    registrantToken={searchParams.t}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROOF — VIDEO REVIEWS */}
        <section className="bg-ivory pt-16 md:pt-20 pb-2">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto text-center">
              <div className="flex items-center justify-center gap-1.5 mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-brass"
                    aria-hidden
                  >
                    <path d="M10 1.5L12.36 7.04L18.39 7.56L13.83 11.43L15.18 17.32L10 14.14L4.82 17.32L6.17 11.43L1.61 7.56L7.64 7.04L10 1.5Z" />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-forest">
                Multiple 5-Star Reviews
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.018em] text-forest">
                What founders Oge has worked with are saying.
              </h2>
            </div>
          </div>
        </section>
        <VideoReviews showHeading={false} />

        {/* WHO IT'S FOR / NOT FOR */}
        <section className="bg-bone py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[960px] mx-auto">
              <div className="text-center mb-12 md:mb-14">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
                  Honest check
                </p>
                <h2 className="mt-5 font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.018em] text-forest">
                  Who this kit is for.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line/60 border border-line/60 rounded-card overflow-hidden">
                <div className="bg-ivory p-7 md:p-9">
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-forest mb-5">
                    This is for you if…
                  </p>
                  <ul className="space-y-4">
                    {[
                      "You've been paid for what you're good at at least a few times",
                      "You want to stop treating it like a hobby",
                      "You're not ready to quit your day job — and that's fine",
                      "You'd rather have the structure than figure it out alone",
                      "You want it set up in a weekend, not in 6 months",
                    ].map((line) => (
                      <li key={line} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                        <Check />
                        <span className="text-[15px] md:text-[15.5px] leading-[1.55] text-ink/80">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-forest text-ivory p-7 md:p-9">
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-5">
                    This probably isn't if…
                  </p>
                  <ul className="space-y-4">
                    {[
                      "You haven't picked the thing yet",
                      "You want someone to do the work for you (we have DFY for that)",
                      "You want hand-holding (the Bootcamp covers that)",
                      "You're looking for a get-rich-quick shortcut",
                    ].map((line) => (
                      <li key={line} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                        <Cross />
                        <span className="text-[15px] md:text-[15.5px] leading-[1.55] text-ivory/80">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="bg-ivory py-14 md:py-16">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                  <GuaranteeBadge />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                    The guarantee
                  </p>
                  <p className="mt-4 font-serif italic text-[19px] md:text-[22px] leading-[1.5] text-forest">
                    "Walk through the kit. If it doesn't give you a clear next step on your business inside 14 days, email us for a refund. We don't argue."
                  </p>
                  <p className="mt-4 font-serif italic text-[15px] text-mute">— Oge</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE STACK */}
        <section className="bg-bone py-14 md:py-20">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto">
              <div className="text-center mb-10 md:mb-12">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
                  What you get
                </p>
                <h2 className="mt-5 font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.018em] text-forest">
                  Everything in one checkout.
                </h2>
              </div>

              <div className="bg-ivory border border-line/60 rounded-2xl p-6 md:p-8 shadow-[0_24px_60px_-30px_rgba(35,53,45,0.25)]">
                <ul className="divide-y divide-line/60">
                  {MODULES.map((m) => (
                    <li
                      key={m.n}
                      className="py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4"
                    >
                      <span className="font-serif text-[18px] text-brass tabular-nums leading-none">
                        {m.n}
                      </span>
                      <div>
                        <p className="font-serif text-[15.5px] md:text-[16.5px] text-forest leading-[1.25]">
                          {m.title}
                        </p>
                        <p className="text-[12.5px] text-mute mt-0.5 italic">{m.tag}</p>
                      </div>
                      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brass">
                        Included
                      </span>
                    </li>
                  ))}
                  <li className="py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <span className="font-serif text-[18px] text-brass tabular-nums leading-none">+</span>
                    <div>
                      <p className="font-serif text-[15.5px] md:text-[16.5px] text-forest leading-[1.25]">
                        Future updates · forever
                      </p>
                      <p className="text-[12.5px] text-mute mt-0.5 italic">
                        Anything I add to the kit shows up in your access at no extra cost.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brass">
                      Included
                    </span>
                  </li>
                  <li className="py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <span className="font-serif text-[18px] text-brass tabular-nums leading-none">★</span>
                    <div>
                      <p className="font-serif text-[15.5px] md:text-[16.5px] text-forest leading-[1.25]">
                        Premium Sales & Systems Checklist
                      </p>
                      <p className="text-[12.5px] text-mute mt-0.5 italic">
                        Scripts, objection library, negotiation templates. Optional add-on at checkout.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-forest">
                      +$17
                    </span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-line/60 flex items-end justify-between">
                  <p className="text-[12px] uppercase tracking-[0.22em] text-mute font-semibold">
                    Your price today
                  </p>
                  <p className="font-serif text-[36px] md:text-[44px] leading-none text-forest tracking-[-0.018em]">
                    ${priceCents / 100}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[720px] mx-auto">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass text-center">
                Frequently asked questions
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.018em] text-forest text-center mb-10">
                Click any to expand.
              </h2>
              <FAQAccordion
                items={[
                  {
                    q: "I haven't started yet. Is this for me?",
                    a: "Yes. Half of the kit is structured for people who have an idea but haven't done anything yet. The other half kicks in once you have a few customers.",
                  },
                  {
                    q: "Do I need to know anything technical?",
                    a: "No. Everything's in plain English. The tools are spreadsheets and Notion-style docs, not code.",
                  },
                  {
                    q: "How long until I get access?",
                    a: "Immediately. The login link is sent at checkout. Check your inbox within a couple minutes (spam if not).",
                  },
                  {
                    q: "Is there ongoing support?",
                    a: "No, the kit is self-paced. If you want ongoing support, the 4-week Bootcamp is the next step up. Most people start with the kit first.",
                  },
                  {
                    q: "Why is the registrant price lower?",
                    a: "If you showed up for the free training, you've already done the work to be in the room. The discount is the thank-you.",
                  },
                  {
                    q: "What's the refund policy?",
                    a: "14 days, no questions. Walk through the kit, decide if it gave you a clear next step, email us if not.",
                  },
                  {
                    q: "Do I get future updates?",
                    a: "Yes. Anything new I add to the kit shows up in your access for free, forever. No re-buying.",
                  },
                  {
                    q: "What if I bought the training VIP?",
                    a: "You already have lifetime training access. The kit is a separate purchase — it covers the implementation side, not the strategy walkthrough.",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                Get Build Your Business Kit
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ivory">
                Start the weekend with one. Finish it with a real business.
              </h2>
              <p className="mt-7 font-serif text-[48px] md:text-[60px] leading-none text-ivory">
                ${priceCents / 100}
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-ivory/55">
                One-time
              </p>

              <div className="mt-8">
                <KitCheckoutForm
                  prefillEmail={email}
                  priceCents={priceCents}
                  bumpPriceCents={BUMP_PRICE_CENTS}
                  isRegistrant={isRegistrant}
                    registrantToken={searchParams.t}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
      <MobileStickyCTA
        href="#buy"
        label={`Get the Kit — $${priceCents / 100}`}
        sub={isRegistrant ? "Your registrant price" : undefined}
      />
    </>
  );
}

function Check() {
  return (
    <span className="mt-[5px] inline-flex h-[20px] w-[20px] items-center justify-center rounded-full bg-brass/15 text-brass shrink-0">
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

function Cross() {
  return (
    <span className="mt-[5px] inline-flex h-[20px] w-[20px] items-center justify-center rounded-full bg-ivory/15 text-ivory/70 shrink-0">
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
