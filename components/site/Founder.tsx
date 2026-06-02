const ventures = [
  "Founder of Paint HTX, a Houston-based painting company that grew to six figures in its first year",
  "Built Phēnyx into a six-figure supplement brand",
  "Helped build a six-figure investment club focused on wealth creation and financial education",
  "Co-founded SoleTies Run Club, one of Houston's largest running communities, with hundreds of runners and partnerships with major brands",
  "Experience across mortgage lending, real estate investing, renovation consulting, community building, and software development",
];

export function Founder() {
  return (
    <section id="founder" className="bg-bone py-20 md:py-28 grain">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
          {/* Content column */}
          <div className="lg:col-span-6">
            <p className="hand text-[34px] md:text-[40px] leading-[0.9] rotate-[-3deg] text-brass">
              Clarity creates
              <br />
              customers.
            </p>

            <h2 className="mt-8 font-serif text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.018em] text-forest text-balance">
              Meet Oge Madu.
            </h2>

            <div className="mt-7 space-y-4 text-[15px] md:text-[15.5px] leading-[1.6] text-ink/78 max-w-prose">
              <p>
                Oge Madu is a founder, operator, and community builder who has
                spent the last decade building businesses across service,
                product, community, real estate, and technology.
              </p>
            </div>

            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-forest">
              A few of the builds:
            </p>
            <ul className="mt-4 space-y-2.5">
              {ventures.map((v) => (
                <li
                  key={v}
                  className="grid grid-cols-[auto_1fr] items-start gap-3 text-[14.5px] leading-[1.55] text-ink/80"
                >
                  <span className="mt-[11px] h-[1.5px] w-3 bg-brass" aria-hidden />
                  {v}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4 text-[15px] md:text-[15.5px] leading-[1.6] text-ink/78 max-w-prose">
              <p>
                Across every business, one lesson has remained consistent:
              </p>
              <p className="font-serif italic text-[17px] md:text-[18.5px] leading-[1.45] text-forest text-balance">
                Most founders do not need more information. They need more
                clarity, better systems, stronger relationships, and a clear
                path to customers.
              </p>
            </div>

            <p className="mt-10 hand text-[30px] leading-none text-forest/85 rotate-[-2deg]">
              Oge
            </p>
          </div>

          {/* Imagery column — one anchor, two proof fragments */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              {/* Dominant anchor — calm operator portrait */}
              <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-forest/95 shadow-card">
                <img
                  src="/media/founder-portrait.jpg"
                  alt="Ogechukwu Madu, operator and founder of Early Founders Collective"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest/40 via-forest/10 to-transparent pointer-events-none" />
              </figure>

              {/* Two supporting fragments — quiet proof */}
              <div className="mt-4 md:mt-5 grid grid-cols-2 gap-4 md:gap-5">
                <figure>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-forest/95 shadow-card">
                    <img
                      src="/media/paint-htx.jpg"
                      alt="Paint HTX — residential painting business on a jobsite"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 text-[10.5px] uppercase tracking-[0.24em] text-forest/60">
                    Paint HTX &middot; Residential
                  </figcaption>
                </figure>

                <figure>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-forest/95 shadow-card">
                    <img
                      src="/media/jolie.jpg"
                      alt="Jolie — hospitality and cocktail bar"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 text-[10.5px] uppercase tracking-[0.24em] text-forest/60">
                    Cocktail bar &middot; Jolie
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
