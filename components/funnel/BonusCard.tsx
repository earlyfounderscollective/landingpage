export function BonusCard({
  number,
  title,
  body,
  reverse = false,
}: {
  number: string;
  title: string;
  body: React.ReactNode;
  reverse?: boolean;
}) {
  const visualSide = (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-forest text-ivory">
      <div className="absolute inset-0 grain pointer-events-none opacity-[0.18]" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <p className="font-serif text-[80px] md:text-[120px] leading-none text-brass/55 tracking-[-0.04em]">
          {number}
        </p>
      </div>
      <div className="absolute bottom-5 left-6 right-6">
        <p className="text-[10.5px] font-medium tracking-[0.28em] uppercase text-ivory/65">
          Bonus #{number}
        </p>
        <p className="mt-1 font-serif text-[20px] md:text-[22px] leading-[1.25] text-ivory">
          {title}
        </p>
      </div>
    </div>
  );

  const textSide = (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
        Bonus #{number}: {title}
      </p>
      <div className="mt-5 space-y-4 text-[15.5px] md:text-[16px] leading-[1.65] text-ink/78">
        {body}
      </div>
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      {visualSide}
      {textSide}
    </div>
  );
}
