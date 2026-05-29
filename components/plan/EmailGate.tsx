"use client";

import { useEffect, useState } from "react";

type Saved = { projectId: string; email: string; name: string };

const STORAGE_KEY = "efc:plan:saved";

export function EmailGate() {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/plan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, _gotcha: honey }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Try again.");
      }
      const next: Saved = { projectId: data.projectId, email, name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onSwitch() {
    localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setName("");
    setEmail("");
    setError("");
  }

  if (!loaded) {
    return <div className="h-[90px] mb-8" />;
  }

  if (saved) {
    return (
      <div className="bg-bone border border-line rounded-[14px] px-5 py-4 flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-0.5">
            Auto-saving
          </p>
          <p className="text-[13.5px] text-forest">
            Your Plan is saved as <strong className="font-medium">{saved.email}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitch}
          className="text-[12px] text-mute hover:text-forest underline underline-offset-2"
        >
          Switch account
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-bone border border-line rounded-[14px] p-5 md:p-6 mb-8"
    >
      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-1.5">
        Save your work
      </p>
      <p className="font-serif text-[20px] md:text-[22px] text-forest leading-[1.25] mb-2 tracking-[-0.01em]">
        Drop your name and email so your answers stay saved as you go.
      </p>
      <p className="text-[13px] text-mute mb-4 leading-[1.55]">
        One welcome email from Oge. No spam. You can come back any time and pick up
        where you left off.
      </p>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        className="absolute -left-[9999px] w-0 h-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="px-3.5 py-3 bg-white border border-line rounded-md text-[14px] focus:outline-none focus:border-forest"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="px-3.5 py-3 bg-white border border-line rounded-md text-[14px] focus:outline-none focus:border-forest"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="bg-forest text-ivory px-5 py-3 rounded-md text-[13.5px] font-medium hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Saving…" : "Save my Plan →"}
        </button>
      </div>

      {error && (
        <p className="text-[12.5px] text-[#a13a1a] mt-3" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
