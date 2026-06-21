import { AdminGate } from "@/components/admin/AdminGate";
import { getBootcampConfig } from "@/lib/bootcamp";
import { getSupabaseAdmin } from "@/lib/supabase";
import { BootcampEditor } from "./BootcampEditor";

export const dynamic = "force-dynamic";

type Order = {
  email: string;
  full_name: string | null;
  cohort: string | null;
  amount_cents: number | null;
  created_at: string;
};

export default async function AdminBootcampPage() {
  const config = await getBootcampConfig();

  const supabase = getSupabaseAdmin();
  let orders: Order[] = [];
  let totalRevenue = 0;
  if (supabase) {
    const { data } = await supabase
      .from("bootcamp_orders")
      .select("email, full_name, cohort, amount_cents, created_at")
      .eq("status", "completed")
      .order("created_at", { ascending: false });
    orders = (data ?? []) as Order[];
    totalRevenue =
      orders.reduce((acc, o) => acc + (o.amount_cents ?? 0), 0) / 100;
  }

  return (
    <AdminGate>
      <div className="max-w-[920px] mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">
            Founders Foundation
          </p>
          <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
            Cohort + pricing.
          </h1>
          <p className="mt-2 text-[14px] text-mute leading-[1.55] max-w-[600px]">
            Edit the cohort start date, price, and reservation status. Changes
            go live everywhere on the next page load.
          </p>
        </div>

        <BootcampEditor
          initial={{
            cohortStartDate: config.cohortStartDate ?? "",
            cohortLabel: config.cohortLabel,
            priceCents: config.priceCents,
            originalPriceCents: config.originalPriceCents,
            isOpen: config.isOpen,
          }}
        />

        <div className="mt-12">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass">
              Reservations
            </h2>
            <p className="text-[13px] text-mute">
              {orders.length} {orders.length === 1 ? "seat" : "seats"} · $
              {totalRevenue.toLocaleString()} revenue
            </p>
          </div>
          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-[14px] text-mute">
                No reservations yet.
              </p>
            ) : (
              <ul className="divide-y divide-line/60">
                {orders.map((o, i) => (
                  <li key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[14.5px] text-forest font-medium truncate">
                        {o.full_name || o.email}
                      </p>
                      <p className="text-[12px] text-mute truncate">
                        {o.email} · {o.cohort || "cohort TBD"}
                      </p>
                    </div>
                    <p className="font-serif text-[15px] text-brass tabular-nums shrink-0">
                      ${((o.amount_cents ?? 0) / 100).toFixed(0)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminGate>
  );
}
