/**
 * Small avatar cluster + label — mimics the "Trusted by 2000+" strip
 * but honest: shows the actual businesses we've worked with (initials
 * in brass circles), no fake graduate counts.
 */
const FOUNDERS = [
  { initials: "PH", label: "Paint HTX" },
  { initials: "PX", label: "Phēnyx" },
  { initials: "ST", label: "SoleTies" },
  { initials: "HR", label: "Holistic Roots" },
  { initials: "LR", label: "Ladies of Richmond" },
];

export function TrustStrip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const onDark = tone === "dark";
  return (
    <div className="inline-flex items-center gap-4">
      <div className="flex -space-x-3">
        {FOUNDERS.map((f, i) => (
          <span
            key={f.label}
            title={f.label}
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide ring-2 ${
              onDark ? "ring-forest" : "ring-ivory"
            }`}
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(135deg, #9B7A4A 0%, #B59164 100%)"
                  : "linear-gradient(135deg, #23352D 0%, #2f4a3f 100%)",
              color: i % 2 === 0 ? "#23352D" : "#F7F2EA",
            }}
            aria-hidden
          >
            {f.initials}
          </span>
        ))}
      </div>
      <p
        className={`text-[12.5px] md:text-[13px] tracking-[0.06em] leading-[1.45] ${
          onDark ? "text-ivory/72" : "text-ink/72"
        }`}
      >
        Trusted by founders like{" "}
        <span className={onDark ? "text-ivory" : "text-forest"}>
          Paint HTX
        </span>
        ,{" "}
        <span className={onDark ? "text-ivory" : "text-forest"}>
          Holistic Roots
        </span>
        , &{" "}
        <span className={onDark ? "text-ivory" : "text-forest"}>
          Ladies of Richmond
        </span>
        .
      </p>
    </div>
  );
}
