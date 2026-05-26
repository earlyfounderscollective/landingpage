import Link from "next/link";

export function Wordmark({
  tone = "ink",
  size = "default",
}: {
  tone?: "ink" | "ivory" | "forest";
  size?: "default" | "small";
}) {
  const colorClass =
    tone === "ivory" ? "text-ivory" : tone === "forest" ? "text-forest" : "text-ink";

  const sizeClass = size === "small" ? "text-[13px]" : "text-[14px]";

  return (
    <Link
      href="/"
      aria-label="Early Founders Collective — Home"
      className={`group inline-flex flex-col leading-none ${colorClass}`}
    >
      <span
        className={`font-serif font-medium tracking-[-0.012em] ${
          size === "small" ? "text-[17px]" : "text-[19px]"
        }`}
      >
        Early Founders
      </span>
      <span
        className={`mt-[2px] font-sans uppercase tracking-[0.28em] opacity-70 ${sizeClass}`}
      >
        Collective
      </span>
    </Link>
  );
}
