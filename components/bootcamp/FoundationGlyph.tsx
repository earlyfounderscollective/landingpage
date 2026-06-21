/**
 * Geometric glyph that pairs with each Foundation card. Numbered
 * in Roman and accented with a brand-aligned abstract shape so the
 * grid reads as designed, not as plain text bullets.
 */
type Variant = "clarity" | "structure" | "customers" | "growth";

export function FoundationGlyph({
  variant,
  index,
}: {
  variant: Variant;
  index: number;
}) {
  const roman = ["I", "II", "III", "IV"][index] ?? "";

  return (
    <div className="relative inline-flex items-center justify-center w-[88px] h-[88px] mb-5">
      {/* Brass ring */}
      <div className="absolute inset-0 rounded-full border-[1.5px] border-brass/50" />
      <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-brass/8 to-brass/0" />
      {/* Glyph */}
      <svg
        viewBox="0 0 56 56"
        className="absolute inset-0 w-full h-full p-3 text-brass/70"
        aria-hidden
      >
        {variant === "clarity" && (
          <>
            <circle
              cx="28"
              cy="28"
              r="20"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="28" cy="28" r="4" fill="currentColor" />
            <line
              x1="28"
              y1="28"
              x2="44"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        )}
        {variant === "structure" && (
          <>
            <rect
              x="10"
              y="10"
              width="36"
              height="36"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <line x1="10" y1="22" x2="46" y2="22" stroke="currentColor" strokeWidth="1.2" />
            <line x1="10" y1="34" x2="46" y2="34" stroke="currentColor" strokeWidth="1.2" />
            <line x1="22" y1="10" x2="22" y2="46" stroke="currentColor" strokeWidth="1.2" />
            <line x1="34" y1="10" x2="34" y2="46" stroke="currentColor" strokeWidth="1.2" />
          </>
        )}
        {variant === "customers" && (
          <>
            <circle cx="18" cy="22" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <circle cx="38" cy="22" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <path
              d="M8 42 C 8 32, 28 32, 28 42"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M28 42 C 28 32, 48 32, 48 42"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </>
        )}
        {variant === "growth" && (
          <>
            <polyline
              points="8,42 18,32 26,38 38,20 48,12"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="42,12 48,12 48,18"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
      {/* Roman numeral floating */}
      <span className="absolute -top-1 -right-1 font-serif text-[12px] text-brass bg-ivory border border-brass/60 rounded-full h-6 w-6 inline-flex items-center justify-center">
        {roman}
      </span>
    </div>
  );
}
