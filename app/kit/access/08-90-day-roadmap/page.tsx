import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { RoadmapForm, type RoadmapData } from "./RoadmapForm";

export const dynamic = "force-dynamic";

const DEFAULT: RoadmapData = {
  north_star: "",
  phase_1: { focus: "", one_number: "", actions: ["", "", ""] },
  phase_2: { focus: "", one_number: "", actions: ["", "", ""] },
  phase_3: { focus: "", one_number: "", actions: ["", "", ""] },
  keep: "",
  kill: "",
};

export default async function Module08Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "08-90-day-roadmap")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<RoadmapData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="08-90-day-roadmap"
        subtitle="Most founders fail because they confuse activity with progress. This roadmap forces you to pick three 30-day phases, one number per phase, and three actions each. Anything that doesn't serve a phase gets killed."
      />
      <RoadmapForm initial={initial} />
      <KitModuleNext currentSlug="08-90-day-roadmap" />
    </main>
  );
}
