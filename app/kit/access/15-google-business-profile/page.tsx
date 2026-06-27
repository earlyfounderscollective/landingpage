import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { GuideModule, GUIDE_DEFAULT, type GuideData } from "@/components/kit/GuideModule";
import { GBP_GUIDE } from "@/lib/kit-guide-configs";

export const dynamic = "force-dynamic";

export default async function Module15Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = GUIDE_DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "15-google-business-profile")
      .maybeSingle();
    if (data?.data) initial = { ...GUIDE_DEFAULT, ...(data.data as Partial<GuideData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="15-google-business-profile"
        subtitle="Free real estate on Google. The 5-review threshold is what unlocks local-search ranking. Most of your competitors set theirs up once and forgot. Outwork them in 30 minutes a week."
      />
      <GuideModule config={GBP_GUIDE} initial={initial} />
      <KitModuleNext currentSlug="15-google-business-profile" />
    </main>
  );
}
