import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { ReferralWorksheetForm, type ReferralData } from "./ReferralWorksheetForm";

export const dynamic = "force-dynamic";

const DEFAULT: ReferralData = {
  ask_offer: "",
  who_you_target: "",
  people: [],
};

export default async function Module07Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "07-referral-worksheet")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<ReferralData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="07-referral-worksheet"
        subtitle="The cheapest customer you'll ever get is one a previous customer brings you. This worksheet maps who could refer you, what to ask for, and what you'll offer back."
      />
      <ReferralWorksheetForm initial={initial} />
      <KitModuleNext currentSlug="07-referral-worksheet" />
    </main>
  );
}
