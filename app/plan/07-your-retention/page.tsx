"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlanAutoSave } from "@/lib/use-plan-auto-save";
import { SaveStatus } from "@/components/plan/SaveStatus";
import {
  Field,
  FileUploadStub,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type FAQ = { q: string; a: string };

type Answers = {
  first_thing: string;
  welcome_message: string;
  first_24h: string;
  how_to_reach: string;
  response_time: string;
  faqs: FAQ[];
  when_ask_referral: string;
  how_ask: string;
  incentive: string;
  // tasks
  support_inbox: string;
  onboarding: string[];
  nps_tool: string;
  happy_trigger: string;
  cadence_90day: string;
};

const initial: Answers = {
  first_thing: "",
  welcome_message: "",
  first_24h: "",
  how_to_reach: "",
  response_time: "",
  faqs: Array.from({ length: 5 }, () => ({ q: "", a: "" })),
  when_ask_referral: "",
  how_ask: "",
  incentive: "",
  support_inbox: "",
  onboarding: Array(7).fill(""),
  nps_tool: "",
  happy_trigger: "",
  cadence_90day: "",
};

function PreviewPane({ a }: { a: Answers }) {
  const filledFaqs = a.faqs.filter(f => f.q);
  const filledOnboarding = a.onboarding.filter(Boolean);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">Your Brand · The Plan</span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">Ch. 07</span>
      </div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">Chapter Seven</p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">The Loop</h2>

      <dl className="space-y-4">
        {a.first_thing && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">First thing after they pay</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.first_thing}</dd>
          </div>
        )}
        {a.welcome_message && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Welcome message</dt>
            <dd className="text-[13.5px] leading-[1.5]"><em className="font-serif italic text-forest">{a.welcome_message}</em></dd>
          </div>
        )}
        {a.first_24h && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Activating action (first 24h)</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.first_24h}</dd>
          </div>
        )}
        {(a.how_to_reach || a.response_time) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Support</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              {a.how_to_reach}
              {a.response_time && <p className="text-mute text-[12.5px]">Response: {a.response_time}</p>}
            </dd>
          </div>
        )}
        {filledFaqs.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Pre-answered questions</dt>
            <dd className="text-[13px] leading-[1.5] space-y-2">
              {filledFaqs.map((f, i) => (
                <div key={i}>
                  <p className="font-semibold text-forest">{f.q}</p>
                  <p className="text-mute">{f.a}</p>
                </div>
              ))}
            </dd>
          </div>
        )}
        {(a.when_ask_referral || a.how_ask || a.incentive) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Referral loop</dt>
            <dd className="text-[13.5px] leading-[1.5] space-y-1">
              {a.when_ask_referral && <p><strong className="text-forest">When:</strong> {a.when_ask_referral}</p>}
              {a.how_ask && <p><strong className="text-forest">How:</strong> {a.how_ask}</p>}
              {a.incentive && <p><strong className="text-forest">Incentive:</strong> {a.incentive}</p>}
            </dd>
          </div>
        )}
        {filledOnboarding.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Onboarding cadence</dt>
            <dd className="text-[13px] leading-[1.5] space-y-1">
              {filledOnboarding.map((d, i) => <p key={i}><strong className="text-forest">Day {i + 1}:</strong> {d}</p>)}
            </dd>
          </div>
        )}
      </dl>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">31</p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleSeven() {
  const [a, setA] = useState<Answers>(initial);
  function update<K extends keyof Answers>(k: K, v: Answers[K]) {
    setA(p => ({ ...p, [k]: v }));
  }
  const { status, savedAt } = usePlanAutoSave({
    moduleSlug: "07-your-retention",
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
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">07 · Module seven of seven</p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">Your Retention</h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            Onboarding, support, the referral loop that compounds. The work after the sale is what builds a business that lasts.
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

        <Step number="Step 1" title="Onboarding">
          <Field label="What's the very first thing they get after paying?" help="Email confirmation? Calendar invite? Welcome video? Be specific.">
            <TextArea value={a.first_thing} onChange={e => update("first_thing", e.target.value)} />
          </Field>
          <Field label="What does the welcome message say?" help="Draft it here. This is the first impression after they trust you with money.">
            <TextArea rows={5} value={a.welcome_message} onChange={e => update("welcome_message", e.target.value)} />
          </Field>
          <Field label="What do they need to do in their first 24 hours?" help="If they don't act in 24h, churn risk doubles. What's the activating action?">
            <TextArea value={a.first_24h} onChange={e => update("first_24h", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 2" title="Support">
          <Field label="How does someone reach you when stuck?" help="Email, in-app, DM, support form.">
            <TextArea value={a.how_to_reach} onChange={e => update("how_to_reach", e.target.value)} />
          </Field>
          <Field label="What's your response time commitment?" help="Within 24 hours? Same business day? Be realistic.">
            <TextInput value={a.response_time} onChange={e => update("response_time", e.target.value)} placeholder="Within 24 hours, business days" />
          </Field>
          <Field label="Top 5 FAQs you already know" help="Pre-answer them so you don't write the same email 50 times.">
            <div className="space-y-2.5">
              {a.faqs.map((f, i) => (
                <div key={i} className="space-y-1.5">
                  <input type="text" placeholder={`Question ${i + 1}`} value={f.q} onChange={e => {
                    const next = [...a.faqs]; next[i] = { ...next[i], q: e.target.value }; update("faqs", next);
                  }} className="w-full px-3 py-2 bg-white border border-line rounded-md text-[13px] font-medium focus:outline-none focus:border-forest" />
                  <textarea rows={2} placeholder="Your answer" value={f.a} onChange={e => {
                    const next = [...a.faqs]; next[i] = { ...next[i], a: e.target.value }; update("faqs", next);
                  }} className="w-full px-3 py-2 bg-white border border-line rounded-md text-[13px] resize-none focus:outline-none focus:border-forest" />
                </div>
              ))}
            </div>
          </Field>
        </Step>

        <Step number="Step 3" title="Referrals">
          <Field label="When do you ask for a referral?" help="After what trigger? First win? 30 days in? Quarterly?">
            <TextInput value={a.when_ask_referral} onChange={e => update("when_ask_referral", e.target.value)} />
          </Field>
          <Field label="Exactly how do you ask?" help="Word-for-word. The script.">
            <TextArea rows={4} value={a.how_ask} onChange={e => update("how_ask", e.target.value)} />
          </Field>
          <Field label="What's the incentive (if any)?" help="Free month? Cash? Recognition? Or no incentive, just the ask?">
            <TextInput value={a.incentive} onChange={e => update("incentive", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 4" title="Do this in the next 14 days">
          <Task title="Set up your support inbox or channel">
            <TextInput value={a.support_inbox} onChange={e => update("support_inbox", e.target.value)} placeholder="support@yourbrand.com" />
          </Task>
          <Task title="Write your 7-day onboarding email sequence" sub="One email per day. Each earns the right to the next.">
            <div className="space-y-2">
              {a.onboarding.map((d, i) => (
                <TextArea key={i} rows={3} value={d} onChange={e => {
                  const next = [...a.onboarding]; next[i] = e.target.value; update("onboarding", next);
                }} placeholder={`Day ${i + 1}`} />
              ))}
            </div>
          </Task>
          <Task title="Build a customer FAQ doc" sub="Upload it or link to it.">
            <FileUploadStub helper="Upload the FAQ doc" />
          </Task>
          <Task title="Set up an NPS / feedback mechanism" sub="Even a simple Typeform works.">
            <TextInput value={a.nps_tool} onChange={e => update("nps_tool", e.target.value)} placeholder="Typeform, Tally, in-app prompt, etc." />
          </Task>
          <Task title={`Define your "happy customer" trigger`} sub="The moment you ask for a referral.">
            <TextInput value={a.happy_trigger} onChange={e => update("happy_trigger", e.target.value)} placeholder="After they hit their first $X in revenue, ask" />
          </Task>
          <Task title="Schedule a 90-day check-in cadence" sub="Every member gets a manual touch every 90 days. When and how?">
            <TextArea value={a.cadence_90day} onChange={e => update("cadence_90day", e.target.value)} />
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute"><strong className="text-forest">0 of 6</strong> tasks done · 0 of 9 answers filled</p>
          <button type="button" disabled className="bg-bone text-mute px-7 py-3 rounded-full text-[14px] font-medium cursor-not-allowed">Mark module complete</button>
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/plan/06-your-funnel" className="text-[12px] text-mute hover:text-forest">← Module 06 · Your Funnel</Link>
          <Link href="/plan" className="text-[12px] text-brass font-medium hover:text-forest">All modules ↗</Link>
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
