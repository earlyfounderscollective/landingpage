/**
 * Abstract gradient swooshes for the bootcamp hero — adds the
 * "expensive landing page" feel without basic stock imagery.
 *
 * Three layered SVG curves + a radial gradient blob. All brand
 * palette (forest / brass / ivory).
 */
export function HeroGradientField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Radial brass glow upper-right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(155,122,74,0.65) 0%, rgba(155,122,74,0.0) 65%)",
        }}
        aria-hidden
      />
      {/* Radial brass glow lower-left */}
      <div
        className="absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(155,122,74,0.55) 0%, rgba(155,122,74,0.0) 65%)",
        }}
        aria-hidden
      />

      {/* Diagonal brass curves */}
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-40"
        aria-hidden
      >
        <defs>
          <linearGradient id="brushA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(155,122,74,0)" />
            <stop offset="55%" stopColor="rgba(155,122,74,0.85)" />
            <stop offset="100%" stopColor="rgba(155,122,74,0)" />
          </linearGradient>
          <linearGradient id="brushB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(181,145,100,0)" />
            <stop offset="50%" stopColor="rgba(181,145,100,0.5)" />
            <stop offset="100%" stopColor="rgba(181,145,100,0)" />
          </linearGradient>
        </defs>
        <path
          d="M-100 580 C 300 320, 700 700, 1100 380 S 1600 520, 1700 300"
          stroke="url(#brushA)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M-100 650 C 300 380, 800 760, 1200 460 S 1700 600, 1800 360"
          stroke="url(#brushA)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M-100 220 C 320 80, 720 280, 1100 120 S 1500 240, 1700 80"
          stroke="url(#brushB)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* Faint dot grain — adds editorial texture */}
      <div className="absolute inset-0 grain opacity-20" aria-hidden />
    </div>
  );
}

/**
 * Section-divider swoosh — a subtle horizontal gradient line that
 * separates major page sections without a hard rule.
 */
export function SwooshDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(155,122,74,0.4) 50%, transparent 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
