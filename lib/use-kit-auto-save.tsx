"use client";

import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useKitAutoSave<T>(opts: {
  moduleSlug: string;
  initial: T;
  isComplete?: (data: T) => boolean;
  debounceMs?: number;
}) {
  const [data, setData] = useState<T>(opts.initial);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);
  const debounce = opts.debounceMs ?? 1200;

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setStatus("saving");
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/kit/access/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug: opts.moduleSlug,
            data,
            completed: opts.isComplete ? opts.isComplete(data) : false,
          }),
        });
        if (!res.ok) {
          setStatus("error");
          return;
        }
        setStatus("saved");
        setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1800);
      } catch {
        setStatus("error");
      }
    }, debounce);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { data, setData, status };
}

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const labels: Record<SaveStatus, string> = {
    idle: "Saved",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save — try again",
  };
  const color =
    status === "error"
      ? "text-[#9b2828]"
      : status === "saving"
        ? "text-mute"
        : "text-forest/60";
  return (
    <span className={`text-[11.5px] font-medium tracking-[0.04em] ${color}`}>
      {labels[status]}
    </span>
  );
}
