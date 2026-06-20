"use client";

import { useState } from "react";

export function UpgradeCTA({ email, name }: { email: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    if (!email) {
      setError("Missing email. Reload from /training first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/training/upgrade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
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

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading || !email}
        className="flex w-full max-w-[420px] items-center justify-center rounded-full bg-brass text-ivory text-[14.5px] md:text-[15px] font-semibold tracking-[0.02em] px-8 py-[18px] shadow-[0_22px_50px_-18px_rgba(155,122,74,0.7)] hover:bg-[#8a6c3f] hover:-translate-y-[1px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 uppercase"
      >
        {loading ? "Loading checkout…" : "Click here to upgrade to VIP for $17"}
      </button>
      {error && (
        <p className="mt-3 text-[12.5px] text-[#a13a1a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
