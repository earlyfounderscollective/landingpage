"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";
import type { KitModuleSlug } from "@/lib/kit-modules";

export type GuideDecision = {
  id: string;
  question: string;
  hint?: string;
  options: { value: string; label: string; sub?: string; recommended?: boolean }[];
};

export type GuideStepGroup = {
  title: string;
  description?: string;
  steps: {
    id: string;
    label: string;
    hint?: string;
    link?: { label: string; href: string };
  }[];
};

export type GuideTool = {
  name: string;
  url?: string;
  tag?: string; // "Recommended" / "Free tier" / "$10/mo"
  why: string;
};

export type GuideToolGroup = {
  title: string;
  description?: string;
  tools: GuideTool[];
};

export type GuideConfig = {
  slug: KitModuleSlug;
  decisions?: GuideDecision[];
  steps?: GuideStepGroup[];
  tools?: GuideToolGroup[];
  closing?: string;
};

export type GuideData = {
  decisions: Record<string, string>;
  checked: Record<string, boolean>;
  notes: string;
};

export const GUIDE_DEFAULT: GuideData = {
  decisions: {},
  checked: {},
  notes: "",
};

export function GuideModule({
  config,
  initial,
}: {
  config: GuideConfig;
  initial: GuideData;
}) {
  const totalSteps = (config.steps ?? []).reduce(
    (acc, g) => acc + g.steps.length,
    0,
  );

  const { data, setData, status } = useKitAutoSave<GuideData>({
    moduleSlug: config.slug,
    initial,
    isComplete: (d) => {
      const doneCount = Object.values(d.checked).filter(Boolean).length;
      const decisionCount = Object.values(d.decisions).filter(Boolean).length;
      const expectedDecisions = config.decisions?.length ?? 0;
      return (
        doneCount >= totalSteps &&
        decisionCount >= expectedDecisions
      );
    },
  });

  const doneCount = Object.values(data.checked).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  function toggle(id: string) {
    setData((d) => ({
      ...d,
      checked: { ...d.checked, [id]: !d.checked[id] },
    }));
  }

  function setDecision(id: string, value: string) {
    setData((d) => ({ ...d, decisions: { ...d.decisions, [id]: value } }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {totalSteps > 0
            ? `${doneCount} of ${totalSteps} steps · ${pct}%`
            : "Walk through this guide"}
        </p>
        <SaveIndicator status={status} />
      </div>

      {totalSteps > 0 && (
        <div className="h-[5px] bg-bone rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-gradient-to-r from-[#9B7A4A] to-[#B59164] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* DECISIONS */}
      {config.decisions && config.decisions.length > 0 && (
        <section className="space-y-8 mb-12">
          {config.decisions.map((d) => (
            <div key={d.id}>
              <h3 className="font-serif text-[20px] md:text-[22px] text-forest leading-[1.25] mb-1.5">
                {d.question}
              </h3>
              {d.hint && (
                <p className="text-[13.5px] text-mute leading-[1.55] mb-4">
                  {d.hint}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {d.options.map((opt) => {
                  const active = data.decisions[d.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDecision(d.id, opt.value)}
                      className={`text-left rounded-2xl border-2 p-5 transition-all relative ${
                        active
                          ? "border-forest bg-forest/5"
                          : "border-line bg-white hover:border-forest/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            active ? "border-forest bg-forest" : "border-line bg-white"
                          }`}
                        >
                          {active && (
                            <span className="h-2 w-2 rounded-full bg-ivory" />
                          )}
                        </span>
                        <div className="flex-1">
                          <p
                            className={`font-serif text-[16px] md:text-[17px] leading-[1.3] ${active ? "text-forest" : "text-ink/80"}`}
                          >
                            {opt.label}
                          </p>
                          {opt.sub && (
                            <p className="mt-1 text-[12.5px] text-mute leading-[1.5]">
                              {opt.sub}
                            </p>
                          )}
                        </div>
                        {opt.recommended && (
                          <span className="shrink-0 text-[9.5px] font-semibold tracking-[0.14em] uppercase bg-brass text-ivory px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* STEPS */}
      {config.steps && config.steps.length > 0 && (
        <section className="space-y-8 mb-12">
          {config.steps.map((g) => (
            <div key={g.title}>
              <h3 className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
                {g.title}
              </h3>
              {g.description && (
                <p className="text-[13.5px] text-mute leading-[1.55] mb-4">
                  {g.description}
                </p>
              )}
              <ul className="space-y-3">
                {g.steps.map((s) => {
                  const isDone = Boolean(data.checked[s.id]);
                  return (
                    <li
                      key={s.id}
                      className={`bg-white border border-line rounded-xl p-4 md:p-5 transition-all ${isDone ? "opacity-65" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(s.id)}
                        className="w-full flex items-start gap-3 text-left"
                      >
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 ${
                            isDone
                              ? "bg-forest border-forest"
                              : "bg-white border-line hover:border-forest/40"
                          }`}
                        >
                          {isDone && (
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6.5L4.5 9L10 3"
                                stroke="#F7F2EA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1">
                          <p
                            className={`font-serif text-[16px] leading-[1.35] ${isDone ? "line-through text-ink/50" : "text-forest"}`}
                          >
                            {s.label}
                          </p>
                          {s.hint && (
                            <p className="mt-1 text-[13px] text-mute leading-[1.5]">
                              {s.hint}
                            </p>
                          )}
                          {s.link && (
                            <a
                              href={s.link.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 inline-flex items-center text-[12.5px] text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                            >
                              {s.link.label} ↗
                            </a>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* TOOLS */}
      {config.tools && config.tools.length > 0 && (
        <section className="space-y-7 mb-12">
          {config.tools.map((g) => (
            <div key={g.title}>
              <h3 className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
                {g.title}
              </h3>
              {g.description && (
                <p className="text-[13.5px] text-mute leading-[1.55] mb-4">
                  {g.description}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {g.tools.map((t) => (
                  <div
                    key={t.name}
                    className="bg-bone border border-line/60 rounded-xl p-4 md:p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      {t.url ? (
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-serif text-[17px] text-forest hover:text-brass underline decoration-line underline-offset-2"
                        >
                          {t.name}
                        </a>
                      ) : (
                        <span className="font-serif text-[17px] text-forest">
                          {t.name}
                        </span>
                      )}
                      {t.tag && (
                        <span className="shrink-0 text-[10px] font-semibold tracking-[0.14em] uppercase text-brass">
                          {t.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[13.5px] text-ink/72 leading-[1.55]">
                      {t.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CLOSING */}
      {config.closing && (
        <div className="bg-forest text-ivory rounded-2xl p-6 md:p-7 mb-10">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-2">
            One more thing
          </p>
          <p className="text-[14.5px] leading-[1.65] text-ivory/85">
            {config.closing}
          </p>
        </div>
      )}

      {/* NOTES */}
      <label className="block">
        <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-mute mb-2">
          Your notes
        </span>
        <textarea
          value={data.notes}
          onChange={(e) =>
            setData((d) => ({ ...d, notes: e.target.value }))
          }
          rows={4}
          placeholder="Decisions, blockers, things to come back to..."
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
        />
      </label>
    </>
  );
}
