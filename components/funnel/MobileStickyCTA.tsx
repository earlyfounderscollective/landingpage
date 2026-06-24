"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky bottom CTA bar — visible on mobile only (hidden on md+).
 *
 * Behavior:
 *   - Hidden until user scrolls 400px (so it doesn't compete with the hero CTA)
 *   - Smooth fade-in
 *   - Honors iOS safe-area inset
 *   - Brass button by default; consumer can pass a custom `tone`
 *
 * Usage:
 *   <MobileStickyCTA href="/bootcamp/apply" label="Join Founders Foundation" />
 *
 * For onClick handlers instead of links, pass `onClick` + omit `href`.
 */
export function MobileStickyCTA({
  href,
  label,
  sub,
  onClick,
  threshold = 400,
}: {
  href?: string;
  label: string;
  sub?: string;
  onClick?: () => void;
  threshold?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > threshold);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  const inner = (
    <>
      <span className="block text-[13.5px] font-semibold tracking-[0.06em] uppercase">
        {label}
      </span>
      {sub && (
        <span className="block mt-0.5 text-[11px] tracking-[0.1em] text-ivory/75">
          {sub}
        </span>
      )}
    </>
  );

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="bg-ivory/95 backdrop-blur-md border-t border-line/60 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.18)] px-4 pt-3">
        <div className="max-w-[420px] mx-auto">
          {href ? (
            <Link
              href={href}
              className="block bg-brass text-ivory text-center rounded-full px-6 py-3.5 hover:bg-[#8a6c3f] transition-colors shadow-[0_18px_40px_-18px_rgba(155,122,74,0.7)]"
            >
              {inner}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClick}
              className="w-full bg-brass text-ivory text-center rounded-full px-6 py-3.5 hover:bg-[#8a6c3f] transition-colors shadow-[0_18px_40px_-18px_rgba(155,122,74,0.7)]"
            >
              {inner}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
