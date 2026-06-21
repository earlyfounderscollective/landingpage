"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#what-you-get", label: "What You Get" },
  { href: "/#founder", label: "Founder" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

export function Header({
  tone = "light",
  minimal = false,
}: { tone?: "light" | "dark"; minimal?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const useDark = tone === "dark" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-editorial ${
          scrolled
            ? "bg-ivory/85 backdrop-blur-md border-b border-line/60"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className={`container-page relative flex h-[96px] md:h-[112px] items-center ${minimal ? "justify-center" : "justify-center sm:justify-between"}`}>
          <Wordmark size="small" tone={useDark ? "ivory" : "ink"} />

          {!minimal && (
            <>
              <nav className="hidden lg:flex items-center gap-9">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-[13.5px] font-medium tracking-[0.01em] transition-colors ${
                      useDark
                        ? "text-ivory/75 hover:text-ivory"
                        : "text-forest/75 hover:text-forest"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/apply"
                className={`hidden sm:inline-flex items-center rounded-full text-[13px] font-medium tracking-[0.02em] px-6 py-2.5 transition-all duration-500 ease-editorial ${
                  useDark
                    ? "bg-brass text-ivory hover:bg-[#8a6c3f]"
                    : "bg-forest text-ivory hover:bg-ink"
                }`}
              >
                Apply
              </Link>

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="lg:hidden absolute right-6 md:right-10 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:ml-3 h-10 w-10 inline-flex flex-col items-center justify-center gap-1.5"
              >
                <span className={`block h-[1.5px] w-5 ${useDark ? "bg-ivory" : "bg-forest"}`} />
                <span className={`block h-[1.5px] w-5 ${useDark ? "bg-ivory" : "bg-forest"}`} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile menu — full-screen overlay above all page content */}
      {!minimal && (
      <div
        className={`lg:hidden fixed inset-0 z-[100] bg-ivory transition-all duration-500 ease-editorial ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full">
          {/* Menu top bar */}
          <div className="container-page flex h-[96px] md:h-[112px] items-center justify-between border-b border-line/40 shrink-0">{/* mobile menu top bar */}
            <Wordmark size="small" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="h-10 w-10 inline-flex items-center justify-center relative"
            >
              <span className="absolute h-[1.5px] w-5 bg-forest rotate-45" />
              <span className="absolute h-[1.5px] w-5 bg-forest -rotate-45" />
            </button>
          </div>

          {/* Menu body */}
          <div className="container-page py-10 flex-1 flex flex-col gap-6 overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-[34px] leading-[1.1] text-forest"
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="btn-primary self-start mt-6"
            >
              Apply for Access
            </Link>

            <div className="mt-auto pt-10 text-[12px] uppercase tracking-[0.28em] text-forest/55">
              contact@earlyfounderscollective.com
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
