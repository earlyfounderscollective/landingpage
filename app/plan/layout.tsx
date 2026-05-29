import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Plan",
  description:
    "Your guided operating plan. Built inside Early Founders Collective.",
  robots: { index: false, follow: false },
};

function PlanHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-line/60">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex h-[68px] items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-[18px] font-medium tracking-[-0.012em] text-forest">
              Early Founders
            </span>
            <span className="mt-[2px] text-[8.5px] uppercase tracking-[0.28em] text-forest/70">
              Collective
            </span>
          </Link>
          <span className="h-5 w-px bg-line" aria-hidden />
          <Link
            href="/plan"
            className="font-serif text-[18px] text-forest"
          >
            The <span className="italic text-brass">Plan</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-[13px]">
          <Link href="/plan" className="text-forest font-medium">
            Plan
          </Link>
          <a
            href="https://app.theoperatorera.com/c/early-founders-collective/feed"
            target="_blank"
            rel="noreferrer"
            className="text-mute hover:text-forest transition-colors"
          >
            Community ↗
          </a>
          <Link
            href="/"
            className="text-mute hover:text-forest transition-colors hidden sm:inline"
          >
            Main site
          </Link>
          <span className="h-8 w-8 rounded-full bg-forest text-ivory flex items-center justify-center font-serif text-[13px]">
            O
          </span>
        </nav>
      </div>
    </header>
  );
}

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory grain">
      <PlanHeader />
      {children}
    </div>
  );
}
