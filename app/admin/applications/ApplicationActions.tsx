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
  const [accepted, setAccepted] = useState<string | null>(null);

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

  async function acceptAndSendPaymentLink() {
    if (!confirm("Accept this applicant and email them the payment link?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/dfy/${appId}/accept`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        setAccepted(json.checkoutUrl ?? "");
        router.refresh();
      } else {
        alert(json.error || "Couldn't accept");
      }
    } finally {
      setBusy(false);
    }
  }

  const isAccepted = currentStatus === "accepted" || currentStatus === "paid";
  const isPaid = currentStatus === "paid";

  return (
    <div className="pt-4 border-t border-line/60 space-y-3">
      {!isAccepted && (
        <div>
          <button
            type="button"
            disabled={busy}
            onClick={acceptAndSendPaymentLink}
            className="inline-flex items-center justify-center bg-forest text-ivory px-5 py-2.5 rounded-full text-[12.5px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
          >
            {busy ? "Sending…" : "Accept + send payment link →"}
          </button>
          <p className="mt-2 text-[12px] text-mute leading-[1.5]">
            Flips status to <code>accepted</code> and emails them a checkout link.
          </p>
        </div>
      )}

      {isAccepted && (
        <div className={`rounded-xl border p-3.5 ${isPaid ? "border-[#1b6b3a]/40 bg-[#1b6b3a]/8" : "border-forest/30 bg-forest/5"}`}>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-forest mb-1">
            {isPaid ? "Paid" : "Accepted — awaiting payment"}
          </p>
          <p className="text-[13px] text-ink/72 leading-[1.55]">
            {isPaid
              ? "Payment received. Send the kickoff intake and book week one."
              : "Acceptance email sent. They have 48 hours to complete checkout."}
          </p>
          {accepted && (
            <p className="mt-2 text-[12px] text-mute break-all">
              Link: <code className="text-forest">{accepted}</code>
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-line/40">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mute mr-2">
          Or set status:
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
    </div>
  );
}
