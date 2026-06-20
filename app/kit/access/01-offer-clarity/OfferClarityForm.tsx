"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type OfferClarityData = {
  what_you_sell: string;
  who_its_for: string;
  outcome: string;
  time_to_outcome: string;
  one_sentence: string;
};

const QUESTIONS: { key: keyof OfferClarityData; label: string; placeholder: string; hint?: string }[] = [
  {
    key: "what_you_sell",
    label: "What do you sell?",
    placeholder: "Custom interior repainting for homes under contract",
    hint: "The thing — not the category. 'Lawn care' is a category. 'Weekly mowing + edging for $89' is what you sell.",
  },
  {
    key: "who_its_for",
    label: "Who is it for?",
    placeholder: "Real estate agents prepping listings in Houston",
    hint: "Be specific enough that they recognize themselves. If 'everyone' is the answer, narrow it.",
  },
  {
    key: "outcome",
    label: "What's the outcome?",
    placeholder: "House ready to list within 3 days",
    hint: "What changes for them after they buy. Not features. The result.",
  },
  {
    key: "time_to_outcome",
    label: "How fast do they get it?",
    placeholder: "3 days",
    hint: "Time-to-value matters. The faster, the easier to sell.",
  },
];

export function OfferClarityForm({ initial }: { initial: OfferClarityData }) {
  const { data, setData, status } = useKitAutoSave<OfferClarityData>({
    moduleSlug: "01-offer-clarity",
    initial,
    isComplete: (d) =>
      Boolean(d.what_you_sell && d.who_its_for && d.outcome && d.one_sentence),
  });

  function setField(key: keyof OfferClarityData, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          The questions
        </p>
        <SaveIndicator status={status} />
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <label key={q.key} className="block">
            <span className="block font-serif text-[18px] md:text-[19px] text-forest mb-2 leading-[1.3]">
              {q.label}
            </span>
            {q.hint && (
              <span className="block text-[13px] text-mute mb-2.5 leading-[1.5]">
                {q.hint}
              </span>
            )}
            <textarea
              value={data[q.key]}
              onChange={(e) => setField(q.key, e.target.value)}
              placeholder={q.placeholder}
              rows={2}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
            />
          </label>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border-2 border-brass/40 bg-bone/70 p-6 md:p-7">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass mb-3">
          Your one-sentence offer
        </p>
        <p className="text-[14px] text-ink/72 mb-4 leading-[1.55]">
          Now stitch them together. Pattern:{" "}
          <em className="not-italic font-serif text-forest">
            "We [what you sell] for [who it's for] in [time] so they get [outcome]."
          </em>
        </p>
        <textarea
          value={data.one_sentence}
          onChange={(e) => setField("one_sentence", e.target.value)}
          placeholder='"We paint your listing in 3 days so you can put it on the market this week."'
          rows={3}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] font-serif italic text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.55]"
        />
        <p className="mt-3 text-[12.5px] text-mute leading-[1.55]">
          Read it out loud. If you have to explain it after, keep cutting.
        </p>
      </div>
    </>
  );
}
