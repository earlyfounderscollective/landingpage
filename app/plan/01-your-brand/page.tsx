"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePlanAutoSave } from "@/lib/use-plan-auto-save";
import { SaveStatus } from "@/components/plan/SaveStatus";
import {
  ColorRow,
  Example,
  Field,
  FileUploadStub,
  HandleGrid,
  MissionGrid,
  NameGrid,
  Select,
  Step,
  Task,
  TextArea,
  TextInput,
  ValuesList,
} from "@/components/plan/ui";

type Answers = {
  industry: string;
  problem: string;
  customer: string;
  mission: Record<string, string>;
  values: string[];
  brand_name: string;
  feeling: string;
  // task data
  names: string[];
  domain: string;
  handles: Record<string, string>;
  colors: { primary: string; bg: string; accent: string };
  asset_folder: string;
};

const initial: Answers = {
  industry: "",
  problem: "",
  customer: "",
  mission: {},
  values: [],
  brand_name: "",
  feeling: "",
  names: [],
  domain: "",
  handles: {},
  colors: { primary: "#23352D", bg: "#F7F2EA", accent: "#9B7A4A" },
  asset_folder: "",
};

function PreviewPane({ a }: { a: Answers }) {
  const missionSentence = useMemo(() => {
    const m = a.mission;
    if (!m.we_are && !m.we_provide) return null;
    const parts: string[] = [];
    if (m.we_are) parts.push(`We are ${m.we_are}`);
    if (m.we_provide) parts.push(`We provide ${m.we_provide}`);
    if (m.for) parts.push(`for ${m.for}`);
    if (m.who_want) parts.push(`who want ${m.who_want}`);
    if (m.launched) parts.push(`Launched in ${m.launched}`);
    return parts.join(". ") + ".";
  }, [a.mission]);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">
          {a.brand_name || "Your Brand"} · The Plan
        </span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">
          Ch. 01
        </span>
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">
        Chapter One
      </p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">
        Your Brand
      </h2>

      <dl className="space-y-4">
        {a.industry && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Industry
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.industry}
            </dd>
          </div>
        )}
        {a.problem && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              The problem we're solving
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px] not-italic">
                {a.problem}
              </em>
            </dd>
          </div>
        )}
        {a.customer && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Who it's for
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.customer}
            </dd>
          </div>
        )}
        {missionSentence && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Mission
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">
                {missionSentence}
              </em>
            </dd>
          </div>
        )}
        {a.values.filter(Boolean).length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Values we live by
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.6]">
              {a.values
                .filter(Boolean)
                .map((v, i) => `0${i + 1}. ${v}`)
                .join("   ")}
            </dd>
          </div>
        )}
        {a.feeling && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              How we want to be felt
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.feeling}
            </dd>
          </div>
        )}

        {/* Brand colors strip */}
        {(a.colors.primary || a.colors.accent) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-2">
              Brand palette
            </dt>
            <dd className="flex gap-2">
              <span
                className="h-9 w-9 rounded-md border border-black/10"
                style={{ background: a.colors.primary }}
                title={a.colors.primary}
              />
              <span
                className="h-9 w-9 rounded-md border border-black/10"
                style={{ background: a.colors.bg }}
                title={a.colors.bg}
              />
              <span
                className="h-9 w-9 rounded-md border border-black/10"
                style={{ background: a.colors.accent }}
                title={a.colors.accent}
              />
            </dd>
          </div>
        )}

        {a.domain && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Domain
            </dt>
            <dd className="text-[13.5px] text-ink">{a.domain}</dd>
          </div>
        )}
      </dl>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">
        2
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleOne() {
  const [a, setA] = useState<Answers>(initial);

  const update = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const { status, savedAt } = usePlanAutoSave({
    moduleSlug: "01-your-brand",
    answers: a,
    setAnswers: setA,
  });

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
      {/* LEFT: form */}
      <div className="px-6 md:px-12 py-10 md:py-12 lg:border-r border-line">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/plan"
            className="text-[12px] text-brass hover:text-forest"
          >
            ← All modules
          </Link>
          <SaveStatus status={status} savedAt={savedAt} />
        </div>

        <header className="mb-7">
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">
            01 · Module one of seven
          </p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">
            Your Brand
          </h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            Mission, target customer, values, name. This is the foundation
            everything else in your plan builds on. The goal isn't perfection.
            It's clarity.
          </p>
        </header>

        {/* Voice note from Oge */}
        <div className="bg-bone rounded-xl p-4 flex items-center gap-3.5 mb-8">
          <div className="h-[38px] w-[38px] rounded-full bg-forest text-ivory flex items-center justify-center shrink-0">
            <span className="ml-0.5 inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-ivory" />
          </div>
          <div className="flex-1 text-[12px] text-mute">
            <strong className="block font-serif italic text-forest font-normal text-[14px] mb-0.5">
              "Don't get cute. Get specific."
            </strong>
            A note from Oge — coming soon
          </div>
          <span className="text-[11px] text-mute tracking-[0.04em]">—:—</span>
        </div>

        {/* STEP 1 */}
        <Step number="Step 1" title="Define what you're building">
          <Field
            label="What industry are you in?"
            help="Pick the closest one. You can be more specific in the next questions."
          >
            <Select
              value={a.industry}
              onChange={(e) => update("industry", e.target.value)}
            >
              <option value="">— Choose —</option>
              <option>Service / consulting</option>
              <option>Product / e-commerce</option>
              <option>Software / SaaS</option>
              <option>Content / media</option>
              <option>Community / events</option>
              <option>Real estate / hospitality</option>
              <option>Hybrid</option>
            </Select>
          </Field>

          <Field
            label="What problem are you solving?"
            help="In 1–2 sentences. The real, specific version."
          >
            <TextArea
              value={a.problem}
              onChange={(e) => update("problem", e.target.value)}
              placeholder="What's actually happening for your customer right now that isn't working…"
            />
            <Example>
              Most service businesses lose 30% of leads to slow follow-up. We
              solve that with a 5-minute response system.
            </Example>
          </Field>

          <Field
            label="Who exactly are you solving it for?"
            help='Be specific. "Small business owners" is too broad. "Solo consultants in their first 2 years, billing $5–15k/mo, working without a team" is useful.'
          >
            <TextArea
              value={a.customer}
              onChange={(e) => update("customer", e.target.value)}
            />
          </Field>
        </Step>

        {/* STEP 2 */}
        <Step number="Step 2" title="Draft your mission">
          <p className="text-[13px] text-mute mb-3.5 leading-[1.5]">
            Fill each line. The point is to say what you do simply enough that
            someone outside your industry can repeat it.
          </p>
          <MissionGrid
            values={a.mission}
            onChange={(k, v) =>
              update("mission", { ...a.mission, [k]: v })
            }
          />
        </Step>

        {/* STEP 3 */}
        <Step number="Step 3" title="Pick 3–5 values you actually live by">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">
            Not what sounds good. The ones you'd lose customers over rather
            than violate.
          </p>
          <ValuesList
            values={a.values}
            onChange={(i, v) => {
              const next = [...a.values];
              next[i] = v;
              update("values", next);
            }}
          />
        </Step>

        {/* STEP 4 */}
        <Step number="Step 4" title="Name & feeling">
          <Field
            label="Your business name"
            help="Even if it's a placeholder. You can change it later."
          >
            <TextInput
              value={a.brand_name}
              onChange={(e) => update("brand_name", e.target.value)}
            />
          </Field>
          <Field
            label="What do you want people to feel when they encounter your brand?"
            help='Three to five feeling-words. "Calm. Grounded. Like I just stepped into the right room."'
          >
            <TextArea
              value={a.feeling}
              onChange={(e) => update("feeling", e.target.value)}
            />
          </Field>
        </Step>

        {/* STEP 5 — tactical tasks */}
        <Step number="Step 5" title="Do this in the next 7 days">
          <p className="text-[13px] text-mute mb-4 leading-[1.5]">
            Each task expands. Do the work right here so it lands in your Plan,
            not scattered across other tools.
          </p>

          <Task
            title="Brainstorm 10 potential brand names"
            sub="Quantity first. Don't judge them yet."
          >
            <NameGrid
              names={a.names}
              onChange={(i, v) => {
                const next = [...a.names];
                next[i] = v;
                update("names", next);
              }}
            />
          </Task>

          <Task
            title="Check name availability across networks"
            sub={
              <>
                For your top 3 picks. Helpers:{" "}
                <a
                  href="https://namechk.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brass hover:text-forest"
                >
                  namechk.com
                </a>{" "}
                ·{" "}
                <a
                  href="https://namemesh.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brass hover:text-forest"
                >
                  namemesh.com
                </a>
              </>
            }
          />

          <Task
            title="Secure your domain"
            sub="What domain did you actually buy?"
          >
            <TextInput
              value={a.domain}
              onChange={(e) => update("domain", e.target.value)}
              placeholder="yourbrand.com"
            />
          </Task>

          <Task
            title="Lock down social handles"
            sub="The ones you actually secured."
          >
            <HandleGrid
              values={a.handles}
              onChange={(k, v) =>
                update("handles", { ...a.handles, [k]: v })
              }
            />
          </Task>

          <Task
            title="Pick 3 brand colors"
            sub="Primary, background, accent. Goes straight into your Plan PDF cover."
          >
            <div className="grid grid-cols-3 gap-3">
              <ColorRow
                label="Primary"
                hex={a.colors.primary}
                onChange={(v) =>
                  update("colors", { ...a.colors, primary: v })
                }
              />
              <ColorRow
                label="Background"
                hex={a.colors.bg}
                onChange={(v) => update("colors", { ...a.colors, bg: v })}
              />
              <ColorRow
                label="Accent"
                hex={a.colors.accent}
                onChange={(v) =>
                  update("colors", { ...a.colors, accent: v })
                }
              />
            </div>
          </Task>

          <Task
            title="Upload your draft logo"
            sub="PNG or SVG. Under $200 designer is fine — Fiverr, 99designs, Canva."
          >
            <FileUploadStub helper="PNG, JPG, or SVG · up to 5 MB · transparent background preferred" />
          </Task>

          <Task
            title="Link to your brand asset folder"
            sub="Where you keep logo files, palette, fonts, photos. Notion or Drive both work."
          >
            <TextInput
              value={a.asset_folder}
              onChange={(e) => update("asset_folder", e.target.value)}
              placeholder="https://…"
            />
          </Task>
        </Step>

        {/* Footer */}
        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute">
            <strong className="text-forest">0 of 7</strong> tasks done · 0 of 7
            answers filled
          </p>
          <button
            type="button"
            disabled
            className="bg-bone text-mute px-7 py-3 rounded-full text-[14px] font-medium tracking-[0.01em] cursor-not-allowed"
          >
            Mark module complete
          </button>
        </div>

        <p className="text-[11px] uppercase tracking-[0.28em] text-mute/70 text-center mt-8">
          Auto-save · coming in v0.2
        </p>
      </div>

      {/* RIGHT: live preview */}
      <div className="px-6 md:px-12 py-10 md:py-12 bg-[#ece6d8] flex flex-col">
        <header className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
            Live preview
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-white border border-line px-3 py-1.5 rounded-md text-[11.5px] text-forest hover:bg-bone transition-colors"
              disabled
            >
              ↗ Full screen
            </button>
            <button
              type="button"
              className="bg-white border border-line px-3 py-1.5 rounded-md text-[11.5px] text-forest hover:bg-bone transition-colors"
              disabled
            >
              Export PDF
            </button>
          </div>
        </header>
        <PreviewPane a={a} />
      </div>
    </div>
  );
}
