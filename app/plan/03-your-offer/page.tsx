"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Example,
  Field,
  FileUploadStub,
  Step,
  Task,
  TextArea,
  TextInput,
} from "@/components/plan/ui";

type Included = { what: string; why: string };
type Proof = { name: string; quote: string; verify: string };
type FAQ = { q: string; a: string };

type Answers = {
  offer_name: string;
  transformation: string;
  perfect_for: string;
  not_for: string;
  included: Included[];
  closest_alternative: string;
  difference: string;
  price: string;
  pricing_logic: string;
  founding_price: string;
  proofs: Proof[];
  why_believe: string;
  // tasks
  one_sentence: string;
  faqs: FAQ[];
  outsider_feedback: string;
  checkout_url: string;
  refund_policy: string;
};

const initial: Answers = {
  offer_name: "",
  transformation: "",
  perfect_for: "",
  not_for: "",
  included: Array.from({ length: 5 }, () => ({ what: "", why: "" })),
  closest_alternative: "",
  difference: "",
  price: "",
  pricing_logic: "",
  founding_price: "",
  proofs: Array.from({ length: 3 }, () => ({ name: "", quote: "", verify: "" })),
  why_believe: "",
  one_sentence: "",
  faqs: Array.from({ length: 5 }, () => ({ q: "", a: "" })),
  outsider_feedback: "",
  checkout_url: "",
  refund_policy: "",
};

function PreviewPane({ a }: { a: Answers }) {
  const filledIncluded = a.included.filter((i) => i.what);
  const filledProofs = a.proofs.filter((p) => p.quote);
  const filledFaqs = a.faqs.filter((f) => f.q);

  return (
    <div className="bg-white flex-1 rounded-md shadow-[0_14px_40px_-20px_rgba(0,0,0,0.18)] p-10 md:p-12 relative overflow-hidden font-sans">
      <div className="border-b border-[#ddd] pb-3 mb-7 flex justify-between items-baseline">
        <span className="font-serif text-[14px] text-forest">
          Your Brand · The Plan
        </span>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#999]">
          Ch. 03
        </span>
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-brass mb-5">
        Chapter Three
      </p>
      <h2 className="font-serif text-[28px] font-normal text-forest tracking-[-0.015em] mb-1">
        {a.offer_name || "Your Offer"}
      </h2>
      {a.one_sentence && (
        <p className="font-serif italic text-mute text-[14.5px] mb-6">
          {a.one_sentence}
        </p>
      )}

      <dl className="space-y-4 mt-6">
        {a.transformation && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              What they walk away with
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">
                {a.transformation}
              </em>
            </dd>
          </div>
        )}
        {a.perfect_for && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Perfect for
            </dt>
            <dd className="text-[13.5px] text-ink">{a.perfect_for}</dd>
          </div>
        )}
        {a.not_for && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Not for
            </dt>
            <dd className="text-[13.5px] text-ink">{a.not_for}</dd>
          </div>
        )}

        {filledIncluded.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-2">
              What's included
            </dt>
            <dd className="text-[13px] text-ink space-y-1.5">
              {filledIncluded.map((it, i) => (
                <p key={i}>
                  <strong className="text-forest">{it.what}.</strong>{" "}
                  <span className="text-mute">{it.why}</span>
                </p>
              ))}
            </dd>
          </div>
        )}

        {a.difference && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              What makes it different
            </dt>
            <dd className="text-[13.5px] text-ink leading-[1.5]">
              <em className="font-serif italic text-forest text-[15.5px]">
                {a.difference}
              </em>
              {a.closest_alternative && (
                <p className="text-[12px] text-mute mt-1">
                  Closest alternative: {a.closest_alternative}
                </p>
              )}
            </dd>
          </div>
        )}

        {a.price && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Price
            </dt>
            <dd className="text-[13.5px] text-ink">
              <strong className="text-forest text-[16px]">{a.price}</strong>
              {a.founding_price && (
                <span className="text-mute ml-2">
                  · Founding: {a.founding_price}
                </span>
              )}
              {a.pricing_logic && (
                <p className="text-[12.5px] text-mute mt-1">
                  {a.pricing_logic}
                </p>
              )}
            </dd>
          </div>
        )}

        {(filledProofs.length > 0 || a.why_believe) && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Proof
            </dt>
            <dd className="text-[13px] text-ink space-y-1.5">
              {filledProofs.map((p, i) => (
                <p key={i}>
                  <em className="font-serif italic text-forest">
                    "{p.quote}"
                  </em>{" "}
                  <span className="text-mute">— {p.name || "Anonymous"}</span>
                </p>
              ))}
              {filledProofs.length === 0 && a.why_believe && (
                <p className="text-mute italic">{a.why_believe}</p>
              )}
            </dd>
          </div>
        )}

        {filledFaqs.length > 0 && (
          <div>
            <dt className="text-[9.5px] uppercase tracking-[0.22em] text-[#888] font-semibold mb-1">
              Common questions
            </dt>
            <dd className="text-[13px] text-ink space-y-2">
              {filledFaqs.map((f, i) => (
                <div key={i}>
                  <p className="font-semibold text-forest">{f.q}</p>
                  <p className="text-mute">{f.a}</p>
                </div>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9.5px] text-[#bbb] tracking-[0.12em]">
        7
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function ModuleThree() {
  const [a, setA] = useState<Answers>(initial);
  function update<K extends keyof Answers>(k: K, v: Answers[K]) {
    setA((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <div className="px-6 md:px-12 py-10 md:py-12 lg:border-r border-line">
        <Link href="/plan" className="text-[12px] text-brass hover:text-forest mb-5 inline-block">← All modules</Link>
        <header className="mb-7">
          <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">03 · Module three of seven</p>
          <h1 className="font-serif text-[36px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-3.5">Your Offer</h1>
          <p className="text-[15px] text-mute leading-[1.6] max-w-[520px]">
            What you actually sell. What it solves. Why it's different. The clearer the offer, the easier everything else gets.
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

        <Step number="Step 1" title="Name & promise">
          <Field label="What's the offer called?"><TextInput value={a.offer_name} onChange={e => update("offer_name", e.target.value)} /></Field>
          <Field label="What does the customer walk away with?" help="The transformation, not the features. They came in state X, leave in state Y.">
            <TextArea value={a.transformation} onChange={e => update("transformation", e.target.value)} />
          </Field>
          <Field label="Who is it perfect for?" help="A specific subset of your market.">
            <TextArea value={a.perfect_for} onChange={e => update("perfect_for", e.target.value)} />
          </Field>
          <Field label="Who is it explicitly NOT for?" help="Equally important. Saying who it isn't for is what makes it premium.">
            <TextArea value={a.not_for} onChange={e => update("not_for", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 2" title="Anatomy">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">List what's actually included. Each row: the thing + why it matters.</p>
          <div className="space-y-2 mb-5">
            {a.included.map((it, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-2">
                <input type="text" placeholder={`What ${i + 1}`} value={it.what} onChange={e => {
                  const next = [...a.included]; next[i] = { ...next[i], what: e.target.value }; update("included", next);
                }} className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest" />
                <input type="text" placeholder="Why it matters" value={it.why} onChange={e => {
                  const next = [...a.included]; next[i] = { ...next[i], why: e.target.value }; update("included", next);
                }} className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest" />
              </div>
            ))}
          </div>
          <Field label="What's the closest alternative they'd use if you didn't exist?"><TextInput value={a.closest_alternative} onChange={e => update("closest_alternative", e.target.value)} /></Field>
          <Field label="What makes you different in one line?" help="Not adjectives. A real difference."><TextInput value={a.difference} onChange={e => update("difference", e.target.value)} /></Field>
        </Step>

        <Step number="Step 3" title="Price">
          <Field label="What's the price?" help="$X one-time / $X per month / etc."><TextInput value={a.price} onChange={e => update("price", e.target.value)} /></Field>
          <Field label="Why that price?" help="The logic. Cost-plus, value-based, market comparable.">
            <TextArea value={a.pricing_logic} onChange={e => update("pricing_logic", e.target.value)} />
          </Field>
          <Field label="Founding-member or beta price (optional)" help="Early-bird if you're doing one."><TextInput value={a.founding_price} onChange={e => update("founding_price", e.target.value)} /></Field>
        </Step>

        <Step number="Step 4" title="Proof">
          <p className="text-[13px] text-mute mb-3 leading-[1.5]">Three testimonials, or if you have none yet, the honest reason you believe this will work.</p>
          <div className="space-y-3 mb-5">
            {a.proofs.map((p, i) => (
              <div key={i} className="bg-[#fdfbf6] border border-line rounded-[10px] p-3">
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 mb-2">
                  <input type="text" placeholder="Name" value={p.name} onChange={e => {
                    const next = [...a.proofs]; next[i] = { ...next[i], name: e.target.value }; update("proofs", next);
                  }} className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest" />
                  <input type="text" placeholder="One-line quote" value={p.quote} onChange={e => {
                    const next = [...a.proofs]; next[i] = { ...next[i], quote: e.target.value }; update("proofs", next);
                  }} className="px-3 py-2 bg-white border border-line rounded-md text-[13px] focus:outline-none focus:border-forest" />
                </div>
                <input type="text" placeholder="How to verify (link, or 'private')" value={p.verify} onChange={e => {
                  const next = [...a.proofs]; next[i] = { ...next[i], verify: e.target.value }; update("proofs", next);
                }} className="w-full px-3 py-2 bg-white border border-line rounded-md text-[12px] focus:outline-none focus:border-forest" />
              </div>
            ))}
          </div>
          <Field label="No proof yet? Why you believe this will work anyway." help="The honest version. Why the market signal is there even before you have customers.">
            <TextArea value={a.why_believe} onChange={e => update("why_believe", e.target.value)} />
          </Field>
        </Step>

        <Step number="Step 5" title="Do this in the next 7 days">
          <Task title='Write your offer in one sentence' sub={`Format: "I help X do Y so they can Z"`}>
            <TextArea value={a.one_sentence} onChange={e => update("one_sentence", e.target.value)} />
          </Task>
          <Task title="Photograph or screen-record the offer" sub="Up to 5 images / 1 demo video. Real proof of the thing.">
            <FileUploadStub helper="Up to 5 images or 1 demo video" />
          </Task>
          <Task title="Draft 5 FAQs" sub="What people will ask before they buy. Pre-answer them.">
            <div className="space-y-2">
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
          </Task>
          <Task title="Get one outsider to read it and tell you what they think it does" sub="Note what they say back.">
            <TextArea value={a.outsider_feedback} onChange={e => update("outsider_feedback", e.target.value)} />
          </Task>
          <Task title="Set up your checkout link" sub="Stripe Payment Link, Stan, Gumroad, Shopify. Paste the URL.">
            <TextInput value={a.checkout_url} onChange={e => update("checkout_url", e.target.value)} placeholder="https://…" />
          </Task>
          <Task title="Write your refund / cancellation policy" sub="One paragraph. Plain English.">
            <TextArea rows={4} value={a.refund_policy} onChange={e => update("refund_policy", e.target.value)} />
          </Task>
        </Step>

        <div className="mt-9 pt-6 border-t border-dashed border-line flex items-center justify-between gap-4">
          <p className="text-[13px] text-mute"><strong className="text-forest">0 of 6</strong> tasks done · 0 of 11 answers filled</p>
          <button type="button" disabled className="bg-bone text-mute px-7 py-3 rounded-full text-[14px] font-medium cursor-not-allowed">Mark module complete</button>
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/plan/02-your-market" className="text-[12px] text-mute hover:text-forest">← Module 02 · Your Market</Link>
          <Link href="/plan/04-your-plan" className="text-[12px] text-mute hover:text-forest">Module 04 · Your Plan →</Link>
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
