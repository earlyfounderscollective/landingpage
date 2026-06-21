"use client";

import { useState } from "react";

export function ReferralShare({
  code,
  link,
}: {
  code: string;
  link: string;
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function copy(value: string, which: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 bg-ivory/95 rounded-xl p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-mute mb-1">
            Your code
          </p>
          <p className="font-serif text-[22px] md:text-[24px] text-forest tabular-nums tracking-[0.06em]">
            {code}
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(code, "code")}
          className="shrink-0 bg-forest text-ivory px-4 py-2.5 rounded-full text-[11.5px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors"
        >
          {copied === "code" ? "Copied ✓" : "Copy code"}
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 bg-ivory/95 rounded-xl p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-mute mb-1">
            Your link
          </p>
          <p className="text-[13px] text-forest truncate">{link}</p>
        </div>
        <button
          type="button"
          onClick={() => copy(link, "link")}
          className="shrink-0 bg-forest text-ivory px-4 py-2.5 rounded-full text-[11.5px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors"
        >
          {copied === "link" ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
