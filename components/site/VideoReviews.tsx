"use client";

import { useRef, useState } from "react";

type Review = {
  src?: string;
  poster: string;
  name: string;
  role: string;
  quote: string;
};

const reviews: Review[] = [
  {
    src: "/media/review-ryan.mp4",
    poster: "/media/review-ryan-poster.jpg",
    name: "Ryan",
    role: "Co-founder, Off the Clock | nursing community events",
    quote:
      "Oge laid out the blueprint. Now we have hosted events of over 175 people and have worked with brands like Lululemon, Fabletics & Figs.",
  },
  {
    src: "/media/review-jasmine.mp4",
    poster: "/media/review-jasmine-poster.jpg",
    name: "Jasmine Terry",
    role: "Founder, Holistic Roots Skincare",
    quote:
      "As a creative, having the idea isn't the hard part. It's knowing how to launch it. Oge helped me build the systems and framework to turn ideas into execution.",
  },
  {
    src: "/media/review-tiffany.mp4",
    poster: "/media/review-tiffany-poster.jpg",
    name: "Tiffany",
    role: "Founder, Ladies of Richmond",
    quote:
      "Oge gave me clarity on how to approach partnerships and collaborations, helping me better position my community for growth.",
  },
];

function ReviewTile({ review }: { review: Review }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v || !review.src) {
      setFailed(true);
      return;
    }
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true));
  };

  return (
    <figure className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-forest shadow-card">
        <img
          src={review.poster}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        />
        {!playing && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest/55" />
        )}

        {review.src && !failed && (
          <video
            ref={videoRef}
            src={review.src}
            poster={review.poster}
            playsInline
            controls={playing}
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${
              playing ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onError={() => setFailed(true)}
            onPause={() => setPlaying(false)}
          />
        )}

        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label={`Play review from ${review.name}`}
            className="absolute inset-0 flex items-end p-6 md:p-7 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ivory/95 text-forest transition-all duration-500 ease-editorial group-hover:scale-105 group-hover:bg-ivory shadow-card">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
                </svg>
              </span>
              <div className="text-ivory">
                <p className="font-serif text-[18px] leading-[1.2]">
                  {review.name}
                </p>
                <p className="mt-0.5 text-[12px] uppercase tracking-[0.18em] text-ivory/75">
                  {review.role}
                </p>
              </div>
            </div>
          </button>
        )}
      </div>

      <figcaption className="mt-5 w-full">
        <p className="font-serif text-[17px] md:text-[18px] leading-[1.45] text-forest">
          &ldquo;{review.quote}&rdquo;
        </p>
      </figcaption>
    </figure>
  );
}

export function VideoReviews({ showHeading = true }: { showHeading?: boolean } = {}) {
  const len = reviews.length;
  const layoutClass =
    len === 1
      ? "max-w-md mx-auto"
      : len === 2
        ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto"
        : "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto";

  return (
    <section className={`bg-ivory ${showHeading ? "pt-2" : "pt-8"} pb-20 md:pb-28 grain`}>
      <div className="container-page">
        {showHeading && (
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
          <h2 className="flex flex-col items-center">
            <span className="font-serif text-[34px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-forest">
              Early Founders
            </span>
            <span className="hand text-[52px] md:text-[68px] leading-none text-brass mt-1 rotate-[-3deg]">
              Success Stories
            </span>
          </h2>
        </div>
        )}

        <div className={layoutClass}>
          {reviews.map((r) => (
            <ReviewTile key={r.poster} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
