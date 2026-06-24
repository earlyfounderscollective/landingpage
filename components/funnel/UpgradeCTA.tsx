"use client";

import { useState } from "react";

export function UpgradeCTA({
  email: initialEmail,
  name: initialName,
}: {
  email: string;
  name: string;
}) {
  // Email/name normally come from the URL after registering on /training.
  // If they're missing (direct visit, refresh, bookmark) we collect them
  // inline so the button is never a dead end.
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [showFields, setShowFields] = useState(!initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout(emailValue: string, nameValue: string) {
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/training/upgrade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, name: nameValue }),
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

  function onClick() {
    if (!email) {
      setShowFields(true);
      return;
    }
    startCheckout(email, name);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startCheckout(email, name);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[420px] mx-auto">
      {showFields && (
        <form onSubmit={onSubmit} className="w-full space-y-2.5 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="w-full rounded-xl border border-ivory/15 bg-ivory/5 px-4 py-3 text-[15px] text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-brass focus:bg-ivory/10"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-ivory/15 bg-ivory/5 px-4 py-3 text-[15px] text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-brass focus:bg-ivory/10"
          />
        </form>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex w-full items-center justify-center rounded-full bg-brass text-ivory text-[14.5px] md:text-[15px] font-semibold tracking-[0.02em] px-8 py-[18px] shadow-[0_22px_50px_-18px_rgba(155,122,74,0.7)] hover:bg-[#8a6c3f] hover:-translate-y-[1px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 uppercase"
      >
        {loading ? "Loading checkout…" : "Click here to upgrade to VIP for $17"}
      </button>
      {error && (
        <p className="mt-3 text-[12.5px] text-[#ffb6a0]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
