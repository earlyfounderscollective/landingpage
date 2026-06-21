"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  cohortStartDate: string;
  cohortLabel: string;
  priceCents: number;
  originalPriceCents: number;
  isOpen: boolean;
  videoUrl: string;
};

export function BootcampEditor({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [data, setData] = useState({
    cohortStartDate: initial.cohortStartDate,
    cohortLabel: initial.cohortLabel,
    priceDollars: String(initial.priceCents / 100),
    originalPriceDollars: String(initial.originalPriceCents / 100),
    isOpen: initial.isOpen,
    videoUrl: initial.videoUrl,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function set<K extends keyof typeof data>(k: K, v: (typeof data)[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/bootcamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cohort_start_date: data.cohortStartDate || null,
          cohort_label: data.cohortLabel,
          price_cents: Math.round(Number(data.priceDollars) * 100),
          original_price_cents: Math.round(Number(data.originalPriceDollars) * 100),
          is_open: data.isOpen,
          video_url: data.videoUrl.trim() || null,
        }),
      });
      if (res.ok) {
        setMsg({ kind: "ok", text: "Saved." });
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        setMsg({ kind: "err", text: json.error || "Save failed." });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Cohort start date">
          <input
            type="date"
            value={data.cohortStartDate}
            onChange={(e) => set("cohortStartDate", e.target.value)}
            className={inputCls}
          />
          <Hint>The date the first session happens.</Hint>
        </Field>
        <Field label="Cohort pill label">
          <input
            type="text"
            value={data.cohortLabel}
            onChange={(e) => set("cohortLabel", e.target.value)}
            className={inputCls}
            placeholder="Next cohort begins July 14"
          />
          <Hint>Shown under the hero CTA.</Hint>
        </Field>
        <Field label="Sale price (USD)">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest">$</span>
            <input
              type="number"
              step="1"
              value={data.priceDollars}
              onChange={(e) => set("priceDollars", e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>
          <Hint>What customers pay.</Hint>
        </Field>
        <Field label="Original (anchor) price">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest">$</span>
            <input
              type="number"
              step="1"
              value={data.originalPriceDollars}
              onChange={(e) => set("originalPriceDollars", e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>
          <Hint>Shown struck-through next to the sale price.</Hint>
        </Field>
      </div>

      <Field label="Hero video URL (optional)">
        <input
          type="url"
          value={data.videoUrl}
          onChange={(e) => set("videoUrl", e.target.value)}
          className={inputCls}
          placeholder="https://www.youtube.com/watch?v=… or Vimeo / Loom / direct mp4"
        />
        <Hint>
          Paste a YouTube, Vimeo, Loom, or mp4 URL — it'll embed under the
          hero subhead. Leave blank to hide the slot.
        </Hint>
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.isOpen}
          onChange={(e) => set("isOpen", e.target.checked)}
          className="h-5 w-5 rounded border-line text-forest focus:ring-brass/30"
        />
        <span className="text-[14px] text-forest">
          Reservations open — uncheck to disable checkout temporarily
        </span>
      </label>

      <div className="flex items-center gap-4 pt-2 border-t border-line/60">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-forest text-ivory px-6 py-3 rounded-full text-[13px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {msg && (
          <p
            className={`text-[13px] ${msg.kind === "ok" ? "text-forest" : "text-[#9b2828]"}`}
          >
            {msg.text}
          </p>
        )}
        <a
          href="/bootcamp"
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-[12.5px] text-mute hover:text-forest underline decoration-line"
        >
          Preview /bootcamp ↗
        </a>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold tracking-[0.18em] uppercase text-mute mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 block text-[12px] text-mute leading-[1.5]">
      {children}
    </span>
  );
}
