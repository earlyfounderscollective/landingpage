"use client";

import { useEffect, useState } from "react";

type Mode = "upcoming" | "replay" | "between";

export function TrainingForm({
  mode,
  ctaLabel,
  helperText,
  variant = "modal",
}: {
  mode: Mode;
  ctaLabel: string;
  helperText?: string;
  variant?: "modal" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/training/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, _gotcha: honey }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Couldn't reserve. Try again.");
      }
      setStatus("sent");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Couldn't reserve. Try again.";
      setError(msg);
      setStatus("error");
    }
  }

  const formInner = (
    <form onSubmit={onSubmit} className="w-full">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        className="absolute -left-[9999px] w-0 h-0"
        aria-hidden="true"
      />
      <div className="space-y-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] focus:outline-none focus:border-forest"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoFocus
          className="w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] focus:outline-none focus:border-forest"
        />
        <button
          type="submit"
          disabled={status === "sending" || !email}
          className="w-full bg-forest text-ivory px-5 py-[15px] rounded-full text-[14.5px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Reserving…" : ctaLabel}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-[12.5px] text-[#a13a1a] text-center" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-3 text-[12px] text-ink/55 text-center leading-[1.5]">
          {helperText}
        </p>
      )}
    </form>
  );

  const successInner = (
    <div className="text-center py-6">
      <p className="font-serif text-[26px] md:text-[28px] leading-[1.2] text-forest tracking-[-0.012em]">
        You're in.
      </p>
      <p className="mt-3 text-[14.5px] text-ink/72 leading-[1.55]">
        {mode === "upcoming"
          ? "Check your inbox for the confirmation and Zoom link."
          : mode === "replay"
            ? "Check your inbox for the replay link."
            : "We'll email you the moment a date is set."}
      </p>
    </div>
  );

  // Modal variant — button on hero, form lives in overlay
  if (variant === "modal") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brass text-ivory text-[14px] sm:text-[15px] font-medium tracking-[0.02em] px-10 sm:px-12 py-4 sm:py-[18px] shadow-[0_18px_40px_-16px_rgba(155,122,74,0.55)] hover:bg-[#8a6c3f] hover:-translate-y-[1px] transition-all duration-300"
        >
          {ctaLabel}
        </button>

        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-ink/65 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-[420px] bg-ivory rounded-2xl p-6 md:p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 h-9 w-9 inline-flex items-center justify-center rounded-full text-mute hover:text-forest hover:bg-bone"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              {status === "sent" ? (
                successInner
              ) : (
                <>
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-1.5">
                    Save your seat
                  </p>
                  <p className="font-serif text-[20px] md:text-[22px] leading-[1.25] text-forest tracking-[-0.012em] mb-5">
                    Drop your name and email.
                  </p>
                  {formInner}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Inline variant fallback (no modal)
  return (
    <div className="bg-ivory/95 border border-line/50 rounded-2xl p-5 md:p-6 max-w-md mx-auto shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]">
      {status === "sent" ? successInner : formInner}
    </div>
  );
}
