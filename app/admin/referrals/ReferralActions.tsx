"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReferralActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function mark(action: "paid" | "voided" | "eligible") {
    if (action === "voided") {
      const reason = prompt("Reason for voiding this payout (optional)?") ?? "";
      if (reason === null) return;
      setBusy(true);
      const res = await fetch(`/api/admin/referrals/${id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "voided", reason }),
      });
      if (res.ok) router.refresh();
      setBusy(false);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/referrals/${id}/payout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) router.refresh();
    setBusy(false);
  }

  if (currentStatus === "paid") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => mark("voided")}
        className="text-[11px] tracking-[0.04em] uppercase text-mute hover:text-[#9b2828] underline decoration-line disabled:opacity-50"
      >
        Void
      </button>
    );
  }
  if (currentStatus === "voided") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => mark("eligible")}
        className="text-[11px] tracking-[0.04em] uppercase text-mute hover:text-forest underline decoration-line disabled:opacity-50"
      >
        Re-open
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => mark("paid")}
        className="text-[11px] font-semibold tracking-[0.06em] uppercase bg-forest text-ivory px-3 py-1.5 rounded-full hover:bg-ink transition-colors disabled:opacity-60"
      >
        Mark paid
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => mark("voided")}
        className="text-[11px] tracking-[0.04em] uppercase text-mute hover:text-[#9b2828] underline decoration-line disabled:opacity-50"
      >
        Void
      </button>
    </div>
  );
}
