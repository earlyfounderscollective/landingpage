import Link from "next/link";

/**
 * Mobile-only persistent CTA. Sits at the bottom of the viewport with a
 * soft ivory gradient backdrop so it reads cleanly over any section the
 * user is scrolling through. Honours the iPhone home-indicator safe area.
 *
 * Hidden on tablet+ (md and up) where the inline CTAs and header button
 * are already visible.
 */
export function StickyApplyButton() {
  return (
    <div
      aria-hidden="false"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-8 bg-gradient-to-t from-ivory via-ivory/92 to-transparent"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <Link
        href="/apply"
        className="flex items-center justify-center w-full rounded-full bg-forest text-ivory text-[14.5px] font-medium tracking-[0.02em] py-[15px] shadow-[0_10px_28px_-10px_rgba(35,53,45,0.45)] hover:bg-ink transition-colors"
      >
        Apply for Access
      </Link>
    </div>
  );
}
