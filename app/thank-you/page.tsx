import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Application Received",
};

const steps = [
  { n: "01", t: "Manual review", d: "Every application is read by hand. No automation, no shortcuts." },
  { n: "02", t: "Reply in 2-3 days", d: "You'll hear back either way, with honest feedback." },
  { n: "03", t: "Onboarding if it's a fit", d: "Payment and access details follow, only after acceptance." },
];

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="pt-[180px] md:pt-[220px] pb-28 md:pb-40 bg-ivory grain">
        <div className="container-page">
          <div className="max-w-narrow mx-auto text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-forest text-ivory mb-9">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <path d="M4 11L9 16L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="eyebrow">Application Received</span>
            <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
            <h1 className="font-serif text-display-lg text-forest text-balance">
              Thank you for applying.
            </h1>
            <p className="mt-7 text-[17px] leading-[1.65] text-ink/70 max-w-xl mx-auto">
              Your application has been received and will be reviewed manually.
              If it looks like a strong fit, you&rsquo;ll receive next steps
              shortly. In the meantime, keep building.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {steps.map((s) => (
                <div key={s.n} className="card-soft p-7 md:p-8">
                  <p className="font-serif text-[14px] tracking-[0.04em] text-brass">
                    Step {s.n}
                  </p>
                  <p className="mt-3 font-serif text-[20px] text-forest leading-[1.25]">
                    {s.t}
                  </p>
                  <p className="mt-3 text-[14.5px] text-ink/65 leading-[1.6]">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-secondary">Back to home</Link>
              <a href="mailto:contact@earlyfounderscollective.com" className="btn-ghost">
                contact@earlyfounderscollective.com →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
