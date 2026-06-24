import Link from "next/link";

/**
 * Logo-only header for funnel pages. No nav, no exploration paths.
 * Stays sticky-transparent so the hero behind it shows through.
 */
export function FunnelHeader({
  tone = "auto",
}: {
  tone?: "auto" | "light" | "dark";
}) {
  // "auto" = use the natural color of the logo against the page bg.
  // "light" = invert for use on dark/forest hero backgrounds.
  const invert = tone === "light";
  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="container-page py-6 md:py-8 pointer-events-auto flex justify-center md:justify-start">
        <Link href="/" aria-label="Early Founders Collective — Home">
          <img
            src="/logo.png"
            alt="Early Founders Collective"
            className={`h-12 md:h-14 w-auto ${invert ? "brightness-0 invert opacity-95" : ""}`}
            loading="eager"
          />
        </Link>
      </div>
    </header>
  );
}

/**
 * Minimal funnel footer. Three legal links + copyright. Nothing else.
 */
export function FunnelFooter() {
  return (
    <footer className="bg-bone border-t border-line/60">
      <div className="container-page py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-mute">
          <p>© Early Founders Collective</p>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/privacy" className="hover:text-forest">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-forest">
                Terms
              </Link>
            </li>
            <li>
              <a
                href="mailto:contact@earlyfounderscollective.com"
                className="hover:text-forest"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
