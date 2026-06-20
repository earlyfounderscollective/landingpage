"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = [
  "Just started — under 6 months in",
  "6-12 months in, building",
  "1-2 years in, looking to scale",
  "Over 2 years, plateaued",
];

const REVENUE = [
  "$0 — no customers yet",
  "$1-1K/month",
  "$1K-5K/month",
  "$5K-15K/month",
  "$15K+/month",
];

const BUDGETS = [
  "Done-With-You ($1,500)",
  "Done-For-You ($3,500)",
  "Not sure yet — want to talk",
];

const TIMELINES = [
  "ASAP — ready to start in the next 2 weeks",
  "Within a month",
  "1-3 months out",
  "Just exploring",
];

export function DFYApplicationForm({ initialTier }: { initialTier?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    business_stage: "",
    monthly_revenue: "",
    what_you_sell: "",
    biggest_blocker: "",
    budget:
      initialTier === "dfy"
        ? BUDGETS[1]
        : initialTier === "dwy"
          ? BUDGETS[0]
          : "",
    timeline: "",
  });

  function set<K extends keyof typeof data>(k: K, v: (typeof data)[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.full_name.trim() || !data.email.trim()) {
      setErr("Name and email required.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/dfy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setErr("Something went wrong. Try again in a moment.");
        setSubmitting(false);
        return;
      }
      router.push("/dfy/thank-you");
    } catch {
      setErr("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Your full name *">
        <input
          type="text"
          required
          value={data.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Email *">
        <input
          type="email"
          required
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Phone (optional)">
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => set("phone", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Business name (or what you're calling it for now)">
        <input
          type="text"
          value={data.business_name}
          onChange={(e) => set("business_name", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Select
        label="Where are you in the build?"
        value={data.business_stage}
        options={STAGES}
        onChange={(v) => set("business_stage", v)}
      />

      <Select
        label="Current monthly revenue"
        value={data.monthly_revenue}
        options={REVENUE}
        onChange={(v) => set("monthly_revenue", v)}
      />

      <Field
        label="What do you sell (or plan to sell)?"
        hint="One paragraph. Don't worry about clean copy — just what it is."
      >
        <textarea
          rows={3}
          value={data.what_you_sell}
          onChange={(e) => set("what_you_sell", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field
        label="What's the biggest thing in your way right now?"
        hint="Be honest. The vague answer (&quot;marketing&quot;) is less helpful to both of us than the specific one (&quot;I've tried IG ads twice and nobody clicked&quot;)."
      >
        <textarea
          rows={3}
          value={data.biggest_blocker}
          onChange={(e) => set("biggest_blocker", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Select
        label="Which tier are you considering?"
        value={data.budget}
        options={BUDGETS}
        onChange={(v) => set("budget", v)}
      />

      <Select
        label="When would you want to start?"
        value={data.timeline}
        options={TIMELINES}
        onChange={(v) => set("timeline", v)}
      />

      {err && (
        <p className="text-[13.5px] text-[#9b2828]">{err}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest text-ivory py-4 rounded-full text-[14px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Submit my application →"}
      </button>
      <p className="text-[12px] text-mute text-center leading-[1.5]">
        I read every one. If it's a fit I'll be in touch within 48 hours.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 leading-[1.5]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-forest mb-1.5">
        {label}
      </span>
      {hint && (
        <span
          className="block text-[12.5px] text-mute mb-2 leading-[1.5]"
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      )}
      {children}
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`text-left rounded-xl border-2 px-4 py-3 text-[14.5px] transition-all ${
                active
                  ? "border-forest bg-forest/5 text-forest"
                  : "border-line bg-white text-ink/72 hover:border-forest/30"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
