import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern membership in Early Founders Collective.",
};

const updated = "May 25, 2026";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-[180px] md:pt-[220px] pb-24 md:pb-32 bg-ivory grain">
        <div className="container-page">
          <article className="max-w-narrow mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-forest/60 hover:text-forest transition-colors mb-10"
            >
              ← Back to home
            </Link>

            <span className="eyebrow">Terms</span>
            <h1 className="mt-6 font-serif text-display-lg text-forest text-balance">
              Terms of Service
            </h1>
            <p className="mt-4 text-[13px] uppercase tracking-[0.24em] text-forest/55">
              Last updated · {updated}
            </p>

            <div className="mt-12 space-y-10 text-[16px] leading-[1.7] text-ink/80">
              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Agreement
                </h2>
                <p>
                  By submitting an application, completing payment, or otherwise
                  using Early Founders Collective (&ldquo;EFC&rdquo;,
                  &ldquo;we&rdquo;, &ldquo;our&rdquo;), you agree to these terms.
                  EFC is operated by The Blackseed Group LLC, based in Houston,
                  Texas.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  What membership is
                </h2>
                <p className="mb-3">
                  EFC is a private community for early-stage business owners
                  focused on clarity, structure, accountability, and execution.
                  Membership includes access to the community, weekly calls,
                  execution support, and other materials we provide from time to
                  time.
                </p>
                <p>
                  Optional in-person mastermind events are offered separately at
                  an additional cost and are not part of the base membership.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Applications and acceptance
                </h2>
                <p>
                  We review every application by hand. Submitting an application
                  does not guarantee acceptance. Decisions are at our sole
                  discretion. We will only collect payment from applicants we
                  have accepted.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Payment, renewals, and cancellation
                </h2>
                <ul className="space-y-2.5 list-disc pl-5 marker:text-brass">
                  <li>
                    Membership is billed monthly through Stripe at the price
                    shown at checkout. Founding-member pricing, when offered,
                    remains in effect for the lifetime of an uninterrupted
                    subscription.
                  </li>
                  <li>
                    Subscriptions renew automatically each month until cancelled.
                  </li>
                  <li>
                    You can cancel at any time. Cancellation stops future
                    charges; we do not prorate or refund partial months unless
                    required by law.
                  </li>
                  <li>
                    If a payment fails, your access may be temporarily
                    restricted. If the payment is not resolved, your membership
                    will be cancelled.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Refunds
                </h2>
                <p>
                  Because membership is a digital, time-bound, ongoing service,
                  payments are non-refundable. We may make exceptions at our
                  sole discretion for unusual circumstances.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Conduct
                </h2>
                <p>
                  EFC is a private community built on honest conversation and
                  mutual respect. We reserve the right to remove any member,
                  with or without notice, for harassment, discrimination,
                  spamming, recording or sharing private conversations without
                  consent, or any conduct that damages the community.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Confidentiality
                </h2>
                <p>
                  What is shared inside the community is intended for members
                  only. You agree not to publicly share, post, or distribute
                  private conversations, materials, or member information
                  outside the room without explicit consent.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  No guarantees
                </h2>
                <p>
                  EFC provides structure, support, and community. We do not
                  promise specific business outcomes, revenue, growth, or
                  results. What you get from the room depends on the work you
                  put in.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Intellectual property
                </h2>
                <p>
                  All materials, frameworks, and content we provide remain our
                  intellectual property. You receive a limited, personal,
                  non-transferable license to use them while you are a member.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Limitation of liability
                </h2>
                <p>
                  To the maximum extent permitted by law, EFC and The Blackseed
                  Group LLC are not liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of
                  the community. Our total liability for any claim related to
                  the service is limited to the amount you paid us in the three
                  months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Governing law
                </h2>
                <p>
                  These terms are governed by the laws of the State of Texas,
                  without regard to its conflict-of-law principles. Any disputes
                  will be resolved in the state or federal courts located in
                  Harris County, Texas.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Changes
                </h2>
                <p>
                  We may update these terms from time to time. Material changes
                  will be reflected in the &ldquo;Last updated&rdquo; date above.
                  Continued use of the community after a change constitutes
                  acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Contact
                </h2>
                <p>
                  Questions about these terms?{" "}
                  <a
                    href="mailto:contact@earlyfounderscollective.com"
                    className="link-underline text-forest"
                  >
                    contact@earlyfounderscollective.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
