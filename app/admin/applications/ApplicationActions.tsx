"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["new", "contacted", "scheduled", "closed", "passed"];

export function ApplicationActions({
  appId,
  currentStatus,
  email,
}: {
  appId: string;
  currentStatus: string;
  email: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(s: string) {
    if (s === currentStatus) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/dfy/applications/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pt-4 border-t border-line/60 flex items-center gap-2 flex-wrap">
      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mute mr-2">
        Update status:
      </p>
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={busy || s === currentStatus}
          onClick={() => setStatus(s)}
          className={`text-[11px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-colors ${
            s === currentStatus
              ? "bg-forest text-ivory border-forest cursor-default"
              : "bg-white text-ink/65 border-line hover:border-forest/40 hover:text-forest disabled:opacity-50"
          }`}
        >
          {s}
        </button>
      ))}
      <a
        href={`mailto:${email}`}
        className="ml-auto text-[12px] text-forest hover:text-brass underline decoration-line"
      >
        Email reply →
      </a>
    </div>
  );
}
