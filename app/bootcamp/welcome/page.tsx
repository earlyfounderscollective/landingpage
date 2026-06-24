import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getStripe } from "@/lib/stripe";
import { getBootcampConfig, formatCohortDate } from "@/lib/bootcamp";
import { getOrCreateReferralCode, REFERRAL } from "@/lib/referrals";
import { env } from "@/lib/env";
import { ReferralShare } from "./ReferralShare";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { SITE_VIDEOS } from "@/lib/site-videos";

export const metadata: Metadata = {
  title: "You're in · Founders Foundation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BootcampWelcomePage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = (searchParams.session_id ?? "").trim();
  const config = await getBootcampConfig();
  const cohortDate = formatCohortDate(config.cohortStartDate);

  let firstName = "";
  let buyerEmail = "";
  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const name = session.metadata?.name || session.customer_details?.name || "";
        if (name) firstName = String(name).split(/\s+/)[0];
        buyerEmail = (
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.email ||
          ""
        ).toLowerCase();
      } catch {
        /* ignore */
      }
    }
  }

  // Fetch (or backfill) this buyer's referral code.
  const referralCode = buyerEmail
    ? await getOrCreateReferralCode(buyerEmail)
    : null;
  const referralLink = referralCode
    ? `${env.siteUrl}/bootcamp?ref=${referralCode}`
    : null;

  return (
    <>
      <Header />
      <main>
        <section className="bg-ivory pt-32 md:pt-36 pb-12 md:pb-16 min-h-[60vh]">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest text-ivory mb-7">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12L10 18L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Seat reserved
              </p>
              <h1 className="font-serif text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                {firstName ? `You're in, ${firstName}.` : "You're in."}
              </h1>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink/72">
                {cohortDate ? (
                  <>
                    Founders Foundation starts <strong className="text-forest">{cohortDate}</strong>. We'll
                    email you within 24 hours with the community invite, the
                    week-one Zoom link, and a kickoff form to fill before the
                    first session.
                  </>
                ) : (
                  <>
                    Welcome to Founders Foundation. We'll email you within 24
                    hours with the community invite, the cohort start date, and
                    a kickoff form to fill before week one.
                  </>
                )}
              </p>

              <div className="mt-10 max-w-[680px] mx-auto">
                <VSLEmbed url={SITE_VIDEOS.bootcampWelcome} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bone py-12 md:py-16 grain">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto bg-ivory rounded-2xl p-7 md:p-9 border border-line/60">
              <p className="text-[10.5px] font-semibold tracking-[0.26em] uppercase text-brass mb-3">
                While you wait
              </p>
              <h2 className="font-serif text-[24px] md:text-[26px] leading-[1.25] text-forest mb-5">
                Open the Business Builder Toolkit.
              </h2>
              <p className="text-[15px] text-ink/72 leading-[1.65] mb-6">
                Your toolkit is unlocked. Pick at Module 01 (Offer Clarity) and
                Module 02 (Business Setup) before week one. You'll show up to
                the first session already moving.
              </p>
              <Link
                href="/kit/access"
                className="inline-flex items-center justify-center bg-forest text-ivory px-6 py-3 rounded-full text-[13px] font-semibold tracking-[0.04em] uppercase hover:bg-ink transition-colors"
              >
                Open my toolkit →
              </Link>
            </div>
          </div>
        </section>

        {referralCode && referralLink && (
          <section className="bg-forest text-ivory py-14 md:py-16">
            <div className="container-page">
              <div className="max-w-[640px] mx-auto">
                <div className="bg-ivory/8 border border-brass/40 rounded-2xl p-7 md:p-9 backdrop-blur-sm">
                  <p className="text-[10.5px] font-semibold tracking-[0.26em] uppercase text-brass mb-3">
                    Earn $50 per founder you refer
                  </p>
                  <h2 className="font-serif text-[26px] md:text-[30px] leading-[1.2] text-ivory mb-3">
                    Know someone who'd be a fit?
                  </h2>
                  <p className="text-[15px] leading-[1.65] text-ivory/72 mb-6">
                    Share your link. They get $100 off Founders Foundation. You
                    get $50 paid out 30 days after their cohort wraps. Unlimited
                    referrals — no cap.
                  </p>
                  <ReferralShare code={referralCode} link={referralLink} />
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-ivory py-14 md:py-16">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <p className="text-[14px] text-mute leading-[1.6]">
                Questions before week one? Reply to your Stripe receipt or message{" "}
                <a
                  href="mailto:contact@earlyfounderscollective.com"
                  className="text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                >
                  contact@earlyfounderscollective.com
                </a>
                .
              </p>
              <p className="mt-10 font-serif italic text-[18px] text-forest/85">
                — The EFC team
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
