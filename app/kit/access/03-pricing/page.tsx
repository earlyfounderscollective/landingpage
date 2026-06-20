import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { PricingCalculator, type PricingData } from "./PricingCalculator";

export const dynamic = "force-dynamic";

const DEFAULT: PricingData = {
  hours_per_job: "",
  hourly_floor: "",
  market_low: "",
  market_high: "",
  positioning: "middle",
  final_price: "",
};

export default async function Module03Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "03-pricing")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<PricingData>) };
  }

  return (
    <main className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="03-pricing"
        subtitle="Most early founders price too low because they're scared. This module gives you a defensible number — your hourly floor, the market range, and where you should land."
      />
      <PricingCalculator initial={initial} />
      <KitModuleNext currentSlug="03-pricing" />
    </main>
  );
}
