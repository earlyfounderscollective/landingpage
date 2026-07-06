"use client";

import { useState } from "react";
import Link from "next/link";

type Props = { email: string; name: string };

const RATING_LABELS = ["Poor", "Meh", "Good", "Great", "Loved it"];

export function SurveyForm({ email, name }: Props) {
  const [rating, setRating] = useState(0);
  const [mostValuable, setMostValuable] = useState("");
  const [confusing, setConfusing] = useState("");
  const [wishCovered, setWishCovered] = useState("");
  const [kitLikelihood, setKitLikelihood] = useState(0);
  const [cohortLikelihood, setCohortLikelihood] = useState(0);
  const [barrier, setBarrier] = useState("");
  const [other, setOther] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setErr("Give the training a rating first.");
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/training/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          rating,
          most_valuable: mostValuable,
          confusing,
          wish_covered: wishCovered,
          kit_likelihood: kitLikelihood || null,
          cohort_likelihood: cohortLikelihood || null,
          barrier,
          other,
          source: "training_survey",
          _gotcha: gotcha,
        }),
      });
      if (!res.ok) {
        setErr("Something went wrong. Try again in a moment.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setErr("Network error. Try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white border border-line rounded-2xl p-8 md:p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-forest text-ivory flex items-center justify-center font-serif text-[22px]">
          ✓
        </div>
        <h2 className="mt-5 font-serif text-[26px] text-forest leading-[1.2]">
          Got it. Thank you.
        </h2>
        <p className="mt-3 text-[15px] text-ink/72 leading-[1.6]">
          This genuinely shapes the next training. If you're ready to keep the
          momentum going, here's where to go next.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kit"
            className="inline-flex items-center justify-center rounded-full bg-forest text-ivory text-[14px] font-semibold tracking-[0.02em] px-7 py-3.5 hover:bg-ink transition-colors"
          >
            Get the Business Kit
          </Link>
          <Link
            href="/bootcamp"
            className="inline-flex items-center justify-center rounded-full bg-white border border-line text-forest text-[14px] font-semibold tracking-[0.02em] px-7 py-3.5 hover:border-forest/40 transition-colors"
          >
            Join the cohort
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {/* Honeypot — hidden from real users, catches bots */}
      <input
        type="text"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <Field label="Overall, how was the training?" required>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`h-11 px-3.5 rounded-xl border text-[13px] font-medium transition-colors ${
                rating === n
                  ? "bg-forest text-ivory border-forest"
                  : "bg-white text-forest border-line hover:border-forest/40"
              }`}
            >
              {n} · {RATING_LABELS[n - 1]}
            </button>
          ))}
        </div>
      </Field>

      <TextField
        label="What was the most valuable thing you took away?"
        value={mostValuable}
        onChange={setMostValuable}
        placeholder="The one thing that clicked..."
      />
      <TextField
        label="Was anything confusing or not useful?"
        value={confusing}
        onChange={setConfusing}
        placeholder="Be honest. This is where the gold is."
      />
      <TextField
        label="What do you wish I'd covered, or gone deeper on?"
        value={wishCovered}
        onChange={setWishCovered}
        placeholder="What would've made it a 10 out of 10?"
      />

      <Scale
        label="How likely are you to get the Business Kit?"
        value={kitLikelihood}
        onChange={setKitLikelihood}
        lowLabel="Not now"
        highLabel="Already in"
      />
      <Scale
        label="How likely are you to join the cohort?"
        value={cohortLikelihood}
        onChange={setCohortLikelihood}
        lowLabel="Not now"
        highLabel="I'm in"
      />

      <TextField
        label="If you're not ready to buy yet, what's holding you back?"
        value={barrier}
        onChange={setBarrier}
        placeholder="Price, timing, need more info..."
      />
      <TextField
        label="Anything else you want me to know?"
        value={other}
        onChange={setOther}
        placeholder="Optional"
      />

      {err && <p className="text-[13.5px] text-[#9b2828]">{err}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest text-ivory py-4 rounded-full text-[14px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send my feedback"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-forest mb-2.5">
        {label}
        {required && <span className="text-brass"> *</span>}
      </label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/35 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-y"
      />
    </Field>
  );
}

function Scale({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            className={`h-11 flex-1 rounded-xl border text-[14px] font-medium transition-colors ${
              value === n
                ? "bg-brass text-ivory border-brass"
                : "bg-white text-forest border-line hover:border-forest/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[11.5px] text-mute">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </Field>
  );
}
