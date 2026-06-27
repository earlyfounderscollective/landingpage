"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type RoadmapPhase = {
  focus: string;
  one_number: string;
  actions: [string, string, string];
};

export type RoadmapData = {
  north_star: string;
  phase_1: RoadmapPhase;
  phase_2: RoadmapPhase;
  phase_3: RoadmapPhase;
  keep: string;
  kill: string;
};

const PHASES: {
  key: "phase_1" | "phase_2" | "phase_3";
  range: string;
  label: string;
}[] = [
  { key: "phase_1", range: "Days 1-30", label: "Build" },
  { key: "phase_2", range: "Days 31-60", label: "Sell" },
  { key: "phase_3", range: "Days 61-90", label: "Refine" },
];

export function RoadmapForm({ initial }: { initial: RoadmapData }) {
  const { data, setData, status } = useKitAutoSave<RoadmapData>({
    moduleSlug: "08-90-day-roadmap",
    initial,
    isComplete: (d) =>
      Boolean(
        d.north_star &&
          d.phase_1.focus &&
          d.phase_2.focus &&
          d.phase_3.focus &&
          d.keep &&
          d.kill,
      ),
  });

  function setPhase(
    key: "phase_1" | "phase_2" | "phase_3",
    patch: Partial<RoadmapPhase>,
  ) {
    setData((d) => ({
      ...d,
      [key]: { ...d[key], ...patch },
    }));
  }

  function setPhaseAction(
    key: "phase_1" | "phase_2" | "phase_3",
    index: 0 | 1 | 2,
    value: string,
  ) {
    setData((d) => {
      const phase = d[key];
      const nextActions = [...phase.actions] as [string, string, string];
      nextActions[index] = value;
      return { ...d, [key]: { ...phase, actions: nextActions } };
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          The plan
        </p>
        <SaveIndicator status={status} />
      </div>

      <section className="bg-forest text-ivory rounded-2xl p-6 md:p-7 mb-6">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-3">
          North star
        </p>
        <p className="text-[14px] text-ivory/72 mb-3 leading-[1.55]">
          One sentence. Where this business needs to be 90 days from now. Not a wish — a target you'd recognise if you hit it.
        </p>
        <textarea
          value={data.north_star}
          onChange={(e) =>
            setData((d) => ({ ...d, north_star: e.target.value }))
          }
          placeholder="$10K in committed revenue by Day 90. Three repeating clients. One referral channel that produces a lead every two weeks."
          rows={3}
          className="w-full rounded-xl border border-ivory/15 bg-ivory/8 px-4 py-3 text-[15px] text-ivory placeholder:text-ivory/35 focus:outline-none focus:border-brass resize-none leading-[1.55]"
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PHASES.map((p, i) => {
          const phase = data[p.key];
          return (
            <section
              key={p.key}
              className="bg-white border-2 border-line rounded-2xl p-5 md:p-6"
            >
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brass">
                  Phase {i + 1} · {p.range}
                </p>
                <span className="text-[10.5px] tracking-[0.14em] uppercase text-mute">
                  {p.label}
                </span>
              </div>

              <label className="block mb-3">
                <span className="block text-[11.5px] font-semibold text-forest mb-1.5">
                  Focus
                </span>
                <textarea
                  value={phase.focus}
                  onChange={(e) => setPhase(p.key, { focus: e.target.value })}
                  placeholder="What you're building in this 30 days"
                  rows={2}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-[13.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.45]"
                />
              </label>

              <label className="block mb-3">
                <span className="block text-[11.5px] font-semibold text-forest mb-1.5">
                  One number to hit
                </span>
                <input
                  type="text"
                  value={phase.one_number}
                  onChange={(e) =>
                    setPhase(p.key, { one_number: e.target.value })
                  }
                  placeholder="e.g. 10 conversations · 3 closed · $4K MRR"
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-[13.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </label>

              <div>
                <p className="block text-[11.5px] font-semibold text-forest mb-1.5">
                  Top 3 actions
                </p>
                <div className="space-y-1.5">
                  {([0, 1, 2] as const).map((idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[16px_1fr] gap-2 items-start"
                    >
                      <span className="text-[10px] text-brass mt-2.5 font-semibold tabular-nums">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={phase.actions[idx]}
                        onChange={(e) =>
                          setPhaseAction(p.key, idx, e.target.value)
                        }
                        placeholder={`Action ${idx + 1}`}
                        className="w-full rounded-md border border-line bg-white px-3 py-1.5 text-[13px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-2xl p-5 md:p-6">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
            Keep doing
          </p>
          <p className="text-[12.5px] text-mute mb-3 leading-[1.55]">
            The activities that are already creating revenue. Don't change them.
          </p>
          <textarea
            value={data.keep}
            onChange={(e) =>
              setData((d) => ({ ...d, keep: e.target.value }))
            }
            placeholder="The Saturday morning DM batch. Weekly referral asks. The 3-message proposal template."
            rows={5}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[13.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
          />
        </div>

        <div className="bg-white border-2 border-[#9b2828]/20 rounded-2xl p-5 md:p-6">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[#9b2828] mb-2">
            Kill this quarter
          </p>
          <p className="text-[12.5px] text-mute mb-3 leading-[1.55]">
            The activities you keep doing that don't move revenue. Be honest.
          </p>
          <textarea
            value={data.kill}
            onChange={(e) =>
              setData((d) => ({ ...d, kill: e.target.value }))
            }
            placeholder="Posting reels with no offer attached. Networking events that don't convert. The website rebuild that's been 'almost done' for 3 months."
            rows={5}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-[13.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
          />
        </div>
      </section>
    </>
  );
}
