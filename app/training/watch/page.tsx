import type { Metadata } from "next";
import Link from "next/link";
import { FunnelFooter } from "@/components/funnel/FunnelChrome";
import { StatusBanner } from "@/components/funnel/StatusBanner";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { CountdownTimer, InlineCountdown } from "@/components/funnel/CountdownTimer";
import {
  getActiveTrainingEvent,
  formatTrainingDateLine,
} from "@/lib/training";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Training Room · Early Founders Collective",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type WatchState =
  | "no_event"
  | "between"
  | "countdown"
  | "live_window"
  | "live_now"
  | "replay_active"
  | "replay_expired";

const LIVE_WINDOW_MS = 30 * 60 * 1000; // open the live room 30min before
const FREE_REPLAY_WINDOW_MS = 48 * 60 * 60 * 1000;

export default async function TrainingWatchPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  const event = await getActiveTrainingEvent();

  // Look up registration to determine VIP + personalization
  let isVip = false;
  let firstName = "";
  let isRegistered = false;
  const supabase = getSupabaseAdmin();
  if (supabase && email && event) {
    const { data } = await supabase
      .from("training_registrations")
      .select("vip, full_name")
      .eq("email", email)
      .eq("event_id", event.id)
      .maybeSingle();
    if (data) {
      isRegistered = true;
      isVip = data.vip ?? false;
      if (data.full_name) firstName = String(data.full_name).split(/\s+/)[0];
    }
  }

  // Determine state
  const now = Date.now();
  const startsAt = event?.starts_at ? new Date(event.starts_at).getTime() : null;
  const endsAt = startsAt
    ? startsAt + (event?.duration_minutes ?? 40) * 60 * 1000
    : null;
  const replayExpiresAt = endsAt ? endsAt + FREE_REPLAY_WINDOW_MS : null;

  let state: WatchState = "no_event";
  if (!event) {
    state = "no_event";
  } else if (event.status === "between") {
    state = "between";
  } else if (event.status === "replay") {
    state =
      isVip || (replayExpiresAt && now < replayExpiresAt)
        ? "replay_active"
        : "replay_expired";
  } else if (event.status === "upcoming" && startsAt && endsAt) {
    if (now < startsAt - LIVE_WINDOW_MS) {
      state = "countdown";
    } else if (now < startsAt) {
      state = "live_window";
    } else if (now < endsAt) {
      state = "live_now";
    } else if (isVip || (replayExpiresAt && now < replayExpiresAt)) {
      state = "replay_active";
    } else {
      state = "replay_expired";
    }
  }

  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";
  const dateLine = event ? formatTrainingDateLine(event) : "";
  const replayUrl = event?.replay_url ?? null;
  const zoomUrl = event?.zoom_url ?? null;

  return (
    <>
      <StatusBanner tone="registered" label="TRAINING ROOM" />
      <main className="bg-ivory min-h-[calc(100vh-100px)]">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-[820px] mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass text-center">
              Training Room
            </p>
            <h1 className="mt-4 font-serif text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.018em] text-forest text-center">
              {greeting}
            </h1>

            {/* STATE: NO EVENT */}
            {state === "no_event" && (
              <div className="mt-12 bg-bone border border-line/60 rounded-2xl p-8 md:p-10 text-center">
                <p className="text-[16px] text-ink/72 leading-[1.65]">
                  No training scheduled right now. The next one drops soon.
                </p>
                <Link
                  href="/training"
                  className="mt-6 inline-flex items-center text-[13.5px] text-forest underline underline-offset-4 hover:text-brass"
                >
                  Get notified when the next one is set →
                </Link>
              </div>
            )}

            {/* STATE: BETWEEN */}
            {state === "between" && (
              <div className="mt-12 bg-bone border border-line/60 rounded-2xl p-8 md:p-10 text-center">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
                  Between trainings
                </p>
                <p className="mt-4 text-[16px] text-ink/72 leading-[1.65]">
                  We're between live trainings right now. The next one drops soon and you'll be the first to know.
                </p>
              </div>
            )}

            {/* STATE: COUNTDOWN (>30 min before) */}
            {state === "countdown" && startsAt && (
              <div className="mt-12">
                <p className="text-[15.5px] md:text-[16px] text-ink/72 leading-[1.6] text-center max-w-[520px] mx-auto">
                  The training opens 30 minutes before {formatTrainingDateLine(event!)}. Come back when you're ready.
                </p>

                <div className="mt-10 bg-forest text-ivory rounded-2xl p-8 md:p-10 text-center">
                  <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-brass">
                    Starts in
                  </p>
                  <div className="mt-5 flex justify-center">
                    <CountdownTimer targetIso={event!.starts_at!} tone="dark" />
                  </div>
                </div>

                {zoomUrl && (
                  <p className="mt-8 text-center text-[13px] text-mute">
                    Save this page. When it's time, the Join button will appear here.
                  </p>
                )}
              </div>
            )}

            {/* STATE: LIVE WINDOW (30 min before — Zoom open early) */}
            {state === "live_window" && zoomUrl && (
              <div className="mt-12">
                <div className="bg-forest text-ivory rounded-2xl p-8 md:p-10 text-center">
                  <p className="inline-flex items-center gap-2 bg-[#d23a3a]/15 border border-[#d23a3a]/30 rounded-full px-3.5 py-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a] animate-pulse" />
                    <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory/90">
                      Doors open · Starts in {" "}
                    </span>
                  </p>
                  <div className="mt-4 flex justify-center">
                    <InlineCountdown targetIso={event!.starts_at!} />
                  </div>
                  <h2 className="mt-8 font-serif text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.018em] text-ivory">
                    You can join now.
                  </h2>
                  <p className="mt-3 text-[14.5px] text-ivory/70">
                    {dateLine}
                  </p>
                  <a
                    href={zoomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-9 inline-flex items-center justify-center rounded-full bg-brass text-ivory text-[15px] font-semibold tracking-[0.04em] uppercase px-10 py-[16px] shadow-[0_22px_50px_-18px_rgba(155,122,74,0.7)] hover:bg-[#8a6c3f] transition-colors"
                  >
                    Join the training →
                  </a>
                </div>
              </div>
            )}

            {/* STATE: LIVE NOW */}
            {state === "live_now" && zoomUrl && (
              <div className="mt-12">
                <div className="bg-forest text-ivory rounded-2xl p-8 md:p-10 text-center">
                  <p className="inline-flex items-center gap-2 bg-[#d23a3a]/20 border border-[#d23a3a]/40 rounded-full px-3.5 py-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#d23a3a] animate-pulse" />
                    <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-ivory">
                      We're live
                    </span>
                  </p>
                  <h2 className="mt-7 font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.018em] text-ivory">
                    We're in there now.
                  </h2>
                  <p className="mt-3 text-[14.5px] text-ivory/70">
                    Hit join. We'll see you in a sec.
                  </p>
                  <a
                    href={zoomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-brass text-ivory text-[15px] font-semibold tracking-[0.04em] uppercase px-10 py-[16px] shadow-[0_22px_50px_-18px_rgba(155,122,74,0.7)] hover:bg-[#8a6c3f] transition-colors"
                  >
                    Join the training →
                  </a>
                </div>
              </div>
            )}

            {/* STATE: REPLAY ACTIVE */}
            {state === "replay_active" && (
              <div className="mt-12">
                <p className="text-[15.5px] md:text-[16px] text-ink/72 leading-[1.65] text-center max-w-[520px] mx-auto">
                  The replay's right here. Watch on your schedule.
                  {!isVip && replayExpiresAt && (
                    <span className="block mt-2 text-[13.5px] text-mute">
                      Free replay closes <ReplayCountdownText expiresAt={replayExpiresAt} />.
                    </span>
                  )}
                  {isVip && (
                    <span className="block mt-2 text-[13.5px] text-brass font-medium">
                      VIP — you have lifetime access.
                    </span>
                  )}
                </p>

                <div className="mt-10">
                  <VSLEmbed url={replayUrl} />
                </div>

                {/* Kit pitch under replay */}
                <KitPitchCard />
              </div>
            )}

            {/* STATE: REPLAY EXPIRED */}
            {state === "replay_expired" && (
              <div className="mt-12 bg-bone border border-line/60 rounded-2xl p-8 md:p-10 text-center">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
                  Replay closed
                </p>
                <h2 className="mt-4 font-serif text-[26px] md:text-[30px] leading-[1.2] text-forest">
                  The 48-hour free replay window has closed.
                </h2>
                <p className="mt-5 text-[15.5px] text-ink/72 leading-[1.65] max-w-[480px] mx-auto">
                  The training is over for now. The next live training drops soon. In the meantime, the workbook covers the same ground.
                </p>
                <KitPitchCard withTitle={false} />
              </div>
            )}

            {/* Footer help */}
            <p className="mt-16 text-center text-[13px] text-mute">
              Need help? Email{" "}
              <a
                href="mailto:contact@earlyfounderscollective.com"
                className="text-forest underline underline-offset-4 hover:text-brass"
              >
                contact@earlyfounderscollective.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <FunnelFooter />
    </>
  );
}

function KitPitchCard({ withTitle = true }: { withTitle?: boolean }) {
  return (
    <div className="mt-12 md:mt-14 bg-forest text-ivory rounded-2xl p-7 md:p-9">
      <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
        The next step
      </p>
      {withTitle && (
        <h3 className="mt-3 font-serif text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.012em] text-ivory">
          Take what you just learned and run with it.
        </h3>
      )}
      <p className="mt-4 text-[15px] md:text-[16px] leading-[1.65] text-ivory/80">
        The Build Your Business Kit is everything we just walked through —
        the worksheets, templates, and the AI prompts I use, in one place.
        Yours to keep. $47 for the next 48 hours, $97 after that.
      </p>
      <Link
        href="/kit"
        className="mt-7 inline-flex items-center justify-center rounded-full bg-brass text-ivory text-[14.5px] font-semibold tracking-[0.04em] uppercase px-8 py-[15px] hover:bg-[#8a6c3f] transition-colors"
      >
        Get the kit →
      </Link>
    </div>
  );
}

function ReplayCountdownText({ expiresAt }: { expiresAt: number }) {
  const ms = Math.max(0, expiresAt - Date.now());
  const hours = Math.round(ms / (1000 * 60 * 60));
  if (hours <= 0) return <>soon</>;
  if (hours < 24) return <>in {hours} {hours === 1 ? "hour" : "hours"}</>;
  const days = Math.floor(hours / 24);
  const remH = hours % 24;
  return (
    <>
      in {days}d{remH > 0 ? ` ${remH}h` : ""}
    </>
  );
}
