"use client";

import { useRef, useState } from "react";

type Props = {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
};

/**
 * Cinematic founder-video player.
 * - Renders the poster image directly so the founder's face is the first thing
 *   you see, with a centered play button overlaid.
 * - When clicked, attempts to play the source video. If no video file exists
 *   at `src`, the poster remains visible (poster-only mode).
 */
export function FounderVideo({
  src = "/founder.mp4",
  poster = "/founder-poster.jpg",
  label = "A note from the founder.",
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true));
  };

  return (
    <figure
      className={`relative w-full aspect-video overflow-hidden rounded-card bg-forest shadow-video ${className}`}
    >
      {/* Poster — always rendered as background so the founder is visible immediately */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Subtle warm gradient for cinematic feel */}
      {!playing && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-forest/20 via-transparent to-forest/40" />
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.06] pointer-events-none">
            <svg width="100%" height="100%">
              <filter id="hero-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="2"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#hero-noise)" />
            </svg>
          </div>
        </>
      )}

      {/* Inline video — appears once the user presses play */}
      {!failed && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          controls={playing}
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${
            playing ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onError={() => setFailed(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {/* Play button — visible until video is playing */}
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play founder video"
          className="group absolute inset-0 z-10 flex flex-col items-center justify-center text-ivory"
        >
          <span className="relative inline-flex h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-ivory/25 backdrop-blur-md border border-ivory/60 text-ivory transition-all duration-500 ease-editorial group-hover:scale-105 group-hover:bg-ivory/35">
            <span className="absolute inset-0 rounded-full bg-ivory/20 animate-ping opacity-20" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="relative ml-0.5 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 drop-shadow-md"
            >
              <path d="M6 4L20 12L6 20V4Z" fill="currentColor" />
            </svg>
          </span>
          <span className="mt-7 text-[11px] uppercase tracking-[0.32em] text-ivory/85 drop-shadow-sm">
            {label}
          </span>
        </button>
      )}
    </figure>
  );
}
