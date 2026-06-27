import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { KpiDashboardForm, type KpiDashboardData } from "./KpiDashboardForm";

export const dynamic = "force-dynamic";

const DEFAULT: KpiDashboardData = {
  cadence: "weekly",
  kpis: [],
};

export default async function Module10Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "10-kpi-dashboard")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<KpiDashboardData>) };
  }

  return (
    <main className="max-w-[1080px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="10-kpi-dashboard"
        subtitle="Three to five numbers that tell you, every week, whether you have a business or a hobby. If you can't say what your numbers are without checking — they're not the right numbers yet."
      />
      <KpiDashboardForm initial={initial} />
      <KitModuleNext currentSlug="10-kpi-dashboard" />
    </main>
  );
}
