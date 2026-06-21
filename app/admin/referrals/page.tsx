import { AdminGate } from "@/components/admin/AdminGate";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ReferralActions } from "./ReferralActions";

export const dynamic = "force-dynamic";

type Redemption = {
  id: string;
  code: string;
  friend_email: string;
  discount_applied_cents: number;
  payout_amount_cents: number;
  cohort_start_date: string | null;
  payout_due_at: string;
  payout_status: string;
  paid_at: string | null;
  void_reason: string | null;
  created_at: string;
};

type CodeWithGrad = {
  code: string;
  grad_email: string;
};

function formatRelDate(iso: string | null): string {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.round(ms / 86_400_000);
  if (days === 0) return "today";
  if (days > 0) return `in ${days}d`;
  return `${-days}d ago`;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-ink/8 text-ink/65",
  eligible: "bg-brass text-ivory",
  paid: "bg-[#1b6b3a] text-ivory",
  voided: "bg-[#9b2828] text-ivory",
};

export default async function AdminReferralsPage() {
  const supabase = getSupabaseAdmin();
  let redemptions: Redemption[] = [];
  let codes: CodeWithGrad[] = [];
  let totals = { pending: 0, eligible: 0, paid: 0, totalCodes: 0 };

  if (supabase) {
    const [rRes, cRes] = await Promise.all([
      supabase
        .from("bootcamp_referral_redemptions")
        .select(
          "id, code, friend_email, discount_applied_cents, payout_amount_cents, cohort_start_date, payout_due_at, payout_status, paid_at, void_reason, created_at",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("bootcamp_referral_codes")
        .select("code, grad_email")
        .order("created_at", { ascending: false }),
    ]);
    redemptions = (rRes.data ?? []) as Redemption[];
    codes = (cRes.data ?? []) as CodeWithGrad[];
    totals.totalCodes = codes.length;
    for (const r of redemptions) {
      if (r.payout_status === "pending") totals.pending += 1;
      if (r.payout_status === "eligible") totals.eligible += 1;
      if (r.payout_status === "paid") totals.paid += 1;
    }
  }

  const gradByCode = new Map(codes.map((c) => [c.code, c.grad_email]));
  const now = Date.now();

  return (
    <AdminGate>
      <div className="max-w-[1180px] mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">
            Referral program
          </p>
          <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
            Referrals + payouts.
          </h1>
          <p className="mt-2 text-[14px] text-mute leading-[1.55] max-w-[640px]">
            Each bootcamp grad has a unique code. When a friend buys with that
            code, the friend gets $100 off and the grad earns $50 — payable 30
            days after the friend's cohort wraps.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <Stat label="Codes issued" value={totals.totalCodes} />
          <Stat label="Pending" value={totals.pending} />
          <Stat label="Eligible to pay" value={totals.eligible} accent />
          <Stat label="Paid out" value={totals.paid} />
        </div>

        <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4">
          Redemptions
        </h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {redemptions.length === 0 ? (
            <p className="p-8 text-center text-[14px] text-mute">
              No referrals redeemed yet.
            </p>
          ) : (
            <ul className="divide-y divide-line/60">
              {redemptions.map((r) => {
                const grad = gradByCode.get(r.code) || "—";
                const dueMs = new Date(r.payout_due_at).getTime();
                const dueNow = r.payout_status === "pending" && dueMs <= now;
                return (
                  <li key={r.id} className="px-5 py-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 md:items-center">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-mute mb-0.5">
                        Friend
                      </p>
                      <p className="text-[14px] text-forest font-medium truncate">
                        {r.friend_email}
                      </p>
                      <p className="text-[12px] text-mute mt-0.5">
                        Used <span className="text-forest font-mono">{r.code}</span>
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-mute mb-0.5">
                        Grad (paid out)
                      </p>
                      <p className="text-[14px] text-forest font-medium truncate">
                        {grad}
                      </p>
                      <p className="text-[12px] text-mute mt-0.5">
                        Payout {formatRelDate(r.payout_due_at)} ·
                        ${((r.payout_amount_cents ?? 0) / 100).toFixed(0)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLOR[r.payout_status] ?? "bg-bone text-forest"}`}
                    >
                      {dueNow && r.payout_status === "pending" ? "ready" : r.payout_status}
                    </span>
                    <ReferralActions
                      id={r.id}
                      currentStatus={r.payout_status}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <h2 className="mt-10 text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4">
          All codes
        </h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {codes.length === 0 ? (
            <p className="p-8 text-center text-[14px] text-mute">
              No codes issued yet — codes auto-generate when someone buys the bootcamp.
            </p>
          ) : (
            <ul className="divide-y divide-line/60">
              {codes.map((c) => (
                <li
                  key={c.code}
                  className="px-5 py-3 grid grid-cols-[1fr_1fr] gap-3"
                >
                  <p className="font-mono text-[13.5px] text-forest tracking-[0.06em]">
                    {c.code}
                  </p>
                  <p className="text-[13px] text-ink/72 truncate">{c.grad_email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminGate>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "bg-brass text-ivory border-brass" : "bg-white border-line"}`}>
      <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5 ${accent ? "text-ivory/75" : "text-mute"}`}>
        {label}
      </p>
      <p className={`font-serif text-[28px] tabular-nums leading-none ${accent ? "text-ivory" : "text-forest"}`}>
        {value}
      </p>
    </div>
  );
}
