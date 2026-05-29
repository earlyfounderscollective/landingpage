"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Field,
  FileUploadStub,
  Select,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type Channel = { name: string; style: string; cadence: string };

type Answers = {
  customer_day: string;
  weekly_places: string[];
  primary_platform: string;
  channels: Channel[];
  responsible: string;
  // tasks
  primary_handle: string;
  one_line_bio: string;
  content_ideas: string[];
  first_post: string;
  schedule_tool: string;
  weekly_checkin: string;
};

const initial: Answers = {
  customer_day: "",
  weekly_places: Array(5).fill(""),
  primary_platform: "",
  channels: Array.from({ length: 3 }, () => ({ name: "", style: "", cadence: "" })),
  responsible: "",
  primary_handle: "",
  one_line_bio: "",
  content_ideas: Array(10).fill(""),
  first_post: "",
  schedule_tool: "",
  weekly_checkin: "",
};

function PreviewPane({ a }: { a: Answers }) {
  const filledPlaces = a.weekly_places.filter(Boolean);
  const filledChannels = a.channels.filter(c => c.name);
  const filledIdeas = a.content_ideas.filter(Boolean);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">Your Brand · The Plan</span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">Ch. 05</span>
      </div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">Chapter Five</p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-6">How We Get Found</h2>

      <dl className="space-y-4">
        {a.customer_day && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Where our customer is</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.customer_day}</dd>
          </div>
        )}
        {filledPlaces.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Places they visit weekly</dt>
            <dd className="text-[13px] leading-[1.5]">{filledPlaces.join(" · ")}</dd>
          </div>
        )}
        {filledChannels.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-2">Our channels</dt>
            <dd className="text-[13px] space-y-2">
              {filledChannels.map((c, i) => (
                <div key={i}>
                  <p><strong className="text-forest">{c.name}.</strong> {c.style && <span className="text-mute">{c.style}.</span>}</p>
                  {c.cadence && <p className="text-[12px] text-mute">Cadence: {c.cadence}</p>}
                </div>
              ))}
            </dd>
          </div>
        )}
        {a.one_line_bio && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Bio</dt>
            <dd className="text-[13.5px] leading-[1.5]"><em className="font-serif italic text-forest text-[15.5px]">{a.one_line_bio}</em></dd>
          </div>
        )}
        {filledIdeas.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Content seeds</dt>
            <dd className="text-[13px] leading-[1.55]">
              {filledIdeas.map((idea, i) => <p key={i}>0{i + 1}. {idea}</p>)}
            </dd>
          </div>
        )}
        {a.weekly_checkin && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">Weekly review</dt>
            <dd className="text-[13.5px] leading-[1.5]">{a.weekly_checkin}</dd>
          </div>
        )}
      </dl>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">17</p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleFive() {
  const [a, setA] = useState<Answers>(initial);
  function update<K extends keyof Answers>(k: K, v: Answers[K]) {
    setA(p => ({ ...p, [k]: v }));
  }
  function updateChannel(i: number, field: keyof Channel, v: string) {
    const next = [...a.channels]; next[i] = { ...next[i], [field]: v }; update("channels", next);
  }

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <div className="px-6 md:px-12 py-10 md:py-12 lg:border-r border-line">
        <Link href="/plan" className="text-[12px] text-brass hover:text-forest mb-5 inline-block">← All modules</Link>
        <header className="mb-7">
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">05 · Module five of seven</p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">Your Reach</h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            Where you'll be found. Two channels done well beats five done badly. The hard part is choosing what you'll skip.
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

        <Step number="Step 1" title="Where your customer already is">
          <Field label="What does your customer's typical day look like?" help="Walk through it. Where do they spend time? What's on their phone?">
            <TextArea rows={4} value={a.customer_day} onChange={e => update("customer_day", e.target.value)} />
          </Field>
          <Field label="What 5 places does your customer visit weekly?" help={`Specific. "Substack" is too broad. "Lenny's Newsletter" is right.`}>
            <div className="space-y-2">
              {a.weekly_places.map((p, i) => (
                <TextInput key={i} value={p} onChange={e => {
                  const next = [...a.weekly_places]; next[i] = e.target.value; update("weekly_places", next);
                }} placeholder={`Place ${i + 1}`} />
              ))}
            </div>
          </Field>
          <Field label="What's their primary platform?">
            <Select value={a.primary_platform} onChange={e => update("primary_platform", e.target.value)}>
              <option value="">— Choose —</option>
              <option>Instagram</option>
              <option>X / Twitter</option>
              <option>LinkedIn</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Podcast</option>
              <option>Newsletter / Substack</option>
              <option>IRL / Events</option>
              <option>Other</option>
            </Select>
          </Field>
        </Step>

        <Step number="Step 2" title="Your channels">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">Pick 2–3 channels. Define a style for each. Be honest about what you can maintain.</p>
          <div className="space-y-3">
            {a.channels.map((c, i) => (
              <div key={i} className="bg-[#fdfbf6] border border-line rounded-[10px] p-3.5">
                <p className="text-[10.5px] uppercase tracking-[0.22em] text-brass font-semibold mb-2.5">Channel {i + 1}</p>
                <div className="space-y-2">
                  <TextInput value={c.name} onChange={e => updateChannel(i, "name", e.target.value)} placeholder="Platform (Instagram, LinkedIn, podcast, etc.)" />
                  <TextArea rows={2} value={c.style} onChange={e => updateChannel(i, "style", e.target.value)} placeholder="Content style — educational, behind-the-scenes, hot takes, etc." />
                  <TextInput value={c.cadence} onChange={e => updateChannel(i, "cadence", e.target.value)} placeholder="Cadence — 'twice a week', 'every Tuesday', etc." />
                </div>
              </div>
            ))}
          </div>
        </Step>

        <Step number="Step 3" title="Who's running this">
          <Field label="Who's responsible for content?" help="Just you? VA? Agency? Honest answer.">
            <TextInput value={a.responsible} onChange={e => update("responsible", e.target.value)} placeholder="Just me — for now" />
          </Field>
        </Step>

        <Step number="Step 4" title="Do this in the next 14 days">
          <Task title="Set up or claim your primary channel" sub="The handle or URL you secured.">
            <TextInput value={a.primary_handle} onChange={e => update("primary_handle", e.target.value)} placeholder="@yourbrand" />
          </Task>
          <Task title="Define your one-line bio for that channel" sub="One sentence that tells someone who you are and what they get.">
            <TextArea value={a.one_line_bio} onChange={e => update("one_line_bio", e.target.value)} />
          </Task>
          <Task title="Brainstorm 10 content ideas" sub="Quantity first. Don't judge them yet.">
            <div className="space-y-2">
              {a.content_ideas.map((idea, i) => (
                <TextInput key={i} value={idea} onChange={e => {
                  const next = [...a.content_ideas]; next[i] = e.target.value; update("content_ideas", next);
                }} placeholder={`Idea ${i + 1}`} />
              ))}
            </div>
          </Task>
          <Task title="Draft your first post" sub="Just write it. You can edit later. Done beats perfect.">
            <TextArea rows={6} value={a.first_post} onChange={e => update("first_post", e.target.value)} />
          </Task>
          <Task title="Schedule 2 weeks of content" sub="Which tool are you using?">
            <TextInput value={a.schedule_tool} onChange={e => update("schedule_tool", e.target.value)} placeholder="Buffer, Notion calendar, native scheduler, etc." />
          </Task>
          <Task title="Set up a weekly metrics check-in" sub="One time per week. Reviews what worked. Plans the next week.">
            <TextInput value={a.weekly_checkin} onChange={e => update("weekly_checkin", e.target.value)} placeholder="Friday 4pm — review last week + plan next" />
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute"><strong className="text-forest">0 of 6</strong> tasks done · 0 of 7 answers filled</p>
          <button type="button" disabled className="bg-bone text-mute px-7 py-3 rounded-full text-[14px] font-medium cursor-not-allowed">Mark module complete</button>
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/plan/04-your-plan" className="text-[12px] text-mute hover:text-forest">← Module 04 · Your Plan</Link>
          <Link href="/plan/06-your-funnel" className="text-[12px] text-mute hover:text-forest">Module 06 · Your Funnel →</Link>
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
