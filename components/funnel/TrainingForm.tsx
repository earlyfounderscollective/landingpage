"use client";

import { useState } from "react";

type Mode = "upcoming" | "replay" | "between";

export function TrainingForm({
  mode,
  ctaLabel,
  helperText,
}: {
  mode: Mode;
  ctaLabel: string;
  helperText?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

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

  if (status === "sent") {
    return (
      <div className="bg-ivory/95 border border-line rounded-2xl p-6 md:p-7 text-center max-w-md mx-auto">
        <p className="font-serif text-[24px] md:text-[26px] leading-[1.2] text-forest tracking-[-0.012em]">
          You're in.
        </p>
        <p className="mt-2 text-[14px] text-ink/72 leading-[1.55]">
          {mode === "upcoming"
            ? "Check your inbox for the confirmation and Zoom link."
            : mode === "replay"
              ? "Check your inbox for the replay link."
              : "We'll email you the moment a date is set."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-ivory/95 border border-line/50 rounded-2xl p-5 md:p-6 max-w-md mx-auto shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]"
    >
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
        <label className="block">
          <span className="sr-only">First name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] focus:outline-none focus:border-forest"
          />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] focus:outline-none focus:border-forest"
          />
        </label>
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
}
