import { AdminGate } from "@/components/admin/AdminGate";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Counts = {
  reg7: number;
  reg30: number;
  regAll: number;
  vip7: number;
  vip30: number;
  vipAll: number;
  kit7: number;
  kit30: number;
  kitAll: number;
  kitRev7: number;
  kitRev30: number;
  kitRevAll: number;
  dfyNew: number;
  dfyAll: number;
  kitStarts: number;
  kitCompletes: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

async function loadCounts(): Promise<Counts> {
  const supabase = getSupabaseAdmin();
  const z: Counts = {
    reg7: 0, reg30: 0, regAll: 0,
    vip7: 0, vip30: 0, vipAll: 0,
    kit7: 0, kit30: 0, kitAll: 0,
    kitRev7: 0, kitRev30: 0, kitRevAll: 0,
    dfyNew: 0, dfyAll: 0,
    kitStarts: 0, kitCompletes: 0,
  };
  if (!supabase) return z;

  const now = Date.now();
  const d7 = new Date(now - 7 * DAY_MS).toISOString();
  const d30 = new Date(now - 30 * DAY_MS).toISOString();

  // Training registrations
  const [{ count: regAll }, { count: reg7 }, { count: reg30 }] = await Promise.all([
    supabase.from("training_registrations").select("id", { count: "exact", head: true }),
    supabase.from("training_registrations").select("id", { count: "exact", head: true }).gte("created_at", d7),
    supabase.from("training_registrations").select("id", { count: "exact", head: true }).gte("created_at", d30),
  ]);
  z.regAll = regAll ?? 0;
  z.reg7 = reg7 ?? 0;
  z.reg30 = reg30 ?? 0;

  // VIP conversions
  const [{ count: vipAll }, { count: vip7 }, { count: vip30 }] = await Promise.all([
    supabase.from("training_registrations").select("id", { count: "exact", head: true }).eq("vip", true),
    supabase.from("training_registrations").select("id", { count: "exact", head: true }).eq("vip", true).gte("vip_purchased_at", d7),
    supabase.from("training_registrations").select("id", { count: "exact", head: true }).eq("vip", true).gte("vip_purchased_at", d30),
  ]);
  z.vipAll = vipAll ?? 0;
  z.vip7 = vip7 ?? 0;
  z.vip30 = vip30 ?? 0;

  // Kit orders (counts)
  const [{ count: kitAll }, { count: kit7 }, { count: kit30 }] = await Promise.all([
    supabase.from("kit_orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("kit_orders").select("id", { count: "exact", head: true }).eq("status", "completed").gte("created_at", d7),
    supabase.from("kit_orders").select("id", { count: "exact", head: true }).eq("status", "completed").gte("created_at", d30),
  ]);
  z.kitAll = kitAll ?? 0;
  z.kit7 = kit7 ?? 0;
  z.kit30 = kit30 ?? 0;

  // Kit revenue (sum amount_cents)
  const [revAll, rev7, rev30] = await Promise.all([
    supabase.from("kit_orders").select("amount_cents").eq("status", "completed"),
    supabase.from("kit_orders").select("amount_cents").eq("status", "completed").gte("created_at", d7),
    supabase.from("kit_orders").select("amount_cents").eq("status", "completed").gte("created_at", d30),
  ]);
  const sumCents = (rows: { amount_cents: number | null }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);
  z.kitRevAll = sumCents(revAll.data) / 100;
  z.kitRev7 = sumCents(rev7.data) / 100;
  z.kitRev30 = sumCents(rev30.data) / 100;

  // DFY applications
  const [{ count: dfyAll }, { count: dfyNew }] = await Promise.all([
    supabase.from("dfy_applications").select("id", { count: "exact", head: true }),
    supabase.from("dfy_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  z.dfyAll = dfyAll ?? 0;
  z.dfyNew = dfyNew ?? 0;

  // Kit progress
  const [{ count: kitStarts }, { count: kitCompletes }] = await Promise.all([
    supabase.from("kit_progress").select("email", { count: "exact", head: true }),
    supabase.from("kit_progress").select("email", { count: "exact", head: true }).eq("is_completed", true),
  ]);
  z.kitStarts = kitStarts ?? 0;
  z.kitCompletes = kitCompletes ?? 0;

  return z;
}

async function loadRecentActivity() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { regs: [], orders: [], dfys: [] };
  const [regs, orders, dfys] = await Promise.all([
    supabase.from("training_registrations").select("email, full_name, vip, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("kit_orders").select("email, full_name, amount_cents, created_at").eq("status", "completed").order("created_at", { ascending: false }).limit(6),
    supabase.from("dfy_applications").select("id, email, full_name, budget, status, created_at").order("created_at", { ascending: false }).limit(6),
  ]);
  return { regs: regs.data ?? [], orders: orders.data ?? [], dfys: dfys.data ?? [] };
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatRelTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

export default async function AdminDashboard() {
  const [c, recent] = await Promise.all([loadCounts(), loadRecentActivity()]);

  const vipRate = c.regAll > 0 ? Math.round((c.vipAll / c.regAll) * 100) : 0;
  const kitCompletionRate = c.kitStarts > 0 ? Math.round((c.kitCompletes / c.kitStarts) * 100) : 0;

  return (
    <AdminGate>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">Overview</p>
            <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
              The numbers.
            </h1>
          </div>
          <p className="text-[12px] text-mute">
            Updated {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <BigStat
            label="Training registrations"
            value={c.reg7}
            sub={`${c.reg30} this month · ${c.regAll} all-time`}
            href="#regs"
          />
          <BigStat
            label="Kit orders (revenue)"
            value={formatMoney(c.kitRev7)}
            sub={`${formatMoney(c.kitRev30)} this month · ${formatMoney(c.kitRevAll)} all-time`}
            accent
            href="#kit"
          />
          <BigStat
            label="DFY applications"
            value={c.dfyNew}
            sub={`${c.dfyAll} all-time · ${c.dfyNew} unread`}
            highlight={c.dfyNew > 0}
            href="/admin/applications"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <SmallStat label="VIP conversions" value={c.vip7} sub={`${vipRate}% all-time rate`} />
          <SmallStat label="Kit orders 7d" value={c.kit7} sub={`${c.kitAll} all-time`} />
          <SmallStat label="Kit started" value={c.kitStarts} sub={`${kitCompletionRate}% complete`} />
          <SmallStat label="Kit modules done" value={c.kitCompletes} sub="all buyers" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6">
            <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4" id="regs">Recent registrations</h2>
            {recent.regs.length === 0 ? (
              <p className="text-[14px] text-mute">No registrations yet.</p>
            ) : (
              <ul className="divide-y divide-line/60">
                {recent.regs.map((r, i) => (
                  <li key={i} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[14.5px] text-forest font-medium truncate">{r.full_name || r.email}</p>
                      <p className="text-[12px] text-mute truncate">{r.email}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {r.vip && (
                        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase bg-brass/15 text-brass px-2 py-1 rounded-full">VIP</span>
                      )}
                      <span className="text-[11.5px] text-mute">{formatRelTime(r.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-line rounded-2xl p-6">
            <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4" id="kit">Recent kit orders</h2>
            {recent.orders.length === 0 ? (
              <p className="text-[14px] text-mute">No orders yet.</p>
            ) : (
              <ul className="divide-y divide-line/60">
                {recent.orders.map((o, i) => (
                  <li key={i} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14px] text-forest font-medium truncate">{o.full_name || o.email}</p>
                      <p className="font-serif text-[15px] text-brass tabular-nums shrink-0">
                        ${((o.amount_cents ?? 0) / 100).toFixed(0)}
                      </p>
                    </div>
                    <p className="text-[11.5px] text-mute mt-0.5">{formatRelTime(o.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">DFY applications</h2>
            <a href="/admin/applications" className="text-[12px] text-forest hover:text-brass underline decoration-line">
              View all →
            </a>
          </div>
          {recent.dfys.length === 0 ? (
            <p className="text-[14px] text-mute">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {recent.dfys.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14.5px] text-forest font-medium truncate">{a.full_name}</p>
                    <p className="text-[12px] text-mute truncate">{a.email} · {a.budget || "tier tbd"}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-semibold tracking-[0.14em] uppercase px-2 py-1 rounded-full ${
                      a.status === "new" ? "bg-brass text-ivory" : "bg-bone text-forest"
                    }`}>
                      {a.status}
                    </span>
                    <span className="text-[11.5px] text-mute">{formatRelTime(a.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminGate>
  );
}

function BigStat({
  label,
  value,
  sub,
  accent,
  highlight,
  href,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
  highlight?: boolean;
  href?: string;
}) {
  const Wrap = href ? "a" : "div";
  return (
    <Wrap
      {...(href ? { href } : {})}
      className={`block rounded-2xl p-6 border-2 transition-all ${
        accent
          ? "bg-forest text-ivory border-forest hover:bg-ink"
          : highlight
            ? "bg-brass text-ivory border-brass hover:bg-[#8a6c3f]"
            : "bg-white text-forest border-line hover:border-forest/30"
      }`}
    >
      <p className={`text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-3 ${accent || highlight ? "text-brass" : "text-brass"}`}>
        {label}
      </p>
      <p className={`font-serif text-[44px] md:text-[52px] leading-none tracking-[-0.018em] mb-3 tabular-nums ${accent || highlight ? "text-ivory" : "text-forest"}`}>
        {value}
      </p>
      <p className={`text-[12.5px] ${accent || highlight ? "text-ivory/70" : "text-mute"}`}>
        {sub}
      </p>
    </Wrap>
  );
}

function SmallStat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mute mb-1.5">{label}</p>
      <p className="font-serif text-[26px] text-forest tabular-nums leading-none">{value}</p>
      <p className="text-[11px] text-mute mt-1.5">{sub}</p>
    </div>
  );
}
