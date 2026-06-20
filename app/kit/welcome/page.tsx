import type { Metadata } from "next";
import Link from "next/link";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { StatusBanner } from "@/components/funnel/StatusBanner";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "You're in · Build Your Business Kit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KitWelcomePage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = (searchParams.session_id ?? "").trim();
  let firstName = "";
  let bumpIncluded = false;

  // Pull customer details from Stripe if a session_id is present
  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const name = session.metadata?.name || session.customer_details?.name || "";
        if (name) firstName = String(name).split(/\s+/)[0];
        bumpIncluded = session.metadata?.bump_included === "true";
      } catch {
        // ignore
      }
    }
  }

  return (
    <>
      <StatusBanner tone="vip-success" label="ORDER CONFIRMED" />
      <main className="bg-ivory min-h-[calc(100vh-100px)]">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-[640px] mx-auto text-center">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
              You're in
            </p>
            <h1 className="mt-5 font-serif text-[36px] sm:text-[44px] md:text-[54px] leading-[1.05] tracking-[-0.018em] text-forest">
              {firstName ? `Welcome, ${firstName}.` : "Welcome."}
            </h1>
            <p className="mt-6 max-w-[480px] mx-auto text-[16px] md:text-[17px] leading-[1.7] text-ink/72">
              Your Build Your Business Kit is unlocked. Check your inbox for the access link — it should arrive within a couple minutes. If you don't see it, check spam.
            </p>

            {bumpIncluded && (
              <div className="mt-10 bg-bone border border-line/60 rounded-2xl p-6 md:p-7 text-left">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
                  Premium add-on included
                </p>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-ink/72">
                  The Premium Sales &amp; Systems Checklist is included with your order. It ships in the same access email — look for the second download link.
                </p>
              </div>
            )}

            <div className="mt-12 bg-forest text-ivory rounded-2xl p-7 md:p-9 text-left">
              <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
                What to do first
              </p>
              <p className="mt-3 font-serif text-[20px] md:text-[22px] leading-[1.3] text-ivory">
                Open Module 01 — the Offer Clarity Worksheet.
              </p>
              <p className="mt-4 text-[15px] leading-[1.65] text-ivory/80">
                Don't try to do everything in one sitting. Start with the offer. If you can lock that down this weekend, the rest of the kit moves twice as fast.
              </p>
            </div>

            <p className="mt-12 text-[14px] text-mute">
              Need anything?{" "}
              <a
                href="mailto:contact@earlyfounderscollective.com"
                className="text-forest underline underline-offset-4 hover:text-brass"
              >
                contact@earlyfounderscollective.com
              </a>
            </p>

            <p className="mt-14 font-serif italic text-[17px] text-forest/85">
              Oge
            </p>

            <div className="mt-12">
              <Link
                href="/"
                className="text-[13px] text-mute hover:text-forest underline underline-offset-4 decoration-line"
              >
                Back to early founders collective →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <FunnelFooter />
    </>
  );
}
