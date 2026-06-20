import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { First30Playbook, type First30Data } from "./First30Playbook";

export const dynamic = "force-dynamic";

const DEFAULT: First30Data = { day_done: {}, names: "", a_list: "", channel: "", weekly_rhythm: "" };

export default async function Module05Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "05-first-30")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<First30Data>) };
  }

  return (
    <main className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="05-first-30"
        subtitle="A five-day sprint to get your first 30 customers. You don't need a marketing strategy yet. You need to talk to people who already know you."
      />
      <First30Playbook initial={initial} />
      <KitModuleNext currentSlug="05-first-30" />
    </main>
  );
}
