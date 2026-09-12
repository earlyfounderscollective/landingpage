import type { Metadata } from "next";
import { WaitlistForm } from "./WaitlistForm";
import { ebook } from "@/lib/ebook";

export const metadata: Metadata = {
  title: `${ebook.title} · Join the Waitlist`,
  description:
    "A practical guide for event hosts who want to get more attendees, work with vendors and sponsors, cover event costs, and make money from their events.",
  openGraph: {
    title: `${ebook.title} · Join the Waitlist`,
    description:
      "Be the first to know when the guide is ready. A practical guide to creating events that actually make money.",
    url: `https://earlyfounderscollective.com${ebook.path}`,
  },
};

export default function EbookWaitlistPage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-ivory px-5 py-16">
      <div className="w-full max-w-[480px]">
        <img
          src="/logo.png"
          alt="Early Founders Collective"
          className="mx-auto h-10 w-auto opacity-90 sm:h-11"
          loading="eager"
        />

        <p className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">
          Coming soon
        </p>

        <h1 className="mt-4 text-balance text-center font-serif text-[30px] leading-[1.14] tracking-[-0.02em] text-forest sm:text-[38px]">
          Learn how to create profitable events.
        </h1>

        <p className="mx-auto mt-5 max-w-[42ch] text-pretty text-center text-[16px] leading-[1.62] text-ink/70">
          I&rsquo;m creating a practical guide for event hosts who want to get
          more attendees, work with vendors and sponsors, cover event costs,
          and make money from their events.
        </p>

        <div className="mt-9">
          <WaitlistForm source={ebook.defaultSource} />
        </div>

        <p className="mt-8 text-center text-[13px] leading-[1.55] text-ink/45">
          No spam. Just an email when the guide is ready.
        </p>
      </div>
    </main>
  );
}
