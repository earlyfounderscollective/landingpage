import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { GuideModule, GUIDE_DEFAULT, type GuideData } from "@/components/kit/GuideModule";
import { WEBSITE_GUIDE } from "@/lib/kit-guide-configs";

export const dynamic = "force-dynamic";

export default async function Module12Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = GUIDE_DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "12-website")
      .maybeSingle();
    if (data?.data) initial = { ...GUIDE_DEFAULT, ...(data.data as Partial<GuideData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="12-website"
        subtitle="One page, done in a weekend. The customer who's ready to buy doesn't need a tour of your soul — they need to see the offer, see the proof, and click the button."
      />
      <GuideModule config={WEBSITE_GUIDE} initial={initial} />
      <KitModuleNext currentSlug="12-website" />
    </main>
  );
}
