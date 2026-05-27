import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ApplicationForm } from "./ApplicationForm";

export const metadata = {
  title: "Apply for Access",
  description:
    "Apply to join Early Founders Collective, a private community for early-stage business owners built around clarity, accountability, and momentum.",
};

export default function ApplyPage() {
  return (
    <>
      <Header />
      <main className="pt-[160px] md:pt-[200px] bg-ivory grain">
        <section className="py-12 md:py-20">
          <div className="container-page">
            <div className="max-w-narrow mx-auto text-center mb-16 md:mb-20">
              <div className="mb-10">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-forest/60 hover:text-forest transition-colors"
                >
                  ← Back to home
                </Link>
              </div>
              <span className="eyebrow">Application</span>
              <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
              <h1 className="font-serif text-display-lg text-forest text-balance">
                Tell us what you&rsquo;re actually building.
              </h1>
              <p className="mt-7 text-[17px] leading-[1.65] text-ink/70 max-w-xl mx-auto">
                We read every application by hand. The more specific you can
                be, the easier it is to figure out if our room is the right
                fit for the work you&rsquo;re doing.
              </p>
              <ul className="mt-10 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] uppercase tracking-[0.28em] text-forest/55">
                {[
                  "Takes 8–12 minutes",
                  "Reviewed in 2-3 days",
                  "Payment only after acceptance",
                ].map((s, i) => (
                  <li key={s} className="inline-flex items-center gap-3">
                    {i > 0 && (
                      <span className="h-px w-6 bg-forest/25" aria-hidden />
                    )}
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-w-4xl mx-auto bg-white border border-line/70 rounded-card p-8 md:p-12 lg:p-16 shadow-card">
              <ApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
