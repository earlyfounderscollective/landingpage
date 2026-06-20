"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/kit/access/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        setErr("Something went wrong. Try again in a moment.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/kit/access/login?sent=1";
    } catch {
      setErr("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="text-[11.5px] font-semibold tracking-[0.18em] uppercase text-mute">
          Your email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] text-forest placeholder:text-ink/35 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
        />
      </label>
      {err && (
        <p className="text-[13px] text-[#9b2828]">{err}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest text-ivory py-4 rounded-full text-[14px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending link..." : "Send me a sign-in link →"}
      </button>
    </form>
  );
}
