import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { WeeklyPlannerForm, type WeeklyPlannerData } from "./WeeklyPlannerForm";

export const dynamic = "force-dynamic";

const DEFAULT: WeeklyPlannerData = {
  week_of: "",
  top_outcomes: ["", "", ""],
  monday: { revenue: "", marketing: "", ops: "" },
  tuesday: { revenue: "", marketing: "", ops: "" },
  wednesday: { revenue: "", marketing: "", ops: "" },
  thursday: { revenue: "", marketing: "", ops: "" },
  friday: { revenue: "", marketing: "", ops: "" },
  friday_review: "",
};

export default async function Module09Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "09-weekly-planner")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<WeeklyPlannerData>) };
  }

  return (
    <main className="max-w-[1080px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="09-weekly-planner"
        subtitle="Pick three outcomes for the week. Schedule them across five days. Friday afternoon, score yourself honestly. Repeat. This is how 90-day plans actually get executed."
      />
      <WeeklyPlannerForm initial={initial} />
      <KitModuleNext currentSlug="09-weekly-planner" />
    </main>
  );
}
