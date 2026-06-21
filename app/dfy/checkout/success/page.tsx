import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "You're in · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DFYCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = (searchParams.session_id ?? "").trim();
  let firstName = "";
  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const name = session.metadata?.name || session.customer_details?.name || "";
        if (name) firstName = String(name).split(/\s+/)[0];
      } catch {
        // ignore
      }
    }
  }

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
                Seat reserved
              </p>
              <h1 className="font-serif text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                {firstName ? `Welcome in, ${firstName}.` : "Welcome in."}
              </h1>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink/72">
                Your payment is confirmed. We'll email you within 24 hours with
                the kickoff intake form and three time slots for week one.
              </p>
              <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/72">
                While you wait — open the{" "}
                <Link
                  href="/kit/access"
                  className="text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                >
                  Build Your Business Kit
                </Link>
                . Modules 01 and 02 (Offer Clarity + Business Setup) are what
                we'll review together in week one.
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
