import Link from "next/link";

/**
 * Founders Foundation pitch card. Used on /training/confirmed and
 * /training/watch as the higher-ticket alternative to the kit upsell.
 *
 * Variants:
 *   - "after-kit"  → bone/brass styled, framed as "want help applying this?"
 *                    Sits BELOW the kit pitch. Lower visual weight on purpose.
 *   - "primary"    → dark forest, bigger CTA. For replay-expired state where
 *                    the kit pitch is already done and we want the bootcamp
 *                    to be the conversion target.
 */
export function BootcampPitchCard({
  variant = "after-kit",
  source = "training",
}: {
  variant?: "after-kit" | "primary";
  source?: string;
}) {
  const href = `/bootcamp?source=${encodeURIComponent(source)}`;

  if (variant === "primary") {
    return (
      <div className="mt-6 bg-forest text-ivory rounded-2xl p-7 md:p-9 border border-brass/30">
        <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
          Or — go further
        </p>
        <h3 className="mt-3 font-serif text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.012em] text-ivory">
          Want me in the room with you for four weeks?
        </h3>
        <p className="mt-4 text-[15px] md:text-[16px] leading-[1.65] text-ivory/80">
          Founders Foundation is the four-week guided cohort version of what
          we just covered. Live group sessions, the full toolkit, a private
          community of founders building alongside you, and direct access to
          ask questions between sessions.
        </p>
        <Link
          href={href}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-brass text-ivory text-[14px] font-semibold tracking-[0.05em] uppercase px-7 py-[14px] hover:bg-[#8a6c3f] transition-colors"
        >
          See Founders Foundation →
        </Link>
        <p className="mt-3 text-[12px] tracking-[0.16em] uppercase text-ivory/55">
          4 weeks · $497
        </p>
      </div>
    );
  }

  // after-kit variant — softer card so it doesn't compete with the kit CTA above
  return (
    <div className="mt-5 bg-bone border border-line/70 rounded-2xl p-6 md:p-7 relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:items-center">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.26em] uppercase text-brass">
            Want the live version?
          </p>
          <p className="mt-2 font-serif text-[18px] md:text-[20px] leading-[1.3] text-forest">
            Founders Foundation — 4-week cohort with the kit included.
          </p>
          <p className="mt-2 text-[13.5px] text-ink/65 leading-[1.55]">
            Live group sessions, private community, office hours. $497.
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-forest text-ivory px-6 py-3 text-[12.5px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors"
        >
          Learn more →
        </Link>
      </div>
    </div>
  );
}
