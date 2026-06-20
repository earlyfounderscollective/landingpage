export function GuaranteeBadge() {
  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative inline-flex h-[120px] w-[120px] md:h-[140px] md:w-[140px] items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-brass" />
        <div className="absolute inset-2 rounded-full border border-brass/40" />
        {/* Inner content */}
        <div className="relative text-center">
          <p className="font-serif text-[28px] md:text-[34px] leading-none text-brass tracking-[-0.022em]">
            14
          </p>
          <p className="text-[8.5px] md:text-[9px] uppercase tracking-[0.18em] text-forest font-semibold mt-1">
            Day
          </p>
          <div className="w-6 h-px bg-brass/50 mx-auto my-1.5" />
          <p className="text-[9px] md:text-[9.5px] uppercase tracking-[0.18em] text-forest font-semibold">
            Money
          </p>
          <p className="text-[9px] md:text-[9.5px] uppercase tracking-[0.18em] text-forest font-semibold">
            Back
          </p>
        </div>
      </div>
    </div>
  );
}
