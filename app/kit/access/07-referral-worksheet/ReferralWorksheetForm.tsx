"use client";

import { useMemo } from "react";
import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type ReferralPerson = {
  id: string;
  name: string;
  relationship: string;
  why_they_could_refer: string;
  status: "not_asked" | "asked" | "yes" | "no";
  outcome: string;
};

export type ReferralData = {
  ask_offer: string;
  who_you_target: string;
  people: ReferralPerson[];
};

const STATUS_OPTIONS: ReferralPerson["status"][] = [
  "not_asked",
  "asked",
  "yes",
  "no",
];

const STATUS_LABELS: Record<ReferralPerson["status"], string> = {
  not_asked: "Not asked",
  asked: "Asked",
  yes: "Yes — referred",
  no: "No",
};

const STATUS_COLORS: Record<ReferralPerson["status"], string> = {
  not_asked: "bg-bone text-forest",
  asked: "bg-brass/15 text-brass",
  yes: "bg-forest text-ivory",
  no: "bg-ink/8 text-ink/50",
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ReferralWorksheetForm({ initial }: { initial: ReferralData }) {
  const { data, setData, status } = useKitAutoSave<ReferralData>({
    moduleSlug: "07-referral-worksheet",
    initial,
    isComplete: (d) =>
      Boolean(d.ask_offer && d.who_you_target) && d.people.length >= 5,
  });

  const totals = useMemo(() => {
    let asked = 0;
    let yes = 0;
    for (const p of data.people) {
      if (p.status !== "not_asked") asked += 1;
      if (p.status === "yes") yes += 1;
    }
    return { asked, yes, total: data.people.length };
  }, [data.people]);

  function setField<K extends keyof ReferralData>(k: K, v: ReferralData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function addPerson() {
    setData((d) => ({
      ...d,
      people: [
        ...d.people,
        {
          id: newId(),
          name: "",
          relationship: "",
          why_they_could_refer: "",
          status: "not_asked",
          outcome: "",
        },
      ],
    }));
  }

  function removePerson(id: string) {
    setData((d) => ({ ...d, people: d.people.filter((p) => p.id !== id) }));
  }

  function updatePerson(id: string, patch: Partial<ReferralPerson>) {
    setData((d) => ({
      ...d,
      people: d.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          The setup
        </p>
        <SaveIndicator status={status} />
      </div>

      <section className="bg-white border border-line rounded-2xl p-6 md:p-7 mb-6 space-y-5">
        <label className="block">
          <span className="block font-serif text-[18px] md:text-[19px] text-forest mb-2 leading-[1.3]">
            Who do you want them to refer to you?
          </span>
          <span className="block text-[13px] text-mute mb-2.5 leading-[1.5]">
            One sentence describing your ideal customer. The clearer this is, the easier it is for someone to think of a match.
          </span>
          <textarea
            value={data.who_you_target}
            onChange={(e) => setField("who_you_target", e.target.value)}
            placeholder="Real estate agents in Houston who are prepping listings under $500K"
            rows={2}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
          />
        </label>

        <label className="block">
          <span className="block font-serif text-[18px] md:text-[19px] text-forest mb-2 leading-[1.3]">
            What will you offer in return?
          </span>
          <span className="block text-[13px] text-mute mb-2.5 leading-[1.5]">
            People refer when there's something in it for them — or when they trust you completely. Decide what you're offering before you ask.
          </span>
          <textarea
            value={data.ask_offer}
            onChange={(e) => setField("ask_offer", e.target.value)}
            placeholder="15% commission on first job, a thank-you bottle, or a free service for them — pick what feels natural."
            rows={2}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
          />
        </label>
      </section>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatTile label="In list" value={String(totals.total)} sub="people" />
        <StatTile
          label="Asked"
          value={String(totals.asked)}
          sub={`of ${totals.total}`}
          accent
        />
        <StatTile label="Yes" value={String(totals.yes)} sub="referred" />
      </div>

      <section className="bg-white border border-line rounded-2xl overflow-hidden mb-6">
        <header className="px-5 py-3 border-b border-line bg-bone/60">
          <p className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-mute">
            People who could refer you
          </p>
        </header>
        {data.people.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[14px] text-mute mb-4">
              Inventory the people you know who serve your target customer (or
              know them). Aim for at least 10.
            </p>
            <button
              type="button"
              onClick={addPerson}
              className="inline-flex items-center justify-center rounded-full bg-forest text-ivory px-5 py-3 text-[13px] font-medium hover:bg-ink transition-colors"
            >
              + Add your first
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-line/60">
            {data.people.map((p) => (
              <li key={p.id} className="px-5 py-4 grid grid-cols-1 md:grid-cols-[1.1fr_1.2fr_1.4fr_1fr_30px] gap-3 md:items-start">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePerson(p.id, { name: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-md border border-transparent px-2 py-1.5 text-[14px] text-forest placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <input
                  type="text"
                  value={p.relationship}
                  onChange={(e) => updatePerson(p.id, { relationship: e.target.value })}
                  placeholder="How you know them"
                  className="w-full rounded-md border border-transparent px-2 py-1.5 text-[13.5px] text-ink/72 placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <input
                  type="text"
                  value={p.why_they_could_refer}
                  onChange={(e) => updatePerson(p.id, { why_they_could_refer: e.target.value })}
                  placeholder="Why they could refer"
                  className="w-full rounded-md border border-transparent px-2 py-1.5 text-[13.5px] text-ink/72 placeholder:text-ink/30 focus:outline-none focus:bg-bone/40 focus:border-line"
                />
                <select
                  value={p.status}
                  onChange={(e) => updatePerson(p.id, { status: e.target.value as ReferralPerson["status"] })}
                  className={`w-full rounded-md border border-line/60 px-2 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] focus:outline-none focus:border-brass ${STATUS_COLORS[p.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removePerson(p.id)}
                  aria-label="Remove"
                  className="text-mute hover:text-[#9b2828] transition-colors w-6 h-6 inline-flex items-center justify-center justify-self-end"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        {data.people.length > 0 && (
          <div className="px-5 py-3 border-t border-line bg-bone/40">
            <button
              type="button"
              onClick={addPerson}
              className="text-[13px] font-medium text-forest hover:text-brass transition-colors"
            >
              + Add another
            </button>
          </div>
        )}
      </section>

      <p className="text-[12.5px] text-mute leading-[1.55]">
        Tip: Don't wait for the perfect ask — copy the message from Module 04 — Prompt 08 (Referral request) and start. Three asks today beats ten on a list.
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
      <p className={`mt-1.5 font-serif text-[24px] tabular-nums leading-none ${accent ? "text-ivory" : "text-forest"}`}>
        {value}
      </p>
      <p className={`mt-1 text-[11px] ${accent ? "text-ivory/65" : "text-mute"}`}>{sub}</p>
    </div>
  );
}
