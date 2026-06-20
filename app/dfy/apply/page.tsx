import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DFYApplicationForm } from "./DFYApplicationForm";

export const metadata: Metadata = {
  title: "Apply · Done-For-You · Early Founders Collective",
  description: "Apply to work 1-on-1 with Oge for 6 weeks.",
  robots: { index: false, follow: false },
};

export default function DFYApplyPage({
  searchParams,
}: {
  searchParams: { tier?: string };
}) {
  const tierParam = searchParams.tier === "dfy" ? "dfy" : searchParams.tier === "dwy" ? "dwy" : "";

  return (
    <>
      <Header />
      <main>
        <section className="bg-ivory pt-28 md:pt-32 pb-12 md:pb-16">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Done-For-You · Application
              </p>
              <h1 className="font-serif text-[36px] md:text-[46px] leading-[1.08] tracking-[-0.018em] text-forest">
                Tell me where you're at.
              </h1>
              <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65] text-ink/72">
                Four minutes. I read every application personally. If it's a fit,
                I'll email you within 48 hours to set up a 15-minute call.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-bone py-12 md:py-16 grain">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto bg-ivory rounded-2xl p-7 md:p-10 border border-line/60 shadow-[0_18px_50px_-25px_rgba(35,53,45,0.2)]">
              <DFYApplicationForm initialTier={tierParam} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
