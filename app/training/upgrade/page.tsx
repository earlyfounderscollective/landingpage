import type { Metadata } from "next";
import Link from "next/link";
import { FunnelHeader, FunnelFooter } from "@/components/funnel/FunnelChrome";
import { UpgradeCTA } from "@/components/funnel/UpgradeCTA";

export const metadata: Metadata = {
  title: "Lifetime access — $17 · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TrainingUpgradePage({
  searchParams,
}: {
  searchParams: { email?: string; name?: string };
}) {
  const email = (searchParams.email ?? "").trim();
  const name = (searchParams.name ?? "").trim();

  return (
    <>
      <FunnelHeader tone="auto" />
      <main className="bg-ivory min-h-screen">
        <div className="container-page pt-[120px] sm:pt-[140px] md:pt-[160px] pb-16 md:pb-24">
          <div className="max-w-[620px] mx-auto">
            <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-brass text-center">
              You're registered · One more option
            </p>

            <h1 className="mt-6 font-serif text-[34px] sm:text-[42px] md:text-[50px] leading-[1.06] tracking-[-0.018em] text-forest text-center">
              Want to keep this one?
            </h1>

            <div className="mt-7 max-w-[520px] mx-auto text-center text-[15px] sm:text-[16px] leading-[1.65] text-ink/72 space-y-4">
              <p>
                The training is free. Your free replay is open for 48 hours after it ends.
              </p>
              <p>
                If you want to keep it longer, here's how.
              </p>
            </div>

            <div className="mt-12 md:mt-14 max-w-[520px] mx-auto">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass text-center mb-8">
                What you get
              </p>

              <ul className="space-y-7">
                <li className="grid grid-cols-[auto_1fr] gap-4">
                  <span
                    className="mt-[8px] h-[1.5px] w-3 bg-brass shrink-0"
                    aria-hidden
                  />
                  <div>
                    <p className="font-serif text-[19px] md:text-[20px] text-forest leading-[1.3]">
                      The replay — forever.
                    </p>
                    <p className="mt-2 text-[14.5px] text-ink/68 leading-[1.55]">
                      Watch any time. Bookmark a section. Come back to it next year. Yours.
                    </p>
                  </div>
                </li>

                <li className="grid grid-cols-[auto_1fr] gap-4">
                  <span
                    className="mt-[8px] h-[1.5px] w-3 bg-brass shrink-0"
                    aria-hidden
                  />
                  <div>
                    <p className="font-serif text-[19px] md:text-[20px] text-forest leading-[1.3]">
                      The transcript.
                    </p>
                    <p className="mt-2 text-[14.5px] text-ink/68 leading-[1.55]">
                      Searchable PDF transcript so you can jump straight to the part you want to revisit.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-12 md:mt-14 text-center">
              <p className="font-serif text-[44px] md:text-[52px] leading-none text-forest tracking-[-0.018em]">
                $17
              </p>
              <p className="mt-2 text-[13px] text-mute">One-time.</p>

              <div className="mt-8">
                <UpgradeCTA email={email} name={name} />
              </div>

              <div className="mt-5">
                <Link
                  href={`/training/confirmed${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                  className="text-[13px] text-mute hover:text-forest underline underline-offset-4 decoration-line"
                >
                  No thanks, the 48-hour replay is fine
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FunnelFooter />
    </>
  );
}
