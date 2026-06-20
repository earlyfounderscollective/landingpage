"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingEvent } from "@/lib/training";

type Status = "upcoming" | "replay" | "between";

type FormState = {
  title: string;
  starts_at_date: string;
  starts_at_time: string;
  timezone: string;
  duration_minutes: number;
  zoom_url: string;
  replay_url: string;
  video_url: string;
  status: Status;
};

function isoToDateInput(iso: string | null, timezone: string): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-CA", { timeZone: timezone }); // YYYY-MM-DD
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
  return { date, time };
}

const TIMEZONES = [
  "America/Chicago",
  "America/New_York",
  "America/Denver",
  "America/Los_Angeles",
];

export function TrainingEditor({ initial }: { initial: TrainingEvent }) {
  const router = useRouter();
  const { date, time } = isoToDateInput(initial.starts_at, initial.timezone);

  const [state, setState] = useState<FormState>({
    title: initial.title,
    starts_at_date: date,
    starts_at_time: time,
    timezone: initial.timezone,
    duration_minutes: initial.duration_minutes,
    zoom_url: initial.zoom_url ?? "",
    replay_url: initial.replay_url ?? "",
    video_url: initial.video_url ?? "",
    status: initial.status,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/training", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Save failed");
      }
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
          Admin · Training
        </p>
        <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-[-0.018em] text-forest">
          Edit live training
        </h1>
        <p className="mt-3 text-[14px] text-ink/65 leading-[1.55]">
          Updates the /training page within 60 seconds.
        </p>
      </div>

      <div className="bg-white border border-line/70 rounded-2xl p-6 md:p-8 space-y-8">
        {/* Status */}
        <Section label="Page mode">
          <div className="space-y-2.5">
            {[
              { value: "upcoming", label: "Upcoming live event", help: "Page shows the date/time + Reserve My Seat CTA" },
              { value: "replay", label: "Replay available", help: "Page shows Watch the Replay CTA" },
              { value: "between", label: "Between events (collect waitlist)", help: "Page shows Notify Me CTA" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  state.status === opt.value
                    ? "bg-bone border-forest/40"
                    : "bg-white border-line hover:border-forest/30"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={state.status === opt.value}
                  onChange={() => update("status", opt.value as Status)}
                  className="mt-1"
                />
                <div>
                  <p className="text-[14px] text-forest font-medium">{opt.label}</p>
                  <p className="text-[12.5px] text-mute">{opt.help}</p>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* Date + Time */}
        <Section label="Date & time">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={state.starts_at_date}
              onChange={(e) => update("starts_at_date", e.target.value)}
              className="px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
            />
            <input
              type="time"
              value={state.starts_at_time}
              onChange={(e) => update("starts_at_time", e.target.value)}
              className="px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
            />
          </div>
          <select
            value={state.timezone}
            onChange={(e) => update("timezone", e.target.value)}
            className="mt-3 w-full px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </Section>

        {/* Duration */}
        <Section label="Duration (minutes)">
          <input
            type="number"
            value={state.duration_minutes}
            onChange={(e) => update("duration_minutes", Number(e.target.value))}
            min={10}
            max={240}
            className="w-32 px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          />
        </Section>

        {/* Title */}
        <Section label="Training title">
          <input
            type="text"
            value={state.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          />
        </Section>

        {/* Video URL — for the VSL embed on /training */}
        <Section
          label="Training video URL"
          help="YouTube, Vimeo, Loom, or a direct .mp4 link. Embeds on the /training page above the CTA. Leave blank to show the placeholder."
        >
          <input
            type="url"
            value={state.video_url}
            onChange={(e) => update("video_url", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          />
        </Section>

        {/* Zoom URL */}
        <Section label="Zoom URL" help="Private. Only sent in the confirmation email.">
          <input
            type="url"
            value={state.zoom_url}
            onChange={(e) => update("zoom_url", e.target.value)}
            placeholder="https://zoom.us/j/..."
            className="w-full px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          />
        </Section>

        {/* Replay URL */}
        <Section label="Replay URL" help="Used when mode = Replay.">
          <input
            type="url"
            value={state.replay_url}
            onChange={(e) => update("replay_url", e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
          />
        </Section>

        {/* Save row */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-line/60">
          {saved && (
            <span className="text-[12.5px] text-forest font-medium">Saved.</span>
          )}
          {error && (
            <span className="text-[12.5px] text-[#a13a1a]">{error}</span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="bg-forest text-ivory px-6 py-3 rounded-full text-[13.5px] font-medium hover:bg-ink transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-[12px] text-mute">
        <a href="/training" target="_blank" rel="noreferrer" className="hover:text-forest underline underline-offset-4">
          Preview the /training page →
        </a>
      </p>
    </div>
  );
}

function Section({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-mute mb-2">
        {label}
      </p>
      {children}
      {help && <p className="mt-2 text-[12px] text-mute/85 italic">{help}</p>}
    </div>
  );
}
