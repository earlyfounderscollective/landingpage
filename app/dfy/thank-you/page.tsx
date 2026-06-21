import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Application received · Done-For-You",
  robots: { index: false, follow: false },
};

export default function DFYThankYouPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-ivory pt-32 md:pt-36 pb-20 md:pb-24 min-h-[70vh]">
          <div className="container-page">
            <div className="max-w-[560px] mx-auto text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest text-ivory mb-7">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12L10 18L20 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Application received
              </p>
              <h1 className="font-serif text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                Got it. We'll be in touch.
              </h1>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink/72">
                We read every application. If it's a fit, we'll email you within
                48 hours to set up a 15-minute call. If it's not the right time,
                we'll tell you that too — and what would be a better starting
                point.
              </p>
              <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/72">
                In the meantime, the{" "}
                <Link
                  href="/kit"
                  className="text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                >
                  Build Your Business Kit
                </Link>{" "}
                covers the foundational work we'd do in week one and two.
              </p>
              <p className="mt-12 font-serif italic text-[18px] text-forest/85">
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
