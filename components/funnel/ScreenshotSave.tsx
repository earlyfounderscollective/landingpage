export function ScreenshotSave({
  liveTitle,
  dateLine,
  liveUrl,
}: {
  liveTitle: string;
  dateLine: string;
  liveUrl?: string | null;
}) {
  return (
    <section className="bg-bone py-16 md:py-20 grain">
      <div className="container-page">
        <div className="max-w-[560px] mx-auto text-center">
          <img
            src="/logo.png"
            alt="Early Founders Collective"
            className="h-10 md:h-12 w-auto mx-auto opacity-80"
            loading="lazy"
          />
          <h2 className="mt-7 font-serif text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] text-forest uppercase">
            Screenshot &amp; Save
          </h2>

          <div className="mt-9 space-y-3">
            <div className="bg-white border border-line/60 rounded-full px-5 py-3 flex items-center justify-center gap-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a]" />
              <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-mute">
                Live
              </span>
              <span className="font-serif text-[14.5px] md:text-[15px] text-forest tracking-[-0.005em]">
                {liveTitle}
              </span>
            </div>

            <div className="bg-white border border-line/60 rounded-full px-5 py-3 flex items-center justify-center gap-2">
              <span aria-hidden>📅</span>
              <span className="font-serif text-[14.5px] md:text-[15px] text-forest">
                {dateLine}
              </span>
            </div>

            {liveUrl && (
              <div className="bg-white border border-line/60 rounded-full px-5 py-3 flex items-center justify-center gap-2 break-all">
                <span aria-hidden>▶</span>
                <span className="text-[12px] font-semibold tracking-[0.16em] uppercase text-mute">
                  Attend live at
                </span>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif text-[14.5px] md:text-[15px] text-forest hover:text-brass break-all"
                >
                  {liveUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
