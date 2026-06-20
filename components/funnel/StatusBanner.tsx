export type BannerTone = "registered" | "vip-success" | "free-success";

const TONES: Record<
  BannerTone,
  { bg: string; text: string; check: string; label: string }
> = {
  registered: {
    bg: "bg-forest",
    text: "text-ivory",
    check: "bg-ivory text-forest",
    label: "REGISTERED · ONE MORE STEP. DON'T EXIT.",
  },
  "vip-success": {
    bg: "bg-[#1b6b3a]",
    text: "text-ivory",
    check: "bg-ivory text-[#1b6b3a]",
    label: "VIP PURCHASE SUCCESSFUL",
  },
  "free-success": {
    bg: "bg-forest",
    text: "text-ivory",
    check: "bg-ivory text-forest",
    label: "REGISTRATION SUCCESSFUL",
  },
};

export function StatusBanner({
  tone,
  label,
}: {
  tone: BannerTone;
  label?: string;
}) {
  const t = TONES[tone];
  return (
    <div className={`${t.bg} ${t.text} w-full`}>
      <div className="container-page py-3 md:py-3.5 flex items-center justify-center gap-2.5">
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${t.check}`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5L4 7L8 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.18em] uppercase">
          {label ?? t.label}
        </p>
      </div>
    </div>
  );
}
