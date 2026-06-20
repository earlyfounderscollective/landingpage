import { detectVideoEmbed } from "@/lib/training";

export function VSLEmbed({ url }: { url: string | null | undefined }) {
  const embed = detectVideoEmbed(url);

  // No video set yet — show Oge's speaking photo as the placeholder
  // so the hero has her face in the same slot Hormozi's hero has his.
  if (embed.type === "none" || embed.type === "unknown") {
    return (
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-forest shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
        <img
          src="/media/speaking.jpg"
          alt="Oge Madu"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-ivory/95 text-forest shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="ml-1"
            >
              <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-5 left-6 right-6 text-ivory">
          <p className="font-serif text-[16px] md:text-[18px] leading-[1.3]">
            A quick message from Oge
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ivory/65">
            Video unlocks at registration
          </p>
        </div>
      </div>
    );
  }

  if (embed.type === "mp4") {
    return (
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-forest shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
        <video
          src={embed.embedUrl}
          autoPlay
          muted
          playsInline
          controls
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  // YouTube / Vimeo / Loom iframe embed
  return (
    <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-forest shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
      <iframe
        src={embed.embedUrl}
        title="Training video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
