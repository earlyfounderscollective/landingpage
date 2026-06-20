"use client";

import { SaveIndicator, useKitAutoSave } from "@/lib/use-kit-auto-save";

export type BusinessSetupData = {
  checked: Record<string, boolean>;
  notes: string;
};

type Section = {
  title: string;
  items: { id: string; label: string; hint?: string; link?: { label: string; href: string } }[];
};

const SECTIONS: Section[] = [
  {
    title: "Entity",
    items: [
      {
        id: "entity-decide",
        label: "Decide: LLC vs Sole Prop",
        hint: "LLC if you have any personal assets to protect or plan to hire. Sole prop is fine to start if you're solo and low-risk.",
      },
      {
        id: "entity-file",
        label: "File with your state",
        hint: "Search '[your state] secretary of state LLC filing'. Usually $50–$300, done online in 15 minutes.",
      },
      {
        id: "entity-ein",
        label: "Get your EIN from the IRS",
        link: { label: "IRS EIN application", href: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
        hint: "Free, takes 10 minutes. You need this to open a business bank account.",
      },
      {
        id: "entity-operating",
        label: "Save your operating agreement / articles",
      },
    ],
  },
  {
    title: "Banking",
    items: [
      {
        id: "bank-checking",
        label: "Open a business checking account",
        hint: "Bring your EIN + entity docs. Mercury, Relay, or your local bank. Pick what's least friction.",
      },
      {
        id: "bank-card",
        label: "Get a business credit or debit card",
      },
      {
        id: "bank-separate",
        label: "Move all business income/expenses to this account only",
        hint: "The day you start mixing personal + business is the day taxes get painful.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        id: "pay-stripe",
        label: "Set up Stripe or Square",
        hint: "Stripe for online. Square for in-person. Both for both. Set up the business bank as the payout account.",
      },
      {
        id: "pay-stop-venmo",
        label: "Stop accepting payments through personal Venmo / Cash App",
        hint: "Mixing personal + business payment apps creates a tax-reporting mess. Once business is set up, route everything through the business stack.",
      },
      {
        id: "pay-invoicing",
        label: "Pick an invoicing tool (Stripe Invoicing, Wave, or QuickBooks)",
      },
    ],
  },
  {
    title: "Taxes & books",
    items: [
      {
        id: "tax-quarterly",
        label: "Add the four quarterly estimated tax dates to your calendar",
        hint: "April 15, June 15, Sept 15, Jan 15. Most new business owners miss these and get hit with penalties.",
      },
      {
        id: "tax-savings",
        label: "Open a separate savings account for taxes",
        hint: "Move 25–30% of every payment into it the day it lands. Future-you will not regret this.",
      },
      {
        id: "tax-bookkeeper",
        label: "Pick a bookkeeper or simple system (Wave, QuickBooks Simple Start)",
      },
    ],
  },
];

const TOTAL_ITEMS = SECTIONS.reduce((acc, s) => acc + s.items.length, 0);

export function BusinessSetupChecklist({ initial }: { initial: BusinessSetupData }) {
  const { data, setData, status } = useKitAutoSave<BusinessSetupData>({
    moduleSlug: "02-business-setup",
    initial,
    isComplete: (d) => Object.values(d.checked).filter(Boolean).length >= TOTAL_ITEMS,
  });

  const doneCount = Object.values(data.checked).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL_ITEMS) * 100);

  function toggle(id: string) {
    setData((d) => ({
      ...d,
      checked: { ...d.checked, [id]: !d.checked[id] },
    }));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-mute">
          {doneCount} of {TOTAL_ITEMS} done · {pct}%
        </p>
        <SaveIndicator status={status} />
      </div>

      <div className="h-[5px] bg-bone rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-gradient-to-r from-[#9B7A4A] to-[#B59164] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h3 className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-brass mb-4">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.items.map((item) => {
                const isDone = Boolean(data.checked[item.id]);
                return (
                  <li
                    key={item.id}
                    className={`bg-white border border-line rounded-xl p-4 md:p-5 transition-all ${isDone ? "opacity-65" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
                          isDone
                            ? "bg-forest border-forest"
                            : "bg-white border-line hover:border-forest/40"
                        }`}
                      >
                        {isDone && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6.5L4.5 9L10 3"
                              stroke="#F7F2EA"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1">
                        <p className={`font-serif text-[16px] leading-[1.35] ${isDone ? "line-through text-ink/50" : "text-forest"}`}>
                          {item.label}
                        </p>
                        {item.hint && (
                          <p className="mt-1 text-[13px] text-mute leading-[1.5]">
                            {item.hint}
                          </p>
                        )}
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 inline-flex items-center text-[12.5px] text-forest underline decoration-brass underline-offset-2 hover:text-brass"
                          >
                            {item.link.label} ↗
                          </a>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <label className="block mt-10">
        <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-mute mb-2">
          Notes / questions to ask your accountant
        </span>
        <textarea
          value={data.notes}
          onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
          rows={4}
          placeholder="State filing fee was $X. Need to ask about quarterly estimates..."
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none leading-[1.5]"
        />
      </label>
    </>
  );
}
