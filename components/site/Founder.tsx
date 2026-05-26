const ventures = [
  "Generated 7 figures in hospitality revenue while owning and operating a cocktail bar",
  "Built a six-figure residential painting company in under 6 months",
  "Built a six-figure supplement brand",
  "Built a stock investment club that grew to six figures in assets",
  "Co-founded one of Houston's largest run clubs with major brand sponsorships and partnerships",
  "Developed operational systems and CRM tools for service businesses",
  "Worked on real estate redevelopment projects transforming tear-down properties into beautiful homes",
];

type Tile =
  | { kind: "image"; src: string; alt: string; span?: string }
  | { kind: "label"; label: string; sub?: string; tone: "dark" | "brand"; span?: string };

const tiles: Tile[] = [
  {
    kind: "image",
    src: "/media/founder-headshot.jpg",
    alt: "Ogechukwu Madu",
    span: "row-span-2",
  },
  {
    kind: "image",
    src: "/media/run-club.jpg",
    alt: "Run club community in Houston",
  },
  {
    kind: "label",
    label: "BUILT\nDIFFERENT",
    sub: "Supplements",
    tone: "dark",
  },
  {
    kind: "image",
    src: "/media/speaking.jpg",
    alt: "Inside the room — founder conversation",
  },
  {
    kind: "label",
    label: "PAINT HTX",
    sub: "Residential",
    tone: "brand",
  },
  {
    kind: "image",
    src: "/media/real-estate.jpg",
    alt: "Real estate project — rebuilt home",
  },
];

function GridTile({ tile }: { tile: Tile }) {
  if (tile.kind === "image") {
    return (
      <figure
        className={`relative aspect-square w-full overflow-hidden rounded-card bg-forest/95 shadow-card ${
          tile.span ?? ""
        }`}
        style={tile.span === "row-span-2" ? { aspectRatio: "1 / 2" } : undefined}
      >
        <img
          src={tile.src}
          alt={tile.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </figure>
    );
  }
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-card shadow-card flex items-center justify-center text-center grain ${
        tile.tone === "dark" ? "bg-ink text-ivory" : "bg-forest text-ivory"
      } ${tile.span ?? ""}`}
    >
      <div className="px-4">
        <p className="font-serif text-[22px] md:text-[26px] leading-[1.0] tracking-[0.02em] whitespace-pre-line">
          {tile.label}
        </p>
        {tile.sub && (
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-ivory/65">
            {tile.sub}
          </p>
        )}
      </div>
    </div>
  );
}

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
              momentum.
            </p>

            <h2 className="mt-8 font-serif text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.018em] text-forest text-balance">
              My name is Ogechukwu Madu.
            </h2>

            <div className="mt-7 space-y-4 text-[15px] md:text-[15.5px] leading-[1.6] text-ink/78 max-w-prose">
              <p>
                Over the years, I&rsquo;ve built across multiple industries
                including real estate, ecommerce, community, hospitality, and
                service-based businesses &mdash; generating 6 and 7 figures in
                revenue while learning firsthand how difficult it can be to
                stay consistent when everything feels important at the same
                time.
              </p>
            </div>

            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-forest">
              Over that time, I&rsquo;ve:
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
                My role inside Early Founders Collective is to help you simplify
                what feels complicated, focus on what actually moves your
                business forward, and create enough structure and
                accountability to keep building consistently.
              </p>
            </div>

            <p className="mt-7 font-serif text-[17px] md:text-[18.5px] leading-[1.45] text-forest text-balance">
              It&rsquo;s about building with more clarity, intention,
              consistency, and momentum.
            </p>

            <p className="mt-10 hand text-[30px] leading-none text-forest/85 rotate-[-2deg]">
              &mdash; Oge
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
