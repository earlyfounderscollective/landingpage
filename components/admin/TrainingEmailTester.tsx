"use client";

import { useState } from "react";

const KINDS: { key: string; label: string; desc: string }[] = [
  {
    key: "registration",
    label: "Registration confirmation",
    desc: "Fires immediately when someone signs up via /training.",
  },
  {
    key: "reminder_24h",
    label: "24-hour reminder",
    desc: "Sent the day before the event (12-36h window).",
  },
  {
    key: "reminder_1h",
    label: "Day-of reminder",
    desc: "Sent on event day (0-12h window).",
  },
  {
    key: "replay_delivery",
    label: "Replay delivery",
    desc: "Sent within 24h after the event ends.",
  },
  {
    key: "kit_pitch",
    label: "Kit pitch (24h post)",
    desc: "Sent 24-48h after the event with the $47 kit upsell.",
  },
];

export function TrainingEmailTester({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState("Oge");
  const [vip, setVip] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function send(kind: string) {
    setBusy(kind);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/training/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, kind, vip }),
      });
      const json = await res.json();
      if (res.ok) {
        setMsg({ kind: "ok", text: `Sent ${kind} → ${email}` });
      } else {
        setMsg({ kind: "err", text: json.error || "Send failed" });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    } finally {
      setBusy(null);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-6 md:p-7 mt-10">
      <div className="mb-6">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
          Drip sequence — verify
        </p>
        <h2 className="font-serif text-[22px] md:text-[24px] text-forest leading-[1.2]">
          Send a test of each email.
        </h2>
        <p className="mt-2 text-[13.5px] text-mute leading-[1.55] max-w-[560px]">
          Fires the real Resend send with the current event data. Use to verify
          formatting, links, and deliverability before the cron runs against
          real registrants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 mb-5">
        <label className="block">
          <span className="block text-[11.5px] font-semibold tracking-[0.16em] uppercase text-mute mb-1">
            Send to
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-forest focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
          />
        </label>
        <label className="block">
          <span className="block text-[11.5px] font-semibold tracking-[0.16em] uppercase text-mute mb-1">
            Recipient first name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-forest focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
          />
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={vip}
            onChange={(e) => setVip(e.target.checked)}
            className="h-4 w-4 rounded border-line text-forest focus:ring-brass/30"
          />
          <span className="text-[13px] text-forest">VIP variant</span>
        </label>
      </div>

      <div className="space-y-2.5">
        {KINDS.map((k) => (
          <div
            key={k.key}
            className="flex items-center justify-between gap-3 bg-bone/40 border border-line/60 rounded-xl px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-forest">{k.label}</p>
              <p className="text-[12px] text-mute leading-[1.4]">{k.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => send(k.key)}
              disabled={busy !== null}
              className="shrink-0 bg-forest text-ivory px-4 py-2 rounded-full text-[11.5px] font-semibold tracking-[0.08em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
            >
              {busy === k.key ? "Sending…" : "Send test"}
            </button>
          </div>
        ))}
      </div>

      {msg && (
        <p
          className={`mt-4 text-[13px] ${msg.kind === "ok" ? "text-forest" : "text-[#9b2828]"}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
