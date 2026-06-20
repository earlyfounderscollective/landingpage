"use client";

import { useState } from "react";
import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type AIPromptsData = {
  used: Record<string, boolean>;
};

type Prompt = {
  num: string;
  title: string;
  use: string;
  prompt: string;
};

const PROMPTS: Prompt[] = [
  {
    num: "01",
    title: "Voice translator",
    use: "Turn rambling notes into something a customer would actually read.",
    prompt: `Below is a rough description of what my business does. Rewrite it as one paragraph in the voice of a confident, plainspoken founder. No jargon, no buzzwords, no "passionate." Aim for what I'd say out loud to a friend at dinner. End with one sentence a customer would repeat back to me.

[Paste your rough description here]`,
  },
  {
    num: "02",
    title: "Reverse review research",
    use: "Find out what your competitors' customers actually complain about.",
    prompt: `I'm building [your business] for [your customer]. Pretend you're a customer of my three biggest competitors: [Competitor A], [Competitor B], [Competitor C]. Write the five most common complaints customers leave in their 1-3 star reviews. Be specific — not "bad service," but the actual behavior that caused the complaint.

Then tell me how I should position my business to avoid these complaints.`,
  },
  {
    num: "03",
    title: "Pricing logic builder",
    use: "Defend your price out loud, in writing, before a customer pushes back.",
    prompt: `I charge [your price] for [your service]. Customers sometimes say "that's expensive" or push back. Write me three short answers I can use:

1. The value answer — what they actually get and why it's worth it
2. The framing answer — what the cheaper alternative actually costs them in time or risk
3. The walk-away answer — how I politely say "this isn't a fit" without burning the relationship

Keep each answer under 60 words. Direct, no apologizing.`,
  },
  {
    num: "04",
    title: "First-touch outreach",
    use: "DM or email that doesn't feel like spam.",
    prompt: `I want to reach out to [specific type of person — e.g., real estate agents in Houston] to offer [your service]. Write me a 4-sentence first-touch message that:

- References something specific they actually do or care about
- Mentions what I do without pitching
- Asks one curious question
- Doesn't include a calendar link, "hop on a call," or "would love to connect"

I'll send this in a cold DM, so the opening line has to make them not bounce.`,
  },
  {
    num: "05",
    title: "Objection responder",
    use: "Reframes for the four objections you'll hear most.",
    prompt: `Below is what my business does and who it's for. List the four objections I'll hear most often from prospects. For each one, write:

- The actual sentence the prospect will say
- The honest read on why they're saying it (price? trust? timing? not the right buyer?)
- A 2-3 sentence response that addresses the real concern

[Paste your offer + customer description here]`,
  },
  {
    num: "06",
    title: "Sales page outline",
    use: "Skeleton for the long-form page that sells the offer.",
    prompt: `I sell [your offer] for [your customer]. Write me an outline for a long-form sales page that follows this order:

1. Headline (specific outcome + timeframe, no fluff)
2. The problem they're stuck on
3. The wrong way most people try to fix it
4. Why my approach is different
5. What's in the offer (3-5 specific deliverables)
6. Proof / who else this worked for
7. Pricing + what's included
8. The promise / guarantee
9. The close

For each section, give me 2-3 bullet points of what to write. Don't write the page yet — just the skeleton.`,
  },
  {
    num: "07",
    title: "Customer interview script",
    use: "Find out what your customers really want before you build it.",
    prompt: `I'm about to interview 5 prospective customers for [your business]. Write me a 10-question script that:

- Doesn't ask "would you buy this?" (they always say yes)
- Surfaces what they currently pay for / how they currently solve the problem
- Identifies the moment in their week when this problem hurts most
- Ends with one open question that lets them tell me something I didn't think to ask

The goal is to find out if there's a real problem worth solving, not to pitch.`,
  },
  {
    num: "08",
    title: "Referral request",
    use: "Ask for a referral without sounding desperate.",
    prompt: `I have a happy customer ([their name / what I delivered]) and I want to ask them for one referral. Write me a 5-sentence text or email that:

- Thanks them in a specific way (not generic "thanks for your business")
- Asks them to think of ONE person who has the same problem they had
- Makes it easy to say no
- Doesn't include "I'd really appreciate it" or any pleading language

Keep it warm but direct.`,
  },
  {
    num: "09",
    title: "Weekly review",
    use: "End-of-week prompt to keep you out of busywork mode.",
    prompt: `Below are the things I worked on this week. Categorize each one as:

(A) Made me money or made the next deal easier
(B) Felt productive but didn't move the business
(C) Should be deleted from the system entirely

Then write me three sentences: what to keep doing, what to stop, and what to start next week.

[Paste your week's tasks here]`,
  },
  {
    num: "10",
    title: "End-of-quarter cleanup",
    use: "What to fix before next quarter starts.",
    prompt: `Here's a summary of my last 90 days: [revenue, biggest wins, biggest stalls, customer complaints, anything you tried that flopped].

Give me the honest read on:
- The one thing that's slowing this business down the most
- The one thing I should keep doing harder
- The one thing I should stop doing entirely

Then write me a single sentence I should pin somewhere visible for the next 90 days.`,
  },
];

export function AIPromptsLibrary({ initial }: { initial: AIPromptsData }) {
  const { data, setData, status } = useKitAutoSave<AIPromptsData>({
    moduleSlug: "04-ai-prompts",
    initial,
    isComplete: (d) => Object.values(d.used).filter(Boolean).length >= 3,
  });

  const usedCount = Object.values(data.used).filter(Boolean).length;

  function toggleUsed(num: string) {
    setData((d) => ({ ...d, used: { ...d.used, [num]: !d.used[num] } }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {usedCount} prompts tried · 10 total
        </p>
        <SaveIndicator status={status} />
      </div>

      <div className="space-y-3">
        {PROMPTS.map((p) => (
          <PromptCard
            key={p.num}
            prompt={p}
            used={Boolean(data.used[p.num])}
            onToggleUsed={() => toggleUsed(p.num)}
          />
        ))}
      </div>
    </>
  );
}

function PromptCard({
  prompt,
  used,
  onToggleUsed,
}: {
  prompt: Prompt;
  used: boolean;
  onToggleUsed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <article className="bg-white border border-line rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left hover:bg-bone/40 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span className="font-serif text-[15px] text-brass tabular-nums shrink-0">
            {prompt.num}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-[16.5px] md:text-[18px] text-forest leading-[1.25]">
              {prompt.title}
            </p>
            <p className="mt-0.5 text-[12.5px] text-mute leading-[1.4]">
              {prompt.use}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest text-ivory transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 border-t border-line/40 bg-bone/30">
          <div className="bg-forest text-ivory rounded-lg p-4 md:p-5 my-4">
            <pre className="whitespace-pre-wrap font-mono text-[12.5px] md:text-[13px] leading-[1.6] text-ivory/95">
{prompt.prompt}
            </pre>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 bg-brass text-ivory px-4 py-2 rounded-full text-[12.5px] font-semibold tracking-[0.04em] uppercase hover:bg-[#8a6c3f] transition-colors"
            >
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
            <button
              type="button"
              onClick={onToggleUsed}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-medium border transition-colors ${
                used
                  ? "bg-forest text-ivory border-forest"
                  : "bg-white text-forest border-line hover:border-forest/40"
              }`}
            >
              {used ? "Used ✓" : "Mark as used"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
