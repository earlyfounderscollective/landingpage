import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Early Founders Collective collects, uses, and protects your information.",
};

const updated = "May 25, 2026";

export default function PrivacyPage() {
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

            <span className="eyebrow">Privacy</span>
            <h1 className="mt-6 font-serif text-display-lg text-forest text-balance">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[13px] uppercase tracking-[0.24em] text-forest/55">
              Last updated · {updated}
            </p>

            <div className="mt-12 space-y-10 text-[16px] leading-[1.7] text-ink/80">
              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Who we are
                </h2>
                <p>
                  Early Founders Collective (&ldquo;EFC&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;)
                  is operated by The Blackseed Group LLC, based in Houston, Texas.
                  You can reach us at{" "}
                  <a
                    href="mailto:contact@earlyfounderscollective.com"
                    className="link-underline text-forest"
                  >
                    contact@earlyfounderscollective.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  What we collect
                </h2>
                <p className="mb-3">
                  When you apply to join the community, we collect the information
                  you provide on the application form: your name, email, phone
                  number, city, social or website link, what you are currently
                  building, your stage, the challenges you describe, and your
                  goals. We also collect a timestamp of when you applied.
                </p>
                <p>
                  When you become a member and pay through Stripe, Stripe collects
                  payment details on our behalf. We never see or store full card
                  numbers. We store a Stripe customer reference so we can manage
                  your membership.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  How we use it
                </h2>
                <ul className="space-y-2.5 list-disc pl-5 marker:text-brass">
                  <li>To review your application by hand and respond to you.</li>
                  <li>
                    To send you transactional emails (confirmation, acceptance,
                    decline, payment, onboarding, cancellation).
                  </li>
                  <li>To manage your membership and payment lifecycle.</li>
                  <li>
                    To improve the program based on patterns we see across
                    applications and active members.
                  </li>
                </ul>
                <p className="mt-4">
                  We do <strong>not</strong> sell, rent, or share your personal
                  information with third parties for marketing.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Who we share it with
                </h2>
                <p className="mb-3">
                  We use a small set of trusted service providers to run the
                  community:
                </p>
                <ul className="space-y-2.5 list-disc pl-5 marker:text-brass">
                  <li>
                    <strong>Supabase</strong> stores your application and
                    membership data.
                  </li>
                  <li>
                    <strong>Stripe</strong> processes payments and stores
                    payment methods.
                  </li>
                  <li>
                    <strong>Resend</strong> delivers our transactional emails.
                  </li>
                  <li>
                    <strong>Vercel</strong> hosts the website and routes the
                    traffic.
                  </li>
                </ul>
                <p className="mt-4">
                  Each of these providers handles your data under their own
                  security and compliance standards. We may also disclose
                  information if required by law.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  How long we keep it
                </h2>
                <p>
                  Applications and membership records are kept while your account
                  is active and for a reasonable period afterward for accounting
                  and legal recordkeeping. You can request deletion at any time
                  by emailing us.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Your rights
                </h2>
                <p>
                  You can ask us to access, correct, export, or delete your
                  personal data. Email{" "}
                  <a
                    href="mailto:contact@earlyfounderscollective.com"
                    className="link-underline text-forest"
                  >
                    contact@earlyfounderscollective.com
                  </a>{" "}
                  and we&rsquo;ll respond within a reasonable window.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Cookies
                </h2>
                <p>
                  The site uses only essential cookies needed for the site to
                  function (session, security). We do not run third-party
                  advertising or behavioral-tracking cookies. If we add analytics
                  in the future, we&rsquo;ll update this policy and use a
                  privacy-friendly provider.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-[22px] md:text-[26px] text-forest mb-4">
                  Changes to this policy
                </h2>
                <p>
                  We may update this policy from time to time. Material changes
                  will be reflected in the &ldquo;Last updated&rdquo; date above.
                  Continued use of the site after a change constitutes acceptance
                  of the revised policy.
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
