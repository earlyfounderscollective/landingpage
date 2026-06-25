"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/training", label: "Training" },
  { href: "/admin/bootcamp", label: "Bootcamp" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/referrals", label: "Referrals" },
  { href: "/admin/images", label: "Images" },
];

export function AdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop nav — md+ */}
      <nav className="hidden md:flex items-center gap-6 text-[13px]">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`hover:text-brass transition-colors ${
              pathname === l.href ? "text-brass" : ""
            }`}
          >
            {l.label}
          </Link>
        ))}
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="hover:text-brass transition-colors">
            Sign out
          </button>
        </form>
      </nav>

      {/* Mobile hamburger button */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center -mr-2"
      >
        {open ? (
          <span className="relative inline-block h-4 w-4">
            <span className="absolute inset-x-0 top-1/2 h-[1.5px] bg-ivory rotate-45" />
            <span className="absolute inset-x-0 top-1/2 h-[1.5px] bg-ivory -rotate-45" />
          </span>
        ) : (
          <span className="inline-flex flex-col gap-1.5">
            <span className="block h-[1.5px] w-5 bg-ivory" />
            <span className="block h-[1.5px] w-5 bg-ivory" />
          </span>
        )}
      </button>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-forest border-t border-ivory/10 shadow-lg transition-all duration-200 ${
          open
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <div className="container-page py-3 flex flex-col">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-3 text-[15px] border-b border-ivory/8 ${
                pathname === l.href ? "text-brass" : "text-ivory/85"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <form action="/api/admin/logout" method="POST" className="pt-2">
            <button
              type="submit"
              className="py-3 text-[14px] text-ivory/65 hover:text-brass tracking-[0.02em]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
