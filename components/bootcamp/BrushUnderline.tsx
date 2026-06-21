/**
 * SVG brush stroke that sits under a span of text — mimics the
 * hand-drawn underline style on premium landing pages.
 */
export function BrushUnderline({
  children,
  color = "currentColor",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 300 18"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 -bottom-1 md:-bottom-2 w-full h-[14px] md:h-[18px] -z-0"
      >
        <path
          d="M2 14C 60 4, 120 4, 180 8 S 280 16, 298 12"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M6 16C 80 8, 160 8, 220 12 S 290 14, 296 14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
      </svg>
    </span>
  );
}
