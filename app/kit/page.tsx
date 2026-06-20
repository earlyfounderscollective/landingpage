import type { Metadata } from "next";
import Link from "next/link";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import { KitCheckoutForm } from "@/components/funnel/KitCheckoutForm";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title:
    "Build Your Business Kit — Set up the business in a weekend · Early Founders Collective",
  description:
    "Everything you need to set up the business side of your side hustle. Worksheets, templates, AI prompts. $47 for training registrants.",
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

export default async function KitPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  const isRegistrant = await isTrainingRegistrant(email);

  const priceCents = isRegistrant ? REGISTRANT_PRICE_CENTS : FULL_PRICE_CENTS;
  const showAnchor = isRegistrant;

  return (
    <>
      <FunnelHeader tone="light" />
      <main>
        {/* HERO — FOREST */}
        <section className="relative bg-forest text-ivory overflow-hidden">
          <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[160px] pb-12 md:pb-16">
            <div className="max-w-[760px] mx-auto text-center">
              <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass">
                One-time digital kit
              </p>

              <h1 className="mt-6 sm:mt-7 font-serif text-ivory">
                <span className="block text-[34px] sm:text-[46px] md:text-[58px] lg:text-[64px] leading-[1.04] tracking-[-0.022em]">
                  Build Your Business Kit
                </span>
                <span className="block hand text-[38px] sm:text-[48px] md:text-[56px] leading-[0.95] text-brass mt-4 -rotate-[2deg]">
                  set up the business in a weekend.
                </span>
              </h1>

              <p className="mt-7 max-w-[520px] mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-ivory/72">
                The worksheets, templates, and AI prompts I use across every business I've built. Yours to keep, forever.
              </p>

              <div className="mt-10 flex flex-col items-center gap-2.5">
                {showAnchor && (
                  <p className="text-[12.5px] uppercase tracking-[0.22em] text-ivory/60">
                    <span className="line-through decoration-[1.5px] decoration-ivory/40 mr-2">$97</span>
                    <span className="text-brass font-semibold">Your registrant price</span>
                  </p>
                )}
                <p className="font-serif text-[56px] md:text-[68px] leading-none text-ivory tracking-[-0.018em]">
                  ${priceCents / 100}
                </p>
                <p className="text-[12px] uppercase tracking-[0.2em] text-ivory/55">
                  One-time. Instant access.
                </p>
              </div>

              <div className="mt-9">
                <KitCheckoutForm
                  prefillEmail={email}
                  priceCents={priceCents}
                  bumpPriceCents={BUMP_PRICE_CENTS}
                  isRegistrant={isRegistrant}
                />
              </div>

              {!isRegistrant && (
                <p className="mt-7 max-w-[480px] mx-auto text-[13px] text-ivory/60 leading-[1.55]">
                  Registered for the free training?{" "}
                  <Link
                    href="/training"
                    className="text-brass underline underline-offset-4 hover:text-ivory"
                  >
                    Open this page from the email link
                  </Link>{" "}
                  to unlock the $47 registrant price.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* WHAT'S IN IT */}
        <section className="bg-ivory py-16 md:py-24">
          <div className="container-page">
            <div className="max-w-[680px] mx-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass text-center">
                What's in it
              </p>
              <h2 className="mt-5 font-serif text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.018em] text-forest text-center">
                Six tools. One weekend. Done.
              </h2>

              <ul className="mt-12 space-y-9 md:space-y-10">
                {[
                  {
                    n: "01",
                    title: "Offer Clarity Worksheet",
                    body: "The questions that turn what you do into a one-sentence offer somebody will pay for. Walk through it once and you'll never describe your business the same way again.",
                  },
                  {
                    n: "02",
                    title: "Business Setup Checklist",
                    body: "LLC vs sole prop, EIN, business bank, bookkeeping, insurance. Plain English. The order you actually need to do them in.",
                  },
                  {
                    n: "03",
                    title: "Pricing Model Template",
                    body: "How to price a service the way a real business does, not a side hustler hoping they don't undercharge. Time inputs, market data, the recommended range.",
                  },
                  {
                    n: "04",
                    title: "10 AI Prompts I Actually Use",
                    body: "Brand voice translator. Customer research. Pricing logic. Objection responses. The prompts that turn ChatGPT or Claude from a toy into a real tool.",
                  },
                  {
                    n: "05",
                    title: "The First 30 Customers Playbook",
                    body: "Exactly how to land the first 30 paying customers without paid ads, cold pitching, or a website nobody visits. Day-by-day for the first week.",
                  },
                  {
                    n: "06",
                    title: "Lead Tracker Spreadsheet",
                    body: "Stop losing leads in DMs and group chats. One sheet. Built to actually use. Auto-calculates pipeline value and conversion rate.",
                  },
                ].map((item) => (
                  <li key={item.n} className="grid grid-cols-[auto_1fr] gap-5">
                    <span className="font-serif text-[28px] md:text-[32px] text-brass tracking-[-0.02em] leading-none pt-1">
                      {item.n}
                    </span>
                    <div>
                      <p className="font-serif text-[20px] md:text-[22px] leading-[1.25] text-forest">
                        {item.title}
                      </p>
                      <p className="mt-2 text-[15px] md:text-[15.5px] leading-[1.6] text-ink/72">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="bg-bone py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[620px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                Who it's for
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.018em] text-forest">
                You already do the thing.
              </h2>
              <div className="mt-6 space-y-4 text-[15.5px] md:text-[16px] leading-[1.7] text-ink/72">
                <p>
                  You've been paid for it a few times. You want to stop treating it like a hobby and start running it like a business — without quitting your job before it's ready to support you.
                </p>
                <p>That's what this kit is for.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="bg-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                The guarantee
              </p>
              <p className="mt-6 font-serif italic text-[20px] md:text-[22px] leading-[1.5] text-forest">
                "Walk through the kit. If it doesn't give you a clear next step on your business inside 14 days, email us for a refund. We don't argue."
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-bone py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass text-center">
                Common questions
              </p>

              <ul className="mt-10 space-y-8">
                {[
                  {
                    q: "I haven't started yet. Is this for me?",
                    a: "Yes. Half of the kit is structured for people who have an idea but haven't done anything yet. The other half is for people who have a few customers already.",
                  },
                  {
                    q: "Do I need to know anything technical?",
                    a: "No. Everything's in plain English. The tools are spreadsheets and Notion docs, not code.",
                  },
                  {
                    q: "How long until I get access?",
                    a: "Immediately. The login link is sent at checkout.",
                  },
                  {
                    q: "Is there ongoing support?",
                    a: "No, the kit is self-paced. If you want ongoing support, the 4-week Bootcamp is the next step up — but most people start here first.",
                  },
                  {
                    q: "Why is the registrant price lower?",
                    a: "If you showed up for the free training, you've already done the work to be in the room. The discount is the thank-you.",
                  },
                ].map((item) => (
                  <li key={item.q}>
                    <p className="font-serif text-[18px] md:text-[19px] leading-[1.3] text-forest">
                      {item.q}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.65] text-ink/72">
                      {item.a}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-16 md:py-20">
          <div className="container-page">
            <div className="max-w-[540px] mx-auto text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brass">
                Get Build Your Business Kit
              </p>
              <h2 className="mt-5 font-serif text-[28px] md:text-[36px] leading-[1.15] tracking-[-0.018em] text-ivory">
                Start the weekend with one. Finish it with a real business.
              </h2>
              <p className="mt-5 font-serif text-[44px] md:text-[52px] leading-none text-ivory">
                ${priceCents / 100}
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.2em] text-ivory/55">
                One-time
              </p>

              <div className="mt-8">
                <KitCheckoutForm
                  prefillEmail={email}
                  priceCents={priceCents}
                  bumpPriceCents={BUMP_PRICE_CENTS}
                  isRegistrant={isRegistrant}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FunnelFooter />
    </>
  );
}
