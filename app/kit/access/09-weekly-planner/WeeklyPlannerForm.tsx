"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type DayPlan = {
  revenue: string;
  marketing: string;
  ops: string;
};

export type WeeklyPlannerData = {
  week_of: string;
  top_outcomes: [string, string, string];
  monday: DayPlan;
  tuesday: DayPlan;
  wednesday: DayPlan;
  thursday: DayPlan;
  friday: DayPlan;
  friday_review: string;
};

const DAYS: { key: keyof Omit<WeeklyPlannerData, "week_of" | "top_outcomes" | "friday_review">; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
];

const ROWS: { key: keyof DayPlan; label: string; sub: string }[] = [
  { key: "revenue", label: "Revenue", sub: "What I'll do to close money" },
  { key: "marketing", label: "Reach", sub: "What I'll do to be seen" },
  { key: "ops", label: "Build", sub: "What I'll improve in the business" },
];

export function WeeklyPlannerForm({ initial }: { initial: WeeklyPlannerData }) {
  const { data, setData, status } = useKitAutoSave<WeeklyPlannerData>({
    moduleSlug: "09-weekly-planner",
    initial,
    isComplete: (d) =>
      Boolean(
        d.week_of && d.top_outcomes.every(Boolean) && d.friday_review,
      ),
  });

  function setDay(day: typeof DAYS[number]["key"], row: keyof DayPlan, value: string) {
    setData((d) => ({
      ...d,
      [day]: { ...d[day], [row]: value },
    }));
  }

  function setOutcome(index: 0 | 1 | 2, value: string) {
    setData((d) => {
      const next = [...d.top_outcomes] as [string, string, string];
      next[index] = value;
      return { ...d, top_outcomes: next };
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          The week
        </p>
        <SaveIndicator status={status} />
      </div>

      <section className="bg-white border border-line rounded-2xl p-6 md:p-7 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:items-start">
          <label className="block">
            <span className="block text-[11.5px] font-semibold tracking-[0.16em] uppercase text-mute mb-1.5">
              Week of
            </span>
            <input
              type="date"
              value={data.week_of}
              onChange={(e) =>
                setData((d) => ({ ...d, week_of: e.target.value }))
              }
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] text-forest focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
            />
          </label>
          <div>
            <p className="block text-[11.5px] font-semibold tracking-[0.16em] uppercase text-mute mb-1.5">
              Top 3 outcomes for this week
            </p>
            <p className="text-[12.5px] text-mute mb-2 leading-[1.5]">
              If only these three happened, would you call the week a win?
            </p>
            <div className="space-y-1.5">
              {([0, 1, 2] as const).map((i) => (
                <div key={i} className="grid grid-cols-[20px_1fr] gap-2 items-center">
                  <span className="text-[11px] text-brass font-semibold tabular-nums">
                    0{i + 1}
                  </span>
                  <input
                    type="text"
                    value={data.top_outcomes[i]}
                    onChange={(e) => setOutcome(i, e.target.value)}
                    placeholder={`Outcome ${i + 1}`}
                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-[13.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-line rounded-2xl overflow-hidden mb-6">
        <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-bone/60 border-b border-line">
          <div className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
            Track
          </div>
          {DAYS.map((d) => (
            <div
              key={d.key}
              className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute text-center border-l border-line"
            >
              {d.label}
            </div>
          ))}
        </div>
        {ROWS.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-line/60 last:border-b-0"
          >
            <div className="px-3 py-3 bg-bone/30 border-r border-line/60">
              <p className="text-[12.5px] font-semibold text-forest leading-tight">
                {row.label}
              </p>
              <p className="text-[10.5px] text-mute leading-[1.4] mt-0.5">
                {row.sub}
              </p>
            </div>
            {DAYS.map((d) => (
              <div key={d.key} className="border-l border-line/60 first:border-l-0">
                <textarea
                  value={data[d.key][row.key]}
                  onChange={(e) => setDay(d.key, row.key, e.target.value)}
                  rows={3}
                  placeholder="—"
                  className="w-full h-full px-2.5 py-2 text-[12.5px] text-forest placeholder:text-ink/25 focus:outline-none focus:bg-bone/40 resize-none leading-[1.4] bg-transparent"
                />
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="bg-forest text-ivory rounded-2xl p-6 md:p-7">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
          Friday review
        </p>
        <p className="text-[12.5px] text-ivory/65 mb-3 leading-[1.55]">
          What actually happened? What didn't? What will you change Monday?
        </p>
        <textarea
          value={data.friday_review}
          onChange={(e) =>
            setData((d) => ({ ...d, friday_review: e.target.value }))
          }
          placeholder="The 10 cold DMs hit. The proposal didn't go out — pushed to Monday morning. Stop blocking Wednesday for 'admin' — it always gets eaten."
          rows={4}
          className="w-full rounded-md border border-ivory/15 bg-ivory/8 px-3 py-2.5 text-[14px] text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-brass resize-none leading-[1.55]"
        />
      </section>
    </>
  );
}
