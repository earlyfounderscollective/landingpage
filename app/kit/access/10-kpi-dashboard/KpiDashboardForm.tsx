"use client";

import { useMemo } from "react";
import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type Kpi = {
  id: string;
  name: string;
  current: string;
  target: string;
  unit: string; // "$", "%", "leads", etc.
  direction: "up" | "down";
  why_it_matters: string;
  last_updated: string;
};

export type KpiDashboardData = {
  cadence: "weekly" | "biweekly" | "monthly";
  kpis: Kpi[];
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function num(v: string): number {
  const n = Number(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function progressPct(k: Kpi): number {
  const c = num(k.current);
  const t = num(k.target);
  if (!t) return 0;
  if (k.direction === "down") {
    // lower is better: 100% if current <= target
    if (c <= t) return 100;
    return Math.max(0, Math.min(100, (t / c) * 100));
  }
  return Math.max(0, Math.min(100, (c / t) * 100));
}

const CADENCE_LABELS = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
} as const;

export function KpiDashboardForm({ initial }: { initial: KpiDashboardData }) {
  const { data, setData, status } = useKitAutoSave<KpiDashboardData>({
    moduleSlug: "10-kpi-dashboard",
    initial,
    isComplete: (d) => d.kpis.length >= 3,
  });

  const onTrack = useMemo(
    () => data.kpis.filter((k) => progressPct(k) >= 80).length,
    [data.kpis],
  );

  function addKpi() {
    setData((d) => ({
      ...d,
      kpis: [
        ...d.kpis,
        {
          id: newId(),
          name: "",
          current: "",
          target: "",
          unit: "",
          direction: "up",
          why_it_matters: "",
          last_updated: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
  }

  function removeKpi(id: string) {
    setData((d) => ({ ...d, kpis: d.kpis.filter((k) => k.id !== id) }));
  }

  function updateKpi(id: string, patch: Partial<Kpi>) {
    setData((d) => ({
      ...d,
      kpis: d.kpis.map((k) =>
        k.id === id
          ? {
              ...k,
              ...patch,
              last_updated:
                "current" in patch
                  ? new Date().toISOString().slice(0, 10)
                  : k.last_updated,
            }
          : k,
      ),
    }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {data.kpis.length} of 5 KPIs · {onTrack} on track
        </p>
        <SaveIndicator status={status} />
      </div>

      <section className="bg-white border border-line rounded-2xl p-5 mb-6">
        <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-mute mb-2">
          Review cadence
        </p>
        <div className="flex gap-2">
          {(["weekly", "biweekly", "monthly"] as const).map((c) => {
            const active = data.cadence === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setData((d) => ({ ...d, cadence: c }))}
                className={`text-[12.5px] font-semibold tracking-[0.04em] px-4 py-2 rounded-full border transition-colors ${
                  active
                    ? "bg-forest text-ivory border-forest"
                    : "bg-white text-ink/70 border-line hover:border-forest/40"
                }`}
              >
                {CADENCE_LABELS[c]}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {data.kpis.map((k) => {
          const pct = progressPct(k);
          const onTrack = pct >= 80;
          return (
            <article
              key={k.id}
              className={`bg-white border-2 rounded-2xl p-5 md:p-6 ${onTrack ? "border-forest/30" : "border-line"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <input
                  type="text"
                  value={k.name}
                  onChange={(e) => updateKpi(k.id, { name: e.target.value })}
                  placeholder="KPI name"
                  className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[16px] font-serif text-forest placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <button
                  type="button"
                  onClick={() => removeKpi(k.id)}
                  aria-label="Remove"
                  className="text-mute hover:text-[#9b2828] transition-colors w-6 h-6 inline-flex items-center justify-center"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="block">
                  <span className="block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute mb-1">
                    Current
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={k.current}
                    onChange={(e) => updateKpi(k.id, { current: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-[18px] font-serif text-forest tabular-nums placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  />
                </label>
                <label className="block">
                  <span className="block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute mb-1">
                    Target
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={k.target}
                    onChange={(e) => updateKpi(k.id, { target: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-[18px] font-serif text-brass tabular-nums placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  />
                </label>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
                <label className="block">
                  <span className="block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute mb-1">
                    Unit
                  </span>
                  <input
                    type="text"
                    value={k.unit}
                    onChange={(e) => updateKpi(k.id, { unit: e.target.value })}
                    placeholder="$, %, leads"
                    className="w-full rounded-md border border-line bg-white px-3 py-1.5 text-[13px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  />
                </label>
                <label className="block">
                  <span className="block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute mb-1">
                    Direction
                  </span>
                  <select
                    value={k.direction}
                    onChange={(e) => updateKpi(k.id, { direction: e.target.value as "up" | "down" })}
                    className="rounded-md border border-line bg-white px-3 py-1.5 text-[13px] text-forest focus:outline-none focus:border-brass"
                  >
                    <option value="up">Higher is better</option>
                    <option value="down">Lower is better</option>
                  </select>
                </label>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute">
                    Progress
                  </span>
                  <span className={`text-[11.5px] font-semibold tabular-nums ${onTrack ? "text-forest" : "text-mute"}`}>
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-[6px] bg-bone rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${onTrack ? "bg-forest" : "bg-brass"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <label className="block">
                <span className="block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-mute mb-1">
                  Why it matters
                </span>
                <input
                  type="text"
                  value={k.why_it_matters}
                  onChange={(e) => updateKpi(k.id, { why_it_matters: e.target.value })}
                  placeholder="What action this number unlocks"
                  className="w-full rounded-md border border-line bg-white px-3 py-1.5 text-[12.5px] text-ink/72 placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </label>

              <p className="mt-3 text-[10.5px] text-mute">
                Last updated: {k.last_updated || "—"}
              </p>
            </article>
          );
        })}
      </div>

      {data.kpis.length < 5 && (
        <button
          type="button"
          onClick={addKpi}
          className="w-full rounded-2xl border-2 border-dashed border-line bg-bone/40 px-6 py-5 text-[14px] font-medium text-forest hover:bg-bone/60 hover:border-forest/30 transition-colors"
        >
          + Add a KPI ({data.kpis.length} of 5)
        </button>
      )}

      <p className="mt-6 text-[12.5px] text-mute leading-[1.55]">
        Pick KPIs you can update in &lt;2 minutes a week. If a KPI takes longer than that to refresh, you'll skip it. Most early founders need: pipeline value, revenue closed, conversations had, and one quality metric (e.g. close rate).
      </p>
    </>
  );
}
