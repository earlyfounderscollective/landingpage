import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { OfferClarityForm, type OfferClarityData } from "./OfferClarityForm";

export const dynamic = "force-dynamic";

const DEFAULT: OfferClarityData = {
  what_you_sell: "",
  who_its_for: "",
  outcome: "",
  time_to_outcome: "",
  one_sentence: "",
};

export default async function Module01Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "01-offer-clarity")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<OfferClarityData>) };
  }

  return (
    <main className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="01-offer-clarity"
        subtitle="Most early founders can't say what they sell in one sentence. This module fixes that. Answer the three questions, then write the one-sentence offer your customer will repeat back to you."
      />
      <OfferClarityForm initial={initial} />
      <KitModuleNext currentSlug="01-offer-clarity" />
    </main>
  );
}
