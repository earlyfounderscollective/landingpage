import { detectVideoEmbed } from "@/lib/training";

export function VSLEmbed({ url }: { url: string | null | undefined }) {
  const embed = detectVideoEmbed(url);

  // No video set yet — clean neutral placeholder so the hero doesn't collapse.
  if (embed.type === "none" || embed.type === "unknown") {
    return (
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-forest/50 border border-ivory/12 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ivory/15 text-ivory/70">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ivory/55">
            Training video
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
