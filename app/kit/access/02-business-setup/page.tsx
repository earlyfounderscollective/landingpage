import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { BusinessSetupChecklist, type BusinessSetupData } from "./BusinessSetupChecklist";

export const dynamic = "force-dynamic";

const DEFAULT: BusinessSetupData = { checked: {}, notes: "" };

export default async function Module02Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "02-business-setup")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<BusinessSetupData>) };
  }

  return (
    <main className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="02-business-setup"
        subtitle="Don't pay a consultant to do this. Work through the list in order. Most of it takes one afternoon."
      />
      <BusinessSetupChecklist initial={initial} />
      <KitModuleNext currentSlug="02-business-setup" />
    </main>
  );
}
