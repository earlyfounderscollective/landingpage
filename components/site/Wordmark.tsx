import Link from "next/link";

export function Wordmark({
  tone = "ink",
  size = "default",
}: {
  tone?: "ink" | "ivory" | "forest";
  size?: "default" | "small";
}) {
  const heightClass = size === "small" ? "h-16 md:h-20" : "h-20 md:h-24";

  // On the forest footer we invert so the dark serif logo reads against
  // the dark background. On ivory/bone sections the source artwork sits
  // naturally.
  const tonalClass = tone === "ivory" ? "brightness-0 invert opacity-95" : "";

  return (
    <Link
      href="/"
      aria-label="Early Founders Collective — Home"
      className="inline-flex items-center"
    >
      <img
        src="/logo.png"
        alt="Early Founders Collective"
        className={`${heightClass} w-auto ${tonalClass}`}
        loading="eager"
      />
    </Link>
  );
}
