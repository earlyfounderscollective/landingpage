"use client";

import { useState } from "react";

export function CheckoutButton({
  source,
  label,
  accent,
}: {
  source: string;
  label: string;
  accent?: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setErr("Name and email required.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/bootcamp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          source,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setErr(json.error || "Couldn't start checkout. Try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setErr("Network error. Try again.");
      setSubmitting(false);
    }
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-[13.5px] font-semibold tracking-[0.06em] uppercase transition-colors shadow-[0_22px_50px_-18px_rgba(155,122,74,0.65)] ${
          accent
            ? "bg-brass text-ivory hover:bg-[#8a6c3f]"
            : "bg-brass text-ivory hover:bg-[#8a6c3f]"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-[440px] mx-auto bg-ivory rounded-2xl p-6 border border-line/60 shadow-[0_18px_50px_-25px_rgba(35,53,45,0.35)] text-left space-y-3"
    >
      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
        Reserve your seat
      </p>
      <label className="block">
        <span className="block text-[12px] font-medium text-forest mb-1">Full name</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
        />
      </label>
      <label className="block">
        <span className="block text-[12px] font-medium text-forest mb-1">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
        />
      </label>
      {err && <p className="text-[13px] text-[#9b2828]">{err}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest text-ivory py-4 rounded-full text-[13.5px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
      >
        {submitting ? "Opening checkout…" : "Continue to secure checkout →"}
      </button>
      <p className="text-[11px] text-mute text-center">
        Secure payment via Stripe. 14-day money-back guarantee.
      </p>
    </form>
  );
}
