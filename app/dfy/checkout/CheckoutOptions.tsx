"use client";

import { useState } from "react";

type Pricing = {
  fullPriceCents: number;
  installmentCents: number;
  affirmMinMonthlyCents: number;
};

type Features = {
  payInFull: boolean;
  installments: boolean;
  affirm: boolean;
};

type Plan = "full" | "installments" | "affirm";

export function CheckoutOptions({
  appId,
  token,
  pricing,
  features,
}: {
  appId: string;
  token: string;
  pricing: Pricing;
  features: Features;
}) {
  const [selected, setSelected] = useState<Plan>("full");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const options: { plan: Plan; enabled: boolean; title: string; sub: string; badge?: string }[] = [
    {
      plan: "full",
      enabled: features.payInFull,
      title: `Pay in full — $${(pricing.fullPriceCents / 100).toLocaleString()}`,
      sub: "One payment, locked in today. Most chosen.",
      badge: "Most chosen",
    },
    {
      plan: "installments",
      enabled: features.installments,
      title: `Two payments — $${(pricing.installmentCents / 100).toLocaleString()} now / $${(pricing.installmentCents / 100).toLocaleString()} week 4`,
      sub: "Auto-charged at week four. Same total.",
    },
    {
      plan: "affirm",
      enabled: features.affirm,
      title: `Monthly with Affirm — from $${(pricing.affirmMinMonthlyCents / 100).toLocaleString()}/mo`,
      sub: "Pay over 12-24 months. Subject to Affirm approval.",
    },
  ];

  const visible = options.filter((o) => o.enabled);

  async function onSubmit() {
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/dfy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, token, plan: selected }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setErr(json.error || "Couldn't start checkout. Try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setErr("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-serif text-[24px] md:text-[26px] text-forest mb-1 leading-[1.2]">
        How would you like to pay?
      </h2>
      <p className="text-[13.5px] text-mute mb-6 leading-[1.55]">
        All options include the full 6-week engagement.
      </p>

      <div className="space-y-3">
        {visible.map((opt) => {
          const active = selected === opt.plan;
          return (
            <button
              key={opt.plan}
              type="button"
              onClick={() => setSelected(opt.plan)}
              className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                active
                  ? "border-forest bg-forest/[0.03]"
                  : "border-line bg-white hover:border-forest/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-forest bg-forest" : "border-line bg-white"
                    }`}
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-ivory" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className={`font-serif text-[17px] md:text-[18px] leading-[1.3] ${active ? "text-forest" : "text-ink/80"}`}>
                      {opt.title}
                    </p>
                    <p className="mt-1 text-[13px] text-mute leading-[1.5]">
                      {opt.sub}
                    </p>
                  </div>
                </div>
                {opt.badge && (
                  <span className="shrink-0 text-[10px] font-semibold tracking-[0.16em] uppercase bg-brass text-ivory px-2.5 py-1 rounded-full">
                    {opt.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {err && (
        <p className="mt-4 text-[13.5px] text-[#9b2828]">{err}</p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full mt-7 bg-forest text-ivory py-4 rounded-full text-[14px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
      >
        {submitting ? "Opening checkout…" : "Continue to secure checkout →"}
      </button>
    </div>
  );
}
