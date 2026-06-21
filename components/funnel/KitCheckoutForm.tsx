"use client";

import { useState } from "react";

export function KitCheckoutForm({
  prefillEmail,
  priceCents,
  bumpPriceCents,
  isRegistrant,
  registrantToken,
}: {
  prefillEmail: string;
  priceCents: number;
  bumpPriceCents: number;
  isRegistrant: boolean;
  registrantToken?: string;
}) {
  const [email, setEmail] = useState(prefillEmail);
  const [name, setName] = useState("");
  const [bump, setBump] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/kit/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          bump,
          source: isRegistrant ? "training_registrant" : "cold",
          registrant_token: registrantToken ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Couldn't start checkout.");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Couldn't start checkout.";
      setError(msg);
      setLoading(false);
    }
  }

  const totalCents = priceCents + (bump ? bumpPriceCents : 0);

  return (
    <form onSubmit={onSubmit} className="max-w-[420px] mx-auto">
      <div className="space-y-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-[14px] bg-white text-ink border border-line rounded-md text-[15px] focus:outline-none focus:border-forest placeholder:text-ink/40"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-[14px] bg-white text-ink border border-line rounded-md text-[15px] focus:outline-none focus:border-forest placeholder:text-ink/40"
        />
      </div>

      {/* Order bump */}
      <label className="mt-4 flex gap-3 items-start bg-ivory/10 border border-ivory/20 text-ivory rounded-md p-3.5 cursor-pointer hover:bg-ivory/15 transition-colors text-left">
        <input
          type="checkbox"
          checked={bump}
          onChange={(e) => setBump(e.target.checked)}
          className="mt-[3px] h-[18px] w-[18px] accent-brass cursor-pointer shrink-0"
        />
        <span className="flex-1">
          <span className="block text-[13.5px] font-semibold text-ivory">
            Add the Premium Sales &amp; Systems Checklist — +${bumpPriceCents / 100}
          </span>
          <span className="block mt-1 text-[12px] text-ivory/65 leading-[1.5]">
            The expanded version with scripts, objection responses, and the negotiation templates I use with private clients.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !email}
        className="mt-5 flex flex-col w-full items-center justify-center rounded-full bg-brass text-ivory px-6 py-[16px] shadow-[0_22px_50px_-18px_rgba(155,122,74,0.7)] hover:bg-[#8a6c3f] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="text-[14.5px] sm:text-[15px] font-semibold tracking-[0.04em] uppercase leading-tight">
          {loading ? "Loading checkout…" : "Get Build Your Business Kit"}
        </span>
        <span className="mt-1 text-[11.5px] tracking-[0.16em] uppercase text-ivory/85 leading-tight">
          ${totalCents / 100} · One-time
        </span>
      </button>

      {error && (
        <p className="mt-3 text-[12.5px] text-[#f0a8a8] text-center" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
