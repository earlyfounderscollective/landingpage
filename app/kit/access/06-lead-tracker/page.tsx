import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { LeadTracker, type LeadTrackerData } from "./LeadTracker";

export const dynamic = "force-dynamic";

const DEFAULT: LeadTrackerData = { leads: [] };

export default async function Module06Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "06-lead-tracker")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<LeadTrackerData>) };
  }

  return (
    <main className="max-w-[1080px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="06-lead-tracker"
        subtitle="Every conversation goes here. Don't trust your head. Pipeline value at the bottom tells you whether you have a business or a hobby."
      />
      <LeadTracker initial={initial} />
      <KitModuleNext currentSlug="06-lead-tracker" />
    </main>
  );
}
