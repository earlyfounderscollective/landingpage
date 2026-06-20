"use client";

import { useState } from "react";

export type FAQItem = { q: string; a: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <li
            key={item.q}
            className="bg-bone/50 border border-line/60 rounded-xl overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-bone/80 transition-colors"
            >
              <span className="font-serif text-[17px] md:text-[18.5px] leading-[1.3] text-forest">
                {item.q}
              </span>
              <span
                className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest text-ivory transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                aria-hidden
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-[15px] md:text-[15.5px] leading-[1.65] text-ink/72">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
