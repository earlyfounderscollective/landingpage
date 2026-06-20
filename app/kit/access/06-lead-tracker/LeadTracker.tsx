"use client";

import { useMemo } from "react";
import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type Lead = {
  id: string;
  name: string;
  source: string;
  status: LeadStatus;
  value: string;
  next_step: string;
  next_date: string;
};

export type LeadTrackerData = {
  leads: Lead[];
};

type LeadStatus = "Lead" | "Warmed" | "Proposal" | "Closed" | "Lost";

const STATUS_OPTIONS: LeadStatus[] = ["Lead", "Warmed", "Proposal", "Closed", "Lost"];

const STATUS_COLORS: Record<LeadStatus, string> = {
  Lead: "bg-bone text-forest",
  Warmed: "bg-brass/15 text-brass",
  Proposal: "bg-[#5B7A6A]/15 text-[#3D5A4D]",
  Closed: "bg-forest text-ivory",
  Lost: "bg-ink/8 text-ink/50",
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function num(v: string): number {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function LeadTracker({ initial }: { initial: LeadTrackerData }) {
  const { data, setData, status } = useKitAutoSave<LeadTrackerData>({
    moduleSlug: "06-lead-tracker",
    initial,
    isComplete: (d) => d.leads.length >= 5,
  });

  const totals = useMemo(() => {
    let pipeline = 0;
    let closed = 0;
    let openCount = 0;
    let closedCount = 0;
    for (const l of data.leads) {
      const v = num(l.value);
      if (l.status === "Closed") {
        closed += v;
        closedCount += 1;
      } else if (l.status !== "Lost") {
        pipeline += v;
        openCount += 1;
      }
    }
    return { pipeline, closed, openCount, closedCount };
  }, [data.leads]);

  function addLead() {
    setData((d) => ({
      ...d,
      leads: [
        ...d.leads,
        {
          id: newId(),
          name: "",
          source: "",
          status: "Lead",
          value: "",
          next_step: "",
          next_date: "",
        },
      ],
    }));
  }

  function removeLead(id: string) {
    setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) }));
  }

  function updateLead(id: string, patch: Partial<Lead>) {
    setData((d) => ({
      ...d,
      leads: d.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {data.leads.length} {data.leads.length === 1 ? "lead" : "leads"}
        </p>
        <SaveIndicator status={status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Pipeline" value={`$${totals.pipeline.toLocaleString()}`} sub={`${totals.openCount} open`} />
        <StatTile label="Closed" value={`$${totals.closed.toLocaleString()}`} sub={`${totals.closedCount} won`} accent />
        <StatTile label="Total leads" value={String(data.leads.length)} sub="all-time" />
        <StatTile
          label="Win rate"
          value={
            totals.closedCount + totals.openCount + (data.leads.length - totals.closedCount - totals.openCount) > 0
              ? `${Math.round((totals.closedCount / data.leads.length) * 100)}%`
              : "—"
          }
          sub="of total"
        />
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_1.4fr_36px] gap-3 px-5 py-3 border-b border-line bg-bone/60 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
          <span>Name</span>
          <span>Source</span>
          <span>Status</span>
          <span className="text-right">Value</span>
          <span>Next step / date</span>
          <span />
        </div>

        {data.leads.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[15px] text-mute">
              No leads yet. Start by adding the people you reached out to in Module 05.
            </p>
            <button
              type="button"
              onClick={addLead}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-forest text-ivory px-5 py-3 text-[13px] font-medium hover:bg-ink transition-colors"
            >
              + Add your first lead
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-line/60">
            {data.leads.map((lead) => (
              <li key={lead.id} className="grid grid-cols-1 md:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_1.4fr_36px] gap-3 px-5 py-3.5 items-center">
                <input
                  type="text"
                  value={lead.name}
                  onChange={(e) => updateLead(lead.id, { name: e.target.value })}
                  placeholder="Carlos M."
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[14px] text-forest placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <input
                  type="text"
                  value={lead.source}
                  onChange={(e) => updateLead(lead.id, { source: e.target.value })}
                  placeholder="IG DM"
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13.5px] text-ink/72 placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <select
                  value={lead.status}
                  onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                  className={`w-full rounded-md border border-line/60 px-2 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] focus:outline-none focus:border-brass ${STATUS_COLORS[lead.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[13.5px] text-ink/50">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={lead.value}
                    onChange={(e) => updateLead(lead.id, { value: e.target.value })}
                    placeholder="3,200"
                    className="w-full rounded-md border border-transparent bg-transparent pl-5 pr-2 py-1.5 text-[14px] tabular-nums text-forest text-right placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                  />
                </div>
                <div className="grid grid-cols-[1.5fr_auto] gap-2">
                  <input
                    type="text"
                    value={lead.next_step}
                    onChange={(e) => updateLead(lead.id, { next_step: e.target.value })}
                    placeholder="Send proposal"
                    className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13.5px] text-ink/72 placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                  />
                  <input
                    type="date"
                    value={lead.next_date}
                    onChange={(e) => updateLead(lead.id, { next_date: e.target.value })}
                    className="rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[12.5px] text-ink/72 focus:outline-none focus:bg-bone/40 focus:border-line"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLead(lead.id)}
                  aria-label="Remove lead"
                  className="text-mute hover:text-[#9b2828] transition-colors w-7 h-7 inline-flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {data.leads.length > 0 && (
          <div className="px-5 py-4 border-t border-line bg-bone/40">
            <button
              type="button"
              onClick={addLead}
              className="text-[13px] font-medium text-forest hover:text-brass transition-colors"
            >
              + Add lead
            </button>
          </div>
        )}
      </div>

      <p className="mt-5 text-[12.5px] text-mute leading-[1.55]">
        Tip: review this every Friday for 15 minutes. Move stale leads forward or kill them. A "Lead" sitting for 3 weeks isn't a lead anymore.
      </p>
    </>
  );
}

function StatTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "bg-forest text-ivory border-forest" : "bg-white border-line"}`}>
      <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${accent ? "text-brass" : "text-mute"}`}>
        {label}
      </p>
      <p className={`mt-1.5 font-serif text-[22px] md:text-[24px] tabular-nums leading-none ${accent ? "text-ivory" : "text-forest"}`}>
        {value}
      </p>
      <p className={`mt-1 text-[11px] ${accent ? "text-ivory/65" : "text-mute"}`}>
        {sub}
      </p>
    </div>
  );
}
