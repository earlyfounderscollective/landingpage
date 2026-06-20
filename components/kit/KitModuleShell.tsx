import Link from "next/link";
import { KIT_MODULES, type KitModuleSlug } from "@/lib/kit-modules";

export function KitModuleHeader({
  slug,
  subtitle,
}: {
  slug: KitModuleSlug;
  subtitle?: string;
}) {
  const idx = KIT_MODULES.findIndex((m) => m.slug === slug);
  const m = KIT_MODULES[idx];
  const prev = idx > 0 ? KIT_MODULES[idx - 1] : null;
  const next = idx < KIT_MODULES.length - 1 ? KIT_MODULES[idx + 1] : null;

  return (
    <div className="mb-10 md:mb-12">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/kit/access"
          className="text-[12.5px] text-mute hover:text-forest transition-colors inline-flex items-center gap-1"
        >
          <span aria-hidden>←</span> All modules
        </Link>
        <div className="flex items-center gap-4 text-[11.5px] text-mute">
          {prev && (
            <Link
              href={`/kit/access/${prev.slug}`}
              className="hover:text-forest transition-colors"
            >
              ← {prev.n}
            </Link>
          )}
          {next && (
            <Link
              href={`/kit/access/${next.slug}`}
              className="hover:text-forest transition-colors"
            >
              {next.n} →
            </Link>
          )}
        </div>
      </div>
      <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-3">
        Module {m.n} · {m.estimate}
      </p>
      <h1 className="font-serif text-[34px] md:text-[44px] leading-[1.05] tracking-[-0.018em] text-forest">
        {m.title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-[15.5px] text-ink/72 max-w-[640px] leading-[1.6]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function KitModuleNext({
  currentSlug,
}: {
  currentSlug: KitModuleSlug;
}) {
  const idx = KIT_MODULES.findIndex((m) => m.slug === currentSlug);
  const next = idx < KIT_MODULES.length - 1 ? KIT_MODULES[idx + 1] : null;

  if (!next) {
    return (
      <div className="mt-16 bg-forest text-ivory rounded-2xl p-7 text-center">
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
          That's the kit.
        </p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3]">
          You finished all six modules. Now go ship.
        </p>
        <Link
          href="/kit/access"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-brass text-ivory px-6 py-3 text-[13px] font-semibold tracking-[0.04em] uppercase hover:bg-[#8a6c3f] transition-colors"
        >
          Back to dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-16 bg-bone border border-line/60 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass">
          Next module · {next.estimate}
        </p>
        <p className="mt-2 font-serif text-[20px] md:text-[22px] leading-[1.25] text-forest">
          {next.n} · {next.title}
        </p>
      </div>
      <Link
        href={`/kit/access/${next.slug}`}
        className="bg-forest text-ivory px-5 py-3 rounded-full text-[13px] font-medium tracking-[0.02em] hover:bg-ink transition-colors text-center"
      >
        Open {next.n} →
      </Link>
    </div>
  );
}
