"use client";

import { useEffect, useState } from "react";

function diff(target: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
} {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

export function CountdownTimer({
  targetIso,
  tone = "dark",
}: {
  targetIso: string;
  tone?: "dark" | "light";
}) {
  const target = new Date(targetIso).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return (
      <p className="text-[14px] font-medium text-brass">
        The training has started.
      </p>
    );
  }

  const labelCls =
    tone === "dark"
      ? "text-[10px] uppercase tracking-[0.18em] text-ivory/55"
      : "text-[10px] uppercase tracking-[0.18em] text-mute";
  const numCls =
    tone === "dark"
      ? "font-serif text-[28px] md:text-[32px] text-ivory tabular-nums tracking-[-0.012em]"
      : "font-serif text-[28px] md:text-[32px] text-forest tabular-nums tracking-[-0.012em]";

  const cells: { value: number; label: string }[] = [
    { value: t.days, label: "Day(s)" },
    { value: t.hours, label: "Hour(s)" },
    { value: t.minutes, label: "Minutes" },
    { value: t.seconds, label: "Seconds" },
  ];

  return (
    <div className="inline-flex items-stretch gap-3 md:gap-4">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-3 md:gap-4">
          <div className="text-center">
            <p className={numCls}>{String(c.value).padStart(2, "0")}</p>
            <p className={`${labelCls} mt-1`}>{c.label}</p>
          </div>
          {i < cells.length - 1 && (
            <span
              className={`font-serif text-[24px] ${tone === "dark" ? "text-ivory/40" : "text-mute/40"} pb-4`}
              aria-hidden
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Inline single-line countdown — matches Hormozi's "EVENT STARTS IN: D:H:M:S"
 * pattern. Centered. Compact. Sits inline with the hero CTA.
 */
export function InlineCountdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return (
      <p className="text-[12px] uppercase tracking-[0.18em] text-brass font-semibold">
        The training has started.
      </p>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-ivory">
      <span aria-hidden className="text-[#d23a3a] text-[14px]">⚠</span>
      <span className="text-[10.5px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-ivory/75">
        Event Starts In:
      </span>
      <div className="inline-flex items-baseline gap-1.5 ml-1">
        {[
          { v: t.days, l: "D" },
          { v: t.hours, l: "H" },
          { v: t.minutes, l: "M" },
          { v: t.seconds, l: "S" },
        ].map((c, i, arr) => (
          <span key={c.l} className="inline-flex items-baseline">
            <span className="font-serif text-[16px] sm:text-[18px] text-ivory tabular-nums tracking-[-0.012em]">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="ml-0.5 text-[10px] uppercase tracking-[0.12em] text-ivory/55">
              {c.l}
            </span>
            {i < arr.length - 1 && (
              <span
                className="mx-1.5 text-ivory/40 font-serif text-[14px]"
                aria-hidden
              >
                :
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
