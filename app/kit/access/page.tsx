import Link from "next/link";
import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KIT_MODULES, type KitModuleSlug } from "@/lib/kit-modules";

export const dynamic = "force-dynamic";

type Progress = { module_slug: string; is_completed: boolean; data: Record<string, unknown> };

export default async function KitDashboard() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let progress: Progress[] = [];
  let fullName = "";
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("module_slug, is_completed, data")
      .eq("email", email);
    progress = (data ?? []) as Progress[];

    const { data: order } = await supabase
      .from("kit_orders")
      .select("full_name")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (order?.full_name) {
      fullName = String(order.full_name).split(/\s+/)[0];
    }
  }

  const completedSlugs = new Set(
    progress.filter((p) => p.is_completed).map((p) => p.module_slug),
  );
  const startedSlugs = new Set(progress.map((p) => p.module_slug));
  const completedCount = completedSlugs.size;
  const pct = Math.round((completedCount / KIT_MODULES.length) * 100);

  return (
    <main className="max-w-[1240px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 mb-12 md:items-start">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass mb-3">
            Build Your Business Kit
          </p>
          <h1 className="font-serif text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.018em] text-forest">
            {fullName ? `Welcome in, ${fullName}.` : "Welcome in."}
          </h1>
          <p className="mt-3 text-[15px] text-ink/72 max-w-[520px] leading-[1.6]">
            Six modules. Set up the business in a weekend. Start with Module 01
            and work down the list — or jump to the one you need most.
          </p>
        </div>

        <aside className="bg-white border border-line rounded-[14px] p-5 min-w-[260px]">
          <p className="text-[10.5px] font-medium tracking-[0.28em] uppercase text-brass mb-1.5">
            Your kit
          </p>
          <p className="font-serif text-[34px] text-forest leading-none mb-2.5">
            {pct}%
            <span className="text-[14px] text-mute ml-1">complete</span>
          </p>
          <div className="h-[5px] bg-bone rounded-full overflow-hidden mb-3.5">
            <div
              className="h-full bg-gradient-to-r from-[#9B7A4A] to-[#B59164] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[12px] text-mute">
            {completedCount} of {KIT_MODULES.length} modules done
          </p>
        </aside>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KIT_MODULES.map((m) => {
          const done = completedSlugs.has(m.slug);
          const started = startedSlugs.has(m.slug);
          const status = done ? "complete" : started ? "active" : "open";
          return (
            <Link
              key={m.slug}
              href={`/kit/access/${m.slug}`}
              className="block bg-white border border-line rounded-[14px] p-[22px] transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.1)]"
            >
              <p className="font-serif text-[13px] text-brass tracking-[0.05em] mb-2.5">
                {m.n}
              </p>
              <h3 className="font-serif text-[22px] font-normal leading-[1.15] tracking-[-0.012em] text-forest mb-2">
                {m.title}
              </h3>
              <p className="text-[13.5px] text-mute leading-[1.5] mb-[18px]">
                {m.desc}
              </p>
              <footer className="flex items-center justify-between pt-3.5 border-t border-dashed border-line">
                <span className="text-[11px] text-mute">{m.estimate}</span>
                <span
                  className={`text-[10.5px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-md ${
                    status === "complete"
                      ? "bg-forest text-ivory"
                      : status === "active"
                        ? "bg-brass text-ivory"
                        : "bg-bone text-forest"
                  }`}
                >
                  {status === "complete"
                    ? "Done"
                    : status === "active"
                      ? "In progress"
                      : "Open"}
                </span>
              </footer>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-bone rounded-[14px] p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-[42px] w-[42px] rounded-full bg-forest text-ivory flex items-center justify-center font-serif text-[18px]">
            ↗
          </div>
          <div>
            <h4 className="font-serif text-[18px] text-forest mb-0.5">
              Bring the kit into the community
            </h4>
            <p className="text-[13px] text-mute">
              Drop your filled-in offer or pricing in #momentum for feedback.
            </p>
          </div>
        </div>
        <a
          href="https://app.theoperatorera.com/c/early-founders-collective/feed"
          target="_blank"
          rel="noreferrer"
          className="bg-forest text-ivory px-5 py-3 rounded-full text-[13px] font-medium tracking-[0.02em] hover:bg-ink transition-colors"
        >
          Open community →
        </a>
      </div>
    </main>
  );
}
