"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type First30Data = {
  day_done: Record<string, boolean>;
  names: string;
  a_list: string;
  channel: string;
  weekly_rhythm: string;
};

type Day = {
  n: string;
  title: string;
  goal: string;
  steps: { id: string; label: string }[];
};

const DAYS: Day[] = [
  {
    n: "Day 1",
    title: "Inventory who you already know",
    goal: "Build a list of 50 names. Don't filter yet — just dump.",
    steps: [
      { id: "d1-contacts", label: "Open your phone contacts. Scroll through every letter. List anyone who might fit." },
      { id: "d1-ig", label: "Open Instagram followers / DMs. Add anyone relevant." },
      { id: "d1-linkedin", label: "Open LinkedIn connections. Add anyone relevant." },
      { id: "d1-list", label: "End the day with a written list of 50+ names." },
    ],
  },
  {
    n: "Day 2",
    title: "A-list outreach (10 messages)",
    goal: "Send 10 personal messages to the people most likely to say yes.",
    steps: [
      { id: "d2-rank", label: "Mark the 10 hottest names — people who already trust you AND have the problem you solve." },
      { id: "d2-script", label: "Write your message (use Module 04 — Prompt 04: First-touch outreach)." },
      { id: "d2-send", label: "Send 10 personalized messages today. Reference something specific in each." },
      { id: "d2-no-call", label: "Don't include 'hop on a call' or a calendar link. Just open the conversation." },
    ],
  },
  {
    n: "Day 3",
    title: "B-list referral asks",
    goal: "Ask 10 people who can't buy themselves to send you one referral.",
    steps: [
      { id: "d3-list", label: "Mark 10 names of people who can't buy but know people who can." },
      { id: "d3-script", label: "Write your referral ask (use Module 04 — Prompt 08)." },
      { id: "d3-send", label: "Send 10 referral asks. Make it easy to say no." },
    ],
  },
  {
    n: "Day 4",
    title: "Pick your distribution channel",
    goal: "Commit to one channel for the next 90 days.",
    steps: [
      { id: "d4-where", label: "Where do your customers already spend time? (IG, LinkedIn, in-person, Google search...)" },
      { id: "d4-pick", label: "Pick ONE channel. Write down why." },
      { id: "d4-cadence", label: "Decide your posting/outreach cadence (e.g., 3 IG posts/week + 5 DMs/day)." },
      { id: "d4-no-spread", label: "Block off Day 90 on your calendar to review — you're not switching channels before then." },
    ],
  },
  {
    n: "Day 5",
    title: "Set up tracking + weekly rhythm",
    goal: "You don't have a business if you can't see the pipeline.",
    steps: [
      { id: "d5-tracker", label: "Open Module 06 — Lead Tracker Sheet. Add every conversation from days 2-3." },
      { id: "d5-rhythm", label: "Set a recurring 30-min weekly slot for outreach + follow-up review." },
      { id: "d5-metric", label: "Decide your one number for the next 90 days (conversations? bookings? revenue?)." },
      { id: "d5-share", label: "Drop your one-number commitment in the #momentum channel." },
    ],
  },
];

const TOTAL_STEPS = DAYS.reduce((acc, d) => acc + d.steps.length, 0);

export function First30Playbook({ initial }: { initial: First30Data }) {
  const { data, setData, status } = useKitAutoSave<First30Data>({
    moduleSlug: "05-first-30",
    initial,
    isComplete: (d) => Object.values(d.day_done).filter(Boolean).length >= TOTAL_STEPS,
  });

  const doneCount = Object.values(data.day_done).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL_STEPS) * 100);

  function toggle(id: string) {
    setData((d) => ({ ...d, day_done: { ...d.day_done, [id]: !d.day_done[id] } }));
  }

  function setField<K extends keyof First30Data>(key: K, value: First30Data[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {doneCount} of {TOTAL_STEPS} steps · {pct}%
        </p>
        <SaveIndicator status={status} />
      </div>

      <div className="h-[5px] bg-bone rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-gradient-to-r from-[#9B7A4A] to-[#B59164] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-6">
        {DAYS.map((day) => {
          const dayDone = day.steps.every((s) => data.day_done[s.id]);
          return (
            <section
              key={day.n}
              className={`bg-white border-2 rounded-2xl p-5 md:p-6 transition-all ${dayDone ? "border-forest/30 bg-forest/[0.02]" : "border-line"}`}
            >
              <header className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-1">
                    {day.n}
                  </p>
                  <h3 className="font-serif text-[20px] md:text-[22px] text-forest leading-[1.2]">
                    {day.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-mute leading-[1.5]">
                    {day.goal}
                  </p>
                </div>
                {dayDone && (
                  <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest">
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5L4.5 9L10 3" stroke="#F7F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </header>
              <ul className="space-y-2">
                {day.steps.map((step) => {
                  const isDone = Boolean(data.day_done[step.id]);
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => toggle(step.id)}
                        className="w-full flex items-start gap-3 text-left p-2.5 rounded-lg hover:bg-bone/40 transition-colors"
                      >
                        <span
                          className={`mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${
                            isDone ? "bg-forest border-forest" : "bg-white border-line"
                          }`}
                          style={{ height: 18, width: 18 }}
                        >
                          {isDone && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6.5L4.5 9L10 3" stroke="#F7F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-[14px] leading-[1.5] ${isDone ? "line-through text-ink/50" : "text-forest"}`}>
                          {step.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-10 space-y-5">
        <h3 className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-brass">
          Your notes
        </h3>
        <NotesField
          label="Top 10 A-list names"
          placeholder="The 10 people most likely to say yes. Names, not categories."
          value={data.a_list}
          onChange={(v) => setField("a_list", v)}
        />
        <NotesField
          label="Your distribution channel + cadence"
          placeholder="IG, 3 posts/week + 5 DMs/day to event coordinators in Houston"
          value={data.channel}
          onChange={(v) => setField("channel", v)}
        />
        <NotesField
          label="Your one number for the next 90 days"
          placeholder="30 paying customers · OR · 100 conversations · OR · $10K revenue"
          value={data.weekly_rhythm}
          onChange={(v) => setField("weekly_rhythm", v)}
        />
      </section>
    </>
  );
}

function NotesField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold tracking-[0.04em] text-forest mb-1.5">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
      />
    </label>
  );
}
