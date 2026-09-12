"use client";

import { useState } from "react";
import { trackPixelEvent } from "@/components/site/MetaPixel";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function makeEventId(): string {
  // Compact unique id for Meta dedup. Pixel + CAPI both use this.
  return `eb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Email-only waitlist capture for the guide. */
export function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError("");
    setStatus("sending");
    try {
      const metaEventId = makeEventId();
      const res = await fetch("/api/profitable-events-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          _gotcha: honey,
          meta_event_id: metaEventId,
          meta_fbc: readCookie("_fbc"),
          meta_fbp: readCookie("_fbp"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Try again.");
      setStatus("sent");
      trackPixelEvent("Lead", { eventId: metaEventId });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-2xl border border-forest/15 bg-white px-6 py-8 text-center"
        role="status"
      >
        <p className="font-serif text-[22px] leading-[1.3] tracking-[-0.012em] text-forest sm:text-[25px]">
          You&rsquo;re on the list.
        </p>
        <p className="mx-auto mt-3 max-w-[34ch] text-[15px] leading-[1.6] text-ink/65">
          I&rsquo;ll email you when the guide is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0"
        aria-hidden="true"
      />

      <label className="sr-only" htmlFor="waitlist-email">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        autoComplete="email"
        required
        className="w-full rounded-xl border border-forest/20 bg-white px-5 py-4 text-[16px] text-ink placeholder:text-ink/40 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
      />

      <button
        type="submit"
        // Only disabled while in flight. Greying it out on an empty field
        // makes the main CTA look inactive on load; `required` catches empties.
        disabled={status === "sending"}
        className="mt-3 w-full rounded-xl bg-forest px-6 py-4 text-[16px] font-semibold tracking-[0.01em] text-ivory transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-55"
      >
        {status === "sending" ? "Joining…" : "Join the waitlist"}
      </button>

      {error && (
        <p className="mt-3 text-center text-[13px] text-[#a13a1a]" role="alert">
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-[14px] leading-[1.55] text-ink/60">
        Be the first to know when the guide is ready.
      </p>
    </form>
  );
}
