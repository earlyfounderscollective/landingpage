"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlanAutoSave } from "@/lib/use-plan-auto-save";
import { SaveStatus } from "@/components/plan/SaveStatus";
import { MarkCompleteButton } from "@/components/plan/MarkCompleteButton";
import {
  Field,
  FileUploadStub,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type Objection = { objection: string; response: string };

type Answers = {
  hook: string;
  where_seen: string;
  first_cta: string;
  lead_magnet: string;
  follow_up: string;
  closing_offer: string;
  purchase_flow: string;
  objections: Objection[];
  // tasks
  list_tool: string;
  list_url: string;
  welcome_email: string;
  nurture: string[];
  sales_page: string;
  test_notes: string;
};

const initial: Answers = {
  hook: "",
  where_seen: "",
  first_cta: "",
  lead_magnet: "",
  follow_up: "",
  closing_offer: "",
  purchase_flow: "",
  objections: [
    { objection: "I don't have time for this right now", response: "" },
    { objection: "Money's tight — can I get it cheaper?", response: "" },
    { objection: "I don't need this", response: "" },
    { objection: "I don't know if I can trust you", response: "" },
    { objection: "I've tried things like this before and they didn't work", response: "" },
  ],
  list_tool: "",
  list_url: "",
  welcome_email: "",
  nurture: Array(5).fill(""),
  sales_page: "",
  test_notes: "",
};

function PreviewPane({ a }: { a: Answers }) {
  const filledObjections = a.objections.filter(o => o.objection || o.response);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">Your Brand · The Plan</span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">Ch. 06</span>
      </div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">Chapter Six</p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">The Path</h2>

      <dl className="space-y-4">
        {a.hook && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Top of funnel · the hook</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">{a.hook}</em>
              {a.where_seen && <p className="text-mute text-[12.5px] mt-1">Seen on: {a.where_seen}</p>}
              {a.first_cta && <p className="text-mute text-[12.5px]">First CTA: {a.first_cta}</p>}
            </dd>
          </div>
        )}
        {a.lead_magnet && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Middle of funnel · the give</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              {a.lead_magnet}
              {a.follow_up && <p className="text-mute text-[12.5px] mt-1">{a.follow_up}</p>}
            </dd>
          </div>
        )}
        {a.closing_offer && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Bottom of funnel · the close</dt>
            <dd className="text-[13.5px] leading-[1.5]">
              <strong className="text-forest">{a.closing_offer}.</strong>
              {a.purchase_flow && <p className="text-mute text-[12.5px] mt-1">{a.purchase_flow}</p>}
            </dd>
          </div>
        )}
        {filledObjections.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-2">Objection library</dt>
            <dd className="text-[13px] space-y-2">
              {filledObjections.map((o, i) => (
                <div key={i}>
                  <p className="font-semibold text-forest">"{o.objection}"</p>
                  <p className="text-mute">{o.response}</p>
                </div>
              ))}
            </dd>
          </div>
        )}
        {a.welcome_email && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Welcome email (first touch)</dt>
            <dd className="text-[13px] leading-[1.5] text-mute italic">{a.welcome_email}</dd>
          </div>
        )}
      </dl>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">23</p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleSix() {
  const [a, setA] = useState<Answers>(initial);
  function update<K extends keyof Answers>(k: K, v: Answers[K]) {
    setA(p => ({ ...p, [k]: v }));
  }
  const { status, savedAt } = usePlanAutoSave({
    moduleSlug: "06-your-funnel",
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
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">06 · Module six of seven</p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">Your Funnel</h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            The path from stranger to customer. Top, middle, bottom. Plus the objection library that pre-answers what slows a sale down.
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

        <Step number="Step 1" title="Top of funnel · attention">
          <Field label="What's the hook?" help="What grabs them in 3 seconds?">
            <TextArea value={a.hook} onChange={e => update("hook", e.target.value)} />
          </Field>
          <Field label="Where do they first encounter you?" help="Specific channel + format.">
            <TextInput value={a.where_seen} onChange={e => update("where_seen", e.target.value)} placeholder='Instagram Reels, LinkedIn long-form post, etc.' />
          </Field>
          <Field label="What's the first call to action?" help="Follow, read, watch, sign up.">
            <TextInput value={a.first_cta} onChange={e => update("first_cta", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 2" title="Middle of funnel · interest">
          <Field label="What's the free value you give first?" help="Lead magnet, opt-in, free guide, free call.">
            <TextArea value={a.lead_magnet} onChange={e => update("lead_magnet", e.target.value)} />
          </Field>
          <Field label="What's the follow-up sequence?" help="Day 1: X. Day 3: Y. Day 7: Z.">
            <TextArea rows={4} value={a.follow_up} onChange={e => update("follow_up", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 3" title="Bottom of funnel · action">
          <Field label="What's the closing offer?" help="The actual thing they buy.">
            <TextInput value={a.closing_offer} onChange={e => update("closing_offer", e.target.value)} />
          </Field>
          <Field label="What's the purchase flow, step by step?" help="Click → land on page → see X → click → checkout.">
            <TextArea rows={4} value={a.purchase_flow} onChange={e => update("purchase_flow", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 4" title="Objection library">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">Pre-seeded with the 5 most common. Edit the objections and write your response to each.</p>
          <div className="space-y-3">
            {a.objections.map((o, i) => (
              <div key={i} className="bg-[#fdfbf6] border border-line rounded-[10px] p-3.5">
                <input type="text" placeholder="The objection" value={o.objection} onChange={e => {
                  const next = [...a.objections]; next[i] = { ...next[i], objection: e.target.value }; update("objections", next);
                }} className="w-full mb-2 px-3 py-2 bg-white border border-line rounded-md text-[13px] font-medium focus:outline-none focus:border-forest" />
                <textarea rows={2} placeholder="Your response" value={o.response} onChange={e => {
                  const next = [...a.objections]; next[i] = { ...next[i], response: e.target.value }; update("objections", next);
                }} className="w-full px-3 py-2 bg-white border border-line rounded-md text-[13px] resize-none focus:outline-none focus:border-forest" />
              </div>
            ))}
            <button type="button" onClick={() => update("objections", [...a.objections, { objection: "", response: "" }])} className="text-[12px] text-brass hover:text-forest font-medium">
              + Add another objection
            </button>
          </div>
        </Step>

        <Step number="Step 5" title="Do this in the next 14 days">
          <Task title="Build your lead magnet" sub="Or document where it lives.">
            <FileUploadStub helper="Upload your lead magnet file" />
          </Task>
          <Task title="Set up your email list" sub="Substack, Beehiiv, Resend, Mailchimp, ConvertKit, etc.">
            <TextInput value={a.list_tool} onChange={e => update("list_tool", e.target.value)} placeholder="Tool you're using" />
            <div className="mt-2"><TextInput value={a.list_url} onChange={e => update("list_url", e.target.value)} placeholder="Public URL of your list" /></div>
          </Task>
          <Task title="Write your welcome email" sub="The first email someone gets after they sign up.">
            <TextArea rows={6} value={a.welcome_email} onChange={e => update("welcome_email", e.target.value)} />
          </Task>
          <Task title="Draft your 5-touch nurture sequence" sub="Days 1, 3, 5, 7, 10. Each one earns the right to the next.">
            <div className="space-y-2">
              {a.nurture.map((n, i) => (
                <TextArea key={i} rows={3} value={n} onChange={e => {
                  const next = [...a.nurture]; next[i] = e.target.value; update("nurture", next);
                }} placeholder={`Email ${i + 1}`} />
              ))}
            </div>
          </Task>
          <Task title="Build your sales page" sub="Where they actually decide to buy.">
            <TextInput value={a.sales_page} onChange={e => update("sales_page", e.target.value)} placeholder="https://…" />
          </Task>
          <Task title="Test the full purchase flow yourself" sub="What broke. What you fixed.">
            <TextArea value={a.test_notes} onChange={e => update("test_notes", e.target.value)} />
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute max-w-[260px] leading-[1.5]">When you're ready, mark this done. You can always come back and edit.</p>
          <MarkCompleteButton moduleSlug="06-your-funnel" />
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/plan/05-your-reach" className="text-[12px] text-mute hover:text-forest">← Module 05 · Your Reach</Link>
          <Link href="/plan/07-your-retention" className="text-[12px] text-mute hover:text-forest">Module 07 · Your Retention →</Link>
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
