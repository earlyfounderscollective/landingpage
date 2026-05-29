"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlanAutoSave } from "@/lib/use-plan-auto-save";
import { SaveStatus } from "@/components/plan/SaveStatus";
import {
  Field,
  FileUploadStub,
  Select,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type Answers = {
  vision: string;
  one_year: string;
  ninety_day: string;
  revenue_math: string;
  fixed_costs: string;
  runway_months: string;
  runway_notes: string;
  team_today: string;
  next_hire: string;
  next_hire_why: string;
  top_risk: string;
  risk_plan: string;
  // tasks
  entity: string;
  bank: string;
  bookkeeping: string;
  spreadsheet_url: string;
  operator_hour: string;
  kpis: string[];
};

const initial: Answers = {
  vision: "",
  one_year: "",
  ninety_day: "",
  revenue_math: "",
  fixed_costs: "",
  runway_months: "",
  runway_notes: "",
  team_today: "",
  next_hire: "",
  next_hire_why: "",
  top_risk: "",
  risk_plan: "",
  entity: "",
  bank: "",
  bookkeeping: "",
  spreadsheet_url: "",
  operator_hour: "",
  kpis: ["", "", ""],
};

function PreviewPane({ a }: { a: Answers }) {
  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">Your Brand · The Plan</span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">Ch. 04</span>
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">Chapter Four</p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">The Operating Plan</h2>

      <dl className="space-y-4">
        {a.vision && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Vision</dt>
            <dd className="text-[13.5px] leading-[1.5]"><em className="font-serif italic text-forest text-[15.5px]">{a.vision}</em></dd>
          </div>
        )}
        {(a.one_year || a.ninety_day) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Goals</dt>
            <dd className="text-[13.5px] leading-[1.5] space-y-1">
              {a.one_year && <p><strong className="text-forest">One year:</strong> {a.one_year}</p>}
              {a.ninety_day && <p><strong className="text-forest">90 days:</strong> {a.ninety_day}</p>}
            </dd>
          </div>
        )}
        {a.revenue_math && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">How we make money</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.revenue_math}</dd>
          </div>
        )}
        {(a.fixed_costs || a.runway_months) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">The math</dt>
            <dd className="text-[13.5px] leading-[1.5] space-y-1">
              {a.fixed_costs && <p><strong className="text-forest">Monthly fixed:</strong> {a.fixed_costs}</p>}
              {a.runway_months && <p><strong className="text-forest">Runway:</strong> {a.runway_months} months. {a.runway_notes}</p>}
            </dd>
          </div>
        )}
        {a.team_today && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Team today</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.team_today}</dd>
          </div>
        )}
        {a.next_hire && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Next hire</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              <strong className="text-forest">{a.next_hire}.</strong> {a.next_hire_why}
            </dd>
          </div>
        )}
        {a.top_risk && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">The risk we're watching</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              <em className="font-serif italic text-forest">{a.top_risk}</em>
              {a.risk_plan && <p className="text-mute text-[12.5px] mt-1">Plan: {a.risk_plan}</p>}
            </dd>
          </div>
        )}
        {(a.entity || a.bank) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Operating set-up</dt>
            <dd className="text-[13px] leading-[1.5] space-y-0.5">
              {a.entity && <p>Entity: {a.entity}</p>}
              {a.bank && <p>Banking: {a.bank}</p>}
              {a.bookkeeping && <p>Bookkeeping: {a.bookkeeping}</p>}
              {a.operator_hour && <p>Operator hour: {a.operator_hour}</p>}
            </dd>
          </div>
        )}
        {a.kpis.filter(Boolean).length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">What we check every Monday</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              {a.kpis.filter(Boolean).map((k, i) => <p key={i}>0{i + 1}. {k}</p>)}
            </dd>
          </div>
        )}
      </dl>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">11</p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleFour() {
  const [a, setA] = useState<Answers>(initial);
  function update<K extends keyof Answers>(k: K, v: Answers[K]) {
    setA(p => ({ ...p, [k]: v }));
  }
  const { status, savedAt } = usePlanAutoSave({
    moduleSlug: "04-your-plan",
    answers: a,
    setAnswers: setA,
  });

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <div className="px-6 md:px-12 py-10 md:py-12 lg:border-r border-line">
        <div className="flex items-center justify-between mb-5">
          <Link href="/plan" className="text-[12px] text-brass hover:text-forest">← All modules</Link>
          <SaveStatus status={status} savedAt={savedAt} />
        </div>
        <header className="mb-7">
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">04 · Module four of seven</p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">Your Plan</h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            The operating doc. Vision, goals, money, team, risk. The center of gravity for everything else.
          </p>
        </header>

        <div className="bg-bone rounded-xl p-4 flex items-center gap-3.5 mb-8">
          <div className="h-[38px] w-[38px] rounded-full bg-forest text-ivory flex items-center justify-center shrink-0">
            <span className="ml-0.5 inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-ivory" />
          </div>
          <div className="flex-1 text-[12px] text-mute">
            <strong className="block font-serif italic text-forest font-normal text-[14px] mb-0.5">A note from Oge</strong>
            Voice note coming soon
          </div>
          <span className="text-[11px] text-mute tracking-[0.04em]">—:—</span>
        </div>

        <Step number="Step 1" title="Direction">
          <Field label="What's the vision?" help="Where are you taking this? Not the metrics. The state of the world if you succeed.">
            <TextArea rows={4} value={a.vision} onChange={e => update("vision", e.target.value)} />
          </Field>
          <Field label="One-year goal" help="One specific, measurable thing you want done by [date].">
            <TextArea value={a.one_year} onChange={e => update("one_year", e.target.value)} />
          </Field>
          <Field label="90-day goal" help="Smaller, immediate. What does success look like 90 days from today?">
            <TextArea value={a.ninety_day} onChange={e => update("ninety_day", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 2" title="Operating model">
          <Field label="How do you actually make money?" help="Pricing × volume = revenue. The math, not the dream.">
            <TextArea value={a.revenue_math} onChange={e => update("revenue_math", e.target.value)} />
          </Field>
          <Field label="Monthly fixed costs" help="Rent, software, contractors. The things that hit every month.">
            <TextInput value={a.fixed_costs} onChange={e => update("fixed_costs", e.target.value)} placeholder="$X / month" />
          </Field>
          <Field label="Current runway (months)" help="Honest. Number of months you can keep operating without new revenue.">
            <TextInput value={a.runway_months} onChange={e => update("runway_months", e.target.value)} placeholder="6" />
          </Field>
          <Field label="Runway notes" help="Anything that makes that number truer (e.g. side income, expected MRR).">
            <TextArea value={a.runway_notes} onChange={e => update("runway_notes", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 3" title="Team">
          <Field label="Who's on the team today?" help="Just you? You + contractors? Be specific about who does what.">
            <TextArea value={a.team_today} onChange={e => update("team_today", e.target.value)} />
          </Field>
          <Field label="Next role to hire" help="If revenue went up by enough, what would you hire first?">
            <TextInput value={a.next_hire} onChange={e => update("next_hire", e.target.value)} placeholder="A part-time community manager" />
          </Field>
          <Field label="Why that role?">
            <TextArea value={a.next_hire_why} onChange={e => update("next_hire_why", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 4" title="Risks">
          <Field label="The #1 risk that could kill this" help="Be honest. Founders who pretend there's no risk are the ones risk kills.">
            <TextArea value={a.top_risk} onChange={e => update("top_risk", e.target.value)} />
          </Field>
          <Field label="Your plan if that happens" help="Even a rough plan beats no plan.">
            <TextArea value={a.risk_plan} onChange={e => update("risk_plan", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 5" title="Do this in the next 14 days">
          <Task title="Choose your business entity" sub="LLC, S-Corp, C-Corp, Sole Prop. If you're unsure, talk to a CPA.">
            <Select value={a.entity} onChange={e => update("entity", e.target.value)}>
              <option value="">— Choose —</option>
              <option>Sole Proprietor</option>
              <option>LLC</option>
              <option>S-Corp</option>
              <option>C-Corp</option>
              <option>Other</option>
            </Select>
          </Task>
          <Task title="Open a separate business bank account" sub="Personal and business money should never share a wallet.">
            <TextInput value={a.bank} onChange={e => update("bank", e.target.value)} placeholder="Mercury, Chase, Relay, etc." />
          </Task>
          <Task title="Set up bookkeeping" sub="Even a simple spreadsheet beats nothing.">
            <TextInput value={a.bookkeeping} onChange={e => update("bookkeeping", e.target.value)} placeholder="Wave, QuickBooks, custom spreadsheet, accountant" />
          </Task>
          <Task title="Document expenses in a spreadsheet" sub="Or upload your existing one.">
            <div className="space-y-2">
              <TextInput value={a.spreadsheet_url} onChange={e => update("spreadsheet_url", e.target.value)} placeholder="Link to your sheet" />
              <FileUploadStub helper="Or upload a copy" />
            </div>
          </Task>
          <Task title='Schedule your weekly "operator hour"' sub="One hour every week, same time. Review the numbers. Plan the week.">
            <TextInput value={a.operator_hour} onChange={e => update("operator_hour", e.target.value)} placeholder="Tuesday 9am" />
          </Task>
          <Task title="Write down what you'll measure weekly" sub="3 numbers, max. Not OKRs. The 3 things you check every Monday.">
            <div className="space-y-2">
              {a.kpis.map((k, i) => (
                <TextInput key={i} value={k} onChange={e => {
                  const next = [...a.kpis]; next[i] = e.target.value; update("kpis", next);
                }} placeholder={`Metric ${i + 1}`} />
              ))}
            </div>
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute"><strong className="text-forest">0 of 6</strong> tasks done · 0 of 10 answers filled</p>
          <button type="button" disabled className="bg-bone text-mute px-7 py-3 rounded-full text-[14px] font-medium cursor-not-allowed">Mark module complete</button>
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/plan/03-your-offer" className="text-[12px] text-mute hover:text-forest">← Module 03 · Your Offer</Link>
          <Link href="/plan/05-your-reach" className="text-[12px] text-mute hover:text-forest">Module 05 · Your Reach →</Link>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 md:py-12 bg-[#ece6d8] flex flex-col">
        <header className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">Live preview</p>
          <div className="flex gap-2">
            <button type="button" disabled className="bg-white border border-line px-3 py-1.5 rounded-md text-[11.5px] text-forest">↗ Full screen</button>
            <button type="button" disabled className="bg-white border border-line px-3 py-1.5 rounded-md text-[11.5px] text-forest">Export PDF</button>
          </div>
        </header>
        <PreviewPane a={a} />
      </div>
    </div>
  );
}
