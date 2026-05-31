"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlanAutoSave } from "@/lib/use-plan-auto-save";
import { SaveStatus } from "@/components/plan/SaveStatus";
import { MarkCompleteButton } from "@/components/plan/MarkCompleteButton";
import {
  Example,
  Field,
  FileUploadStub,
  Select,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type Competitor = {
  name: string;
  does_well: string;
  misses: string;
  price: string;
};

type Conversation = {
  who: string;
  takeaway: string;
};

type Answers = {
  customer_profile: string;
  problem: string;
  current_solution: string;
  price_willing: string;
  competitors: Competitor[];
  gap: string;
  market_size: string;
  first_100: string;
  // task data
  quotes: string[];
  conversations: Conversation[];
  hangouts: string[];
};

const initial: Answers = {
  customer_profile: "",
  problem: "",
  current_solution: "",
  price_willing: "",
  competitors: Array.from({ length: 3 }, () => ({
    name: "",
    does_well: "",
    misses: "",
    price: "",
  })),
  gap: "",
  market_size: "",
  first_100: "",
  quotes: Array(5).fill(""),
  conversations: Array.from({ length: 3 }, () => ({ who: "", takeaway: "" })),
  hangouts: Array(3).fill(""),
};

function PreviewPane({ a }: { a: Answers }) {
  const filledCompetitors = a.competitors.filter((c) => c.name);
  const filledConvos = a.conversations.filter((c) => c.who || c.takeaway);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">
          Your Brand · The Plan
        </span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">
          Ch. 02
        </span>
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">
        Chapter Two
      </p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">
        Your Market
      </h2>

      <dl className="space-y-4">
        {a.customer_profile && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              The customer we're building for
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.customer_profile}
            </dd>
          </div>
        )}
        {a.problem && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Their #1 problem
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">
                {a.problem}
              </em>
            </dd>
          </div>
        )}
        {a.current_solution && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              How they're solving it today
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.current_solution}
            </dd>
          </div>
        )}
        {a.price_willing && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              What they'd pay
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.price_willing}
            </dd>
          </div>
        )}

        {filledCompetitors.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-2">
              The landscape
            </dt>
            <dd className="text-[13px] text-ink leading-[1.5]">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9.5px] uppercase tracking-[0.18em] text-[#888]">
                    <th className="pb-1 pr-2 font-semibold">Competitor</th>
                    <th className="pb-1 pr-2 font-semibold">Strength</th>
                    <th className="pb-1 pr-2 font-semibold">Weakness</th>
                    <th className="pb-1 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filledCompetitors.map((c, i) => (
                    <tr key={i} className="border-t border-[#eee]">
                      <td className="py-1.5 pr-2 font-medium text-forest">
                        {c.name}
                      </td>
                      <td className="py-1.5 pr-2 text-[12.5px]">
                        {c.does_well}
                      </td>
                      <td className="py-1.5 pr-2 text-[12.5px]">{c.misses}</td>
                      <td className="py-1.5 text-[12.5px]">{c.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </dd>
          </div>
        )}

        {a.gap && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              The gap we'll fill
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">
                {a.gap}
              </em>
            </dd>
          </div>
        )}

        {a.market_size && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              How many of them exist
            </dt>
            <dd className="text-[13.5px] text-ink">{a.market_size}</dd>
          </div>
        )}

        {a.first_100 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              How we'll reach the first 100
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              {a.first_100}
            </dd>
          </div>
        )}

        {filledConvos.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              From the conversations
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.55] space-y-1.5">
              {filledConvos.map((c, i) => (
                <p key={i}>
                  <strong className="text-forest">{c.who || "—"}:</strong>{" "}
                  <em className="font-serif italic">{c.takeaway}</em>
                </p>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">
        4
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleTwo() {
  const [a, setA] = useState<Answers>(initial);
  const update = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const updateCompetitor = (
    i: number,
    field: keyof Competitor,
    v: string,
  ) => {
    const next = [...a.competitors];
    next[i] = { ...next[i], [field]: v };
    update("competitors", next);
  };

  const updateConvo = (i: number, field: keyof Conversation, v: string) => {
    const next = [...a.conversations];
    next[i] = { ...next[i], [field]: v };
    update("conversations", next);
  };

  const { status, savedAt } = usePlanAutoSave({
    moduleSlug: "02-your-market",
    answers: a,
    setAnswers: setA,
  });

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
      {/* LEFT */}
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
            02 · Module two of seven
          </p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">
            Your Market
          </h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            Who you're really for. Who else is in the room. Where the opening
            is. The point isn't to memorize a market report. It's to know your
            customer well enough to write copy that sounds like their voice.
          </p>
        </header>

        <div className="bg-bone rounded-xl p-4 flex items-center gap-3.5 mb-8">
          <div className="h-[38px] w-[38px] rounded-full bg-forest text-ivory flex items-center justify-center shrink-0">
            <span className="ml-0.5 inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-ivory" />
          </div>
          <div className="flex-1 text-[12px] text-mute">
            <strong className="block font-serif italic text-forest font-normal text-[14px] mb-0.5">
              A note from Oge
            </strong>
            Voice note coming soon
          </div>
          <span className="text-[11px] text-mute tracking-[0.04em]">—:—</span>
        </div>

        {/* STEP 1 */}
        <Step number="Step 1" title="Profile the customer you're really building for">
          <Field
            label="Describe your ideal customer in detail"
            help="If you could clone 100 of them, who exactly are they? Age range, work, financial state, what they watch and read, what their week looks like."
          >
            <TextArea
              rows={5}
              value={a.customer_profile}
              onChange={(e) => update("customer_profile", e.target.value)}
            />
          </Field>

          <Field
            label="What's their #1 problem right now?"
            help="The problem you specifically solve. Not their whole life."
          >
            <TextArea
              value={a.problem}
              onChange={(e) => update("problem", e.target.value)}
            />
          </Field>

          <Field
            label="How are they solving it today?"
            help='What workaround are they stuck with? "Doing nothing" counts as a workaround.'
          >
            <TextArea
              value={a.current_solution}
              onChange={(e) => update("current_solution", e.target.value)}
            />
            <Example>
              Mostly Googling, asking in Facebook groups, and trying to piece
              together free YouTube videos.
            </Example>
          </Field>

          <Field
            label="What would they pay to make this disappear?"
            help="Honest ballpark. If they'd pay $0, you don't have a customer yet."
          >
            <TextInput
              value={a.price_willing}
              onChange={(e) => update("price_willing", e.target.value)}
              placeholder="$X / one-time or $X / month"
            />
          </Field>
        </Step>

        {/* STEP 2 — competitors */}
        <Step number="Step 2" title="Map the competition">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">
            Three to five competitors. Be honest. The closer they are to what
            you're building, the more useful this is.
          </p>

          <div className="space-y-3">
            {a.competitors.map((c, i) => (
              <div
                key={i}
                className="bg-[#fdfbf6] border border-line rounded-[10px] p-3.5"
              >
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-brass font-semibold mb-2.5">
                  Competitor {i + 1}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Name / brand"
                    value={c.name}
                    onChange={(e) => updateCompetitor(i, "name", e.target.value)}
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                  <input
                    type="text"
                    placeholder="Their price"
                    value={c.price}
                    onChange={(e) => updateCompetitor(i, "price", e.target.value)}
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                  <input
                    type="text"
                    placeholder="What they do well"
                    value={c.does_well}
                    onChange={(e) =>
                      updateCompetitor(i, "does_well", e.target.value)
                    }
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                  <input
                    type="text"
                    placeholder="What they miss"
                    value={c.misses}
                    onChange={(e) =>
                      updateCompetitor(i, "misses", e.target.value)
                    }
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                </div>
              </div>
            ))}
            {a.competitors.length < 5 && (
              <button
                type="button"
                onClick={() =>
                  update("competitors", [
                    ...a.competitors,
                    { name: "", does_well: "", misses: "", price: "" },
                  ])
                }
                className="text-[12px] text-brass hover:text-forest font-medium"
              >
                + Add another competitor
              </button>
            )}
          </div>
        </Step>

        {/* STEP 3 */}
        <Step number="Step 3" title="Find the opening">
          <Field
            label="What's the gap you'd fill?"
            help="In one sentence. What does the room not have that your customer wants?"
          >
            <TextArea
              value={a.gap}
              onChange={(e) => update("gap", e.target.value)}
            />
          </Field>

          <Field
            label="Roughly how many of your ideal customers exist?"
            help="Educated guess. 500? 50,000? 5 million? Order of magnitude is what matters."
          >
            <TextInput
              value={a.market_size}
              onChange={(e) => update("market_size", e.target.value)}
              placeholder="~10,000"
            />
          </Field>

          <Field
            label="How would you reach the first 100?"
            help="Specific channels, communities, people. If you can't name them, you don't yet know your market."
          >
            <TextArea
              rows={4}
              value={a.first_100}
              onChange={(e) => update("first_100", e.target.value)}
            />
          </Field>
        </Step>

        {/* STEP 4 — tactical */}
        <Step number="Step 4" title="Do this in the next 7 days">
          <p className="text-[13px] text-mute mb-4 leading-[1.5]">
            Real conversations beat any report you can read. Do this work right
            here.
          </p>

          <Task
            title="Screenshot 3 competitor pricing pages"
            sub="So you can study what they actually charge for and how they describe it."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FileUploadStub helper="Competitor 1" />
              <FileUploadStub helper="Competitor 2" />
              <FileUploadStub helper="Competitor 3" />
            </div>
          </Task>

          <Task
            title="Pull 5 telling quotes from competitor reviews"
            sub="Look at 1-star and 5-star reviews. What people love and hate is what they need."
          >
            <div className="space-y-2">
              {a.quotes.map((q, i) => (
                <TextArea
                  key={i}
                  rows={2}
                  value={q}
                  onChange={(e) => {
                    const next = [...a.quotes];
                    next[i] = e.target.value;
                    update("quotes", next);
                  }}
                  placeholder={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </Task>

          <Task
            title="Have 3 conversations with real customers"
            sub="15 minutes each. Their words become your copy."
          >
            <div className="space-y-3">
              {a.conversations.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2"
                >
                  <input
                    type="text"
                    value={c.who}
                    onChange={(e) => updateConvo(i, "who", e.target.value)}
                    placeholder="Who you spoke to"
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                  <input
                    type="text"
                    value={c.takeaway}
                    onChange={(e) =>
                      updateConvo(i, "takeaway", e.target.value)
                    }
                    placeholder="One-line takeaway"
                    className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest"
                  />
                </div>
              ))}
            </div>
          </Task>

          <Task
            title="Subscribe to 3 places your customer hangs out"
            sub="Newsletter, podcast, subreddit, Discord, anywhere they gather. Be in the room they're already in."
          >
            <div className="space-y-2">
              {a.hangouts.map((h, i) => (
                <TextInput
                  key={i}
                  value={h}
                  onChange={(e) => {
                    const next = [...a.hangouts];
                    next[i] = e.target.value;
                    update("hangouts", next);
                  }}
                  placeholder="https://…"
                />
              ))}
            </div>
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute max-w-[260px] leading-[1.5]">
            When you're ready, mark this done. You can always come back and edit.
          </p>
          <MarkCompleteButton moduleSlug="02-your-market" />
        </div>

        <div className="flex justify-between mt-8">
          <Link
            href="/plan/01-your-brand"
            className="text-[12px] text-mute hover:text-forest"
          >
            ← Module 01 · Your Brand
          </Link>
          <Link
            href="/plan/03-your-offer"
            className="text-[12px] text-mute hover:text-forest"
          >
            Module 03 · Your Offer →
          </Link>
        </div>
      </div>

      {/* RIGHT */}
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
