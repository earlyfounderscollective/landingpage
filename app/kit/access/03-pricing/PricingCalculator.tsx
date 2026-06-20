"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type PricingData = {
  hours_per_job: string;
  hourly_floor: string;
  market_low: string;
  market_high: string;
  positioning: "low" | "middle" | "high";
  final_price: string;
};

function num(v: string): number {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function PricingCalculator({ initial }: { initial: PricingData }) {
  const { data, setData, status } = useKitAutoSave<PricingData>({
    moduleSlug: "03-pricing",
    initial,
    isComplete: (d) => Boolean(d.final_price),
  });

  const hours = num(data.hours_per_job);
  const floor = num(data.hourly_floor);
  const low = num(data.market_low);
  const high = num(data.market_high);
  const floorTotal = hours * floor;
  const middle = low && high ? Math.round((low + high) / 2) : 0;
  const recommended = data.positioning === "low" ? low : data.positioning === "high" ? high : middle;

  function set<K extends keyof PricingData>(key: K, value: PricingData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          Your numbers
        </p>
        <SaveIndicator status={status} />
      </div>

      <section className="bg-white border border-line rounded-2xl p-6 md:p-7 mb-6">
        <h3 className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-brass mb-4">
          Your cost floor
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label="Hours per job"
            value={data.hours_per_job}
            onChange={(v) => set("hours_per_job", v)}
            suffix="hrs"
            placeholder="4"
          />
          <NumberInput
            label="Your hourly floor"
            value={data.hourly_floor}
            onChange={(v) => set("hourly_floor", v)}
            prefix="$"
            placeholder="80"
            hint="The lowest hourly rate you'll accept after expenses."
          />
        </div>
        {floorTotal > 0 && (
          <div className="mt-5 pt-5 border-t border-line/60 flex items-center justify-between">
            <span className="text-[12.5px] uppercase tracking-[0.18em] text-mute font-semibold">
              Your floor per job
            </span>
            <span className="font-serif text-[24px] text-forest tabular-nums">
              ${floorTotal.toLocaleString()}
            </span>
          </div>
        )}
      </section>

      <section className="bg-white border border-line rounded-2xl p-6 md:p-7 mb-6">
        <h3 className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">
          The market range
        </h3>
        <p className="text-[13px] text-mute leading-[1.55] mb-4">
          Look up 3-5 competitors. What's the cheapest one charging? The most expensive?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            label="Market low"
            value={data.market_low}
            onChange={(v) => set("market_low", v)}
            prefix="$"
            placeholder="350"
          />
          <NumberInput
            label="Market high"
            value={data.market_high}
            onChange={(v) => set("market_high", v)}
            prefix="$"
            placeholder="700"
          />
        </div>
      </section>

      <section className="bg-white border border-line rounded-2xl p-6 md:p-7 mb-6">
        <h3 className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-brass mb-4">
          Where do you want to land?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(["low", "middle", "high"] as const).map((p) => {
            const labels = {
              low: { title: "Discount", desc: "Win on price. Hard to defend." },
              middle: { title: "Market", desc: "Where most competitors sit." },
              high: { title: "Premium", desc: "Best results. Most demanding." },
            };
            const isActive = data.positioning === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => set("positioning", p)}
                className={`text-left rounded-xl border-2 p-4 transition-all ${
                  isActive
                    ? "border-forest bg-forest/5"
                    : "border-line bg-white hover:border-forest/30"
                }`}
              >
                <p className={`font-serif text-[16px] mb-1 ${isActive ? "text-forest" : "text-ink/70"}`}>
                  {labels[p].title}
                </p>
                <p className="text-[11.5px] text-mute leading-[1.4]">
                  {labels[p].desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-brass/40 bg-forest p-6 md:p-7 text-center text-ivory">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass">
          Recommended start
        </p>
        <p className="mt-2 font-serif text-[48px] md:text-[56px] leading-none tabular-nums">
          {recommended ? `$${recommended.toLocaleString()}` : "—"}
        </p>
        {floorTotal > 0 && recommended > 0 && recommended < floorTotal && (
          <p className="mt-3 text-[12.5px] text-brass">
            ⚠ This is below your floor (${floorTotal.toLocaleString()}). Raise the price or cut hours.
          </p>
        )}
        <div className="mt-6">
          <label className="block">
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-brass mb-2">
              Your final price (what you'll quote)
            </span>
            <div className="max-w-[280px] mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-[20px] text-ivory">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={data.final_price}
                onChange={(e) => set("final_price", e.target.value)}
                placeholder={recommended ? String(recommended) : "495"}
                className="w-full rounded-xl border border-ivory/20 bg-ivory/10 pl-9 pr-4 py-3 text-center text-[22px] font-serif text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-brass focus:bg-ivory/15"
              />
            </div>
          </label>
        </div>
      </section>
    </>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-mute mb-1.5">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest text-[15px]">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-line bg-white py-3 text-[15px] text-forest tabular-nums placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 ${prefix ? "pl-7" : "pl-4"} ${suffix ? "pr-12" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mute text-[12px]">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <span className="mt-1 block text-[11.5px] text-mute leading-[1.4]">
          {hint}
        </span>
      )}
    </label>
  );
}
