/**
 * Styled visual mockups for each module of the Build Your Business Kit.
 * Used on /kit to show "what's actually inside" — each module has its own
 * card that evokes the deliverable without trying to be photorealistic.
 */

export function OfferClarityMockup() {
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 01 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        Offer Clarity Worksheet
      </h4>
      <div className="mt-4 space-y-3">
        {[
          { q: "What do you sell?", a: "Custom interior repainting for homes under contract" },
          { q: "Who is it for?", a: "Real estate agents prepping listings in Houston" },
          { q: "What's the outcome?", a: "House ready to list within 3 days" },
        ].map((item, i) => (
          <div key={i}>
            <p className="text-[8.5px] uppercase tracking-[0.14em] text-ink/45 font-medium">
              {item.q}
            </p>
            <p className="mt-1 text-[10px] font-serif text-forest leading-[1.4]">
              {item.a}
            </p>
            <div className="mt-1 h-[1px] bg-line" />
          </div>
        ))}
      </div>
      <div className="mt-4 bg-bone border border-line/60 rounded-[4px] p-2.5">
        <p className="text-[8.5px] uppercase tracking-[0.14em] text-brass font-semibold">
          Your one-sentence offer
        </p>
        <p className="mt-1 font-serif italic text-[10.5px] text-forest leading-[1.35]">
          "We paint your listing in 3 days so you can put it on the market this week."
        </p>
      </div>
    </MockupFrame>
  );
}

export function BusinessSetupMockup() {
  const sections = [
    {
      title: "Entity",
      items: [
        { label: "LLC vs Sole Prop decision", done: true },
        { label: "State filing", done: true },
        { label: "EIN from IRS", done: true },
      ],
    },
    {
      title: "Banking",
      items: [
        { label: "Separate business checking", done: true },
        { label: "Business credit card", done: false },
      ],
    },
    {
      title: "Payments",
      items: [
        { label: "Stripe / Square setup", done: false },
        { label: "Cancelled Venmo for business", done: false },
      ],
    },
  ];
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 02 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        Business Setup Checklist
      </h4>
      <div className="mt-3 space-y-3">
        {sections.map((sec) => (
          <div key={sec.title}>
            <p className="text-[8.5px] uppercase tracking-[0.16em] text-mute font-semibold mb-1.5">
              {sec.title}
            </p>
            <ul className="space-y-1.5">
              {sec.items.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-[10px] text-forest leading-[1.3]">
                  <span
                    className={`inline-flex h-3 w-3 items-center justify-center rounded-[2px] border ${
                      item.done ? "bg-forest border-forest" : "bg-white border-line"
                    } shrink-0`}
                  >
                    {item.done && (
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="#F7F2EA" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span className={item.done ? "line-through text-ink/50" : ""}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}

export function PricingMockup() {
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 03 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        Pricing Model Template
      </h4>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {[
          { label: "Time per job", value: "4 hrs" },
          { label: "Your hourly floor", value: "$80" },
          { label: "Market low", value: "$350" },
          { label: "Market high", value: "$700" },
        ].map((item) => (
          <div key={item.label} className="bg-bone/60 border border-line/60 rounded-[4px] p-2">
            <p className="text-[8px] uppercase tracking-[0.14em] text-mute font-semibold">
              {item.label}
            </p>
            <p className="mt-1 font-serif text-[13px] text-forest tabular-nums">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 bg-forest text-ivory rounded-[6px] p-2.5 text-center">
        <p className="text-[8.5px] uppercase tracking-[0.18em] text-brass font-semibold">
          Recommended start
        </p>
        <p className="mt-1 font-serif text-[20px] tabular-nums tracking-[-0.012em]">
          $495
        </p>
      </div>
    </MockupFrame>
  );
}

export function AIPromptsMockup() {
  const prompts = [
    { num: "01", title: "Voice translator" },
    { num: "02", title: "Reverse review research" },
    { num: "03", title: "Pricing logic builder" },
    { num: "04", title: "First-touch outreach" },
    { num: "05", title: "Objection responder" },
  ];
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 04 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        10 AI Prompts I Actually Use
      </h4>
      <div className="mt-3 space-y-1.5">
        {prompts.map((p) => (
          <div
            key={p.num}
            className="flex items-center justify-between bg-bone/50 border border-line/40 rounded-[4px] px-2.5 py-1.5"
          >
            <span className="flex items-center gap-2">
              <span className="font-serif text-[10px] text-brass tabular-nums">{p.num}</span>
              <span className="text-[10.5px] font-serif text-forest">{p.title}</span>
            </span>
            <span className="text-[8.5px] text-mute uppercase tracking-[0.1em]">Copy</span>
          </div>
        ))}
        <p className="text-[9px] italic text-mute text-center mt-2">+ 5 more</p>
      </div>
    </MockupFrame>
  );
}

export function PlaybookMockup() {
  const days = [
    { d: "Day 1", task: "Inventory 50 names" },
    { d: "Day 2", task: "A-list outreach (10)" },
    { d: "Day 3", task: "B-list referral asks" },
    { d: "Day 4", task: "Pick distribution channel" },
    { d: "Day 5", task: "Tracking + rhythm setup" },
  ];
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 05 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        First 30 Customers Playbook
      </h4>
      <p className="mt-1 text-[9.5px] italic text-mute">Five-day execution sprint</p>
      <ol className="mt-3 space-y-2">
        {days.map((d, i) => (
          <li key={d.d} className="grid grid-cols-[36px_1fr_auto] items-center gap-2.5 bg-bone/50 border border-line/40 rounded-[4px] px-2 py-1.5">
            <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-brass">
              {d.d}
            </span>
            <span className="text-[10px] font-serif text-forest leading-[1.25]">
              {d.task}
            </span>
            <span className={`inline-flex h-3 w-3 items-center justify-center rounded-full ${i < 2 ? "bg-forest" : "bg-line"}`}>
              {i < 2 && (
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#F7F2EA" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </li>
        ))}
      </ol>
    </MockupFrame>
  );
}

export function LeadTrackerMockup() {
  const rows = [
    { name: "Carlos M.", src: "IG DM", status: "Proposal", value: "$3,200" },
    { name: "Anna K.", src: "Referral", status: "Warmed", value: "$1,800" },
    { name: "James R.", src: "Google", status: "Closed", value: "$4,500" },
    { name: "Tomi A.", src: "IG DM", status: "Lead", value: "$1,200" },
  ];
  return (
    <MockupFrame>
      <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-brass">
        Module 06 · EFC
      </div>
      <h4 className="mt-1 font-serif text-[15px] md:text-[17px] text-forest leading-[1.2]">
        Lead Tracker Sheet
      </h4>
      <div className="mt-3 border border-line/60 rounded-[4px] overflow-hidden">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] bg-bone/70 px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-mute">
          <span>Name</span>
          <span>Source</span>
          <span>Status</span>
          <span className="text-right">Value</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={`grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] px-2 py-1.5 text-[9.5px] font-serif text-forest ${i < rows.length - 1 ? "border-b border-line/30" : ""}`}
          >
            <span>{r.name}</span>
            <span className="text-ink/60">{r.src}</span>
            <span className="text-ink/60">{r.status}</span>
            <span className="text-right tabular-nums">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[8.5px] uppercase tracking-[0.14em]">
        <span className="text-mute">Pipeline</span>
        <span className="text-brass font-semibold tabular-nums">$10,700</span>
      </div>
    </MockupFrame>
  );
}

function MockupFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-br from-brass/15 to-transparent rounded-2xl blur-md" aria-hidden />
      <div className="relative bg-ivory border border-line/50 rounded-xl shadow-[0_24px_60px_-20px_rgba(35,53,45,0.35)] p-5 md:p-6">
        {children}
      </div>
    </div>
  );
}
