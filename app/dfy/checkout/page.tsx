import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyDFYCheckoutToken } from "@/lib/signing";
import { DFY_PRICING, DFY_FEATURES, formatUSD } from "@/lib/dfy";
import { CheckoutOptions } from "./CheckoutOptions";

export const metadata: Metadata = {
  title: "Reserve your seat · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DFYCheckoutPage({
  searchParams,
}: {
  searchParams: { app?: string; token?: string };
}) {
  const appId = searchParams.app ?? "";
  const token = searchParams.token ?? "";

  if (!appId || !token || !verifyDFYCheckoutToken(appId, token)) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();
  const { data: app } = await supabase
    .from("dfy_applications")
    .select("id, email, full_name, status, budget")
    .eq("id", appId)
    .maybeSingle();

  if (!app) notFound();

  if (app.status !== "accepted" && app.status !== "scheduled" && app.status !== "paid") {
    // Either not approved yet, or already closed/passed
    notFound();
  }

  const first = app.full_name ? app.full_name.split(/\s+/)[0] : "";
  const alreadyPaid = app.status === "paid";

  return (
    <>
      <Header />
      <main>
        <section className="bg-ivory pt-28 md:pt-32 pb-10 md:pb-12">
          <div className="container-page">
            <div className="max-w-[640px] mx-auto text-center">
              <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass mb-4">
                Done-For-You · Reserve your seat
              </p>
              <h1 className="font-serif text-[36px] md:text-[46px] leading-[1.08] tracking-[-0.018em] text-forest">
                {alreadyPaid
                  ? "You're already in."
                  : first
                    ? `${first}, you're in.`
                    : "You're in."}
              </h1>
              {!alreadyPaid && (
                <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65] text-ink/72">
                  One last step. Pick how you want to pay and we'll get the
                  kickoff scheduled this week.
                </p>
              )}
              {alreadyPaid && (
                <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65] text-ink/72">
                  We've already received your payment. Check your inbox for the
                  kickoff intake.
                </p>
              )}
            </div>
          </div>
        </section>
        {!alreadyPaid && (
          <section className="bg-bone py-12 md:py-16 grain">
            <div className="container-page">
              <div className="max-w-[640px] mx-auto bg-ivory rounded-2xl p-7 md:p-10 border border-line/60 shadow-[0_18px_50px_-25px_rgba(35,53,45,0.2)]">
                <CheckoutOptions
                  appId={app.id}
                  token={token}
                  pricing={{
                    fullPriceCents: DFY_PRICING.fullPriceCents,
                    installmentCents: DFY_PRICING.installmentCents,
                    affirmMinMonthlyCents: DFY_PRICING.affirmMinMonthlyCents,
                  }}
                  features={{
                    payInFull: DFY_FEATURES.payInFull,
                    installments: DFY_FEATURES.installments,
                    affirm: DFY_FEATURES.affirm,
                  }}
                />
              </div>
              <p className="mt-8 max-w-[560px] mx-auto text-center text-[12.5px] text-mute leading-[1.6]">
                Secure payment via Stripe. {formatUSD(DFY_PRICING.fullPriceCents)} total. If after week one you don't think this is for you, we refund in full.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
