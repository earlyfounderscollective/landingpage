import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ApplicationActions } from "./ApplicationActions";

export const dynamic = "force-dynamic";

type Application = {
  id: string;
  email: string;
  full_name: string;
  business_name: string | null;
  business_stage: string | null;
  monthly_revenue: string | null;
  what_you_sell: string | null;
  biggest_blocker: string | null;
  budget: string | null;
  timeline: string | null;
  phone: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

function formatRelTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

const STATUS_COLOR: Record<string, string> = {
  new: "bg-brass text-ivory",
  contacted: "bg-[#5B7A6A] text-ivory",
  scheduled: "bg-forest text-ivory",
  closed: "bg-ink/10 text-ink/55",
  passed: "bg-bone text-mute",
};

export default async function AdminApplicationsPage() {
  const supabase = getSupabaseAdmin();
  let apps: Application[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("dfy_applications")
      .select("*")
      .order("created_at", { ascending: false });
    apps = (data ?? []) as Application[];
  }

  return (
    <AdminGate>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">DFY pipeline</p>
            <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
              Applications
            </h1>
          </div>
          <Link href="/admin" className="text-[13px] text-mute hover:text-forest underline decoration-line">
            ← Dashboard
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white border border-line rounded-2xl p-12 text-center">
            <p className="text-[15px] text-mute">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((a) => (
              <article key={a.id} className="bg-white border border-line rounded-2xl p-6 md:p-7">
                <header className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h2 className="font-serif text-[22px] md:text-[24px] text-forest leading-[1.2]">
                      {a.full_name}
                    </h2>
                    <p className="mt-1 text-[13px] text-mute">
                      <a href={`mailto:${a.email}`} className="text-forest hover:text-brass underline decoration-line underline-offset-2">
                        {a.email}
                      </a>
                      {a.phone && <> · {a.phone}</>} · {formatRelTime(a.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLOR[a.status] ?? "bg-bone text-forest"}`}>
                      {a.status}
                    </span>
                  </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-[12.5px]">
                  <Cell label="Business" v={a.business_name} />
                  <Cell label="Stage" v={a.business_stage} />
                  <Cell label="Revenue" v={a.monthly_revenue} />
                  <Cell label="Tier" v={a.budget} />
                </div>

                {a.what_you_sell && (
                  <div className="mb-4 pt-4 border-t border-line/60">
                    <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-mute mb-1.5">What they sell</p>
                    <p className="text-[14.5px] text-forest leading-[1.55] whitespace-pre-wrap">{a.what_you_sell}</p>
                  </div>
                )}

                {a.biggest_blocker && (
                  <div className="mb-4 pt-4 border-t border-line/60">
                    <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-mute mb-1.5">Biggest blocker</p>
                    <p className="text-[14.5px] text-forest leading-[1.55] whitespace-pre-wrap">{a.biggest_blocker}</p>
                  </div>
                )}

                {a.timeline && (
                  <p className="mb-4 text-[13px] text-mute">
                    <span className="font-semibold text-forest/70">Timeline:</span> {a.timeline}
                  </p>
                )}

                <ApplicationActions appId={a.id} currentStatus={a.status} email={a.email} />
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminGate>
  );
}

function Cell({ label, v }: { label: string; v: string | null }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-mute mb-0.5">{label}</p>
      <p className="text-[13.5px] text-forest leading-[1.4]">{v || "—"}</p>
    </div>
  );
}
