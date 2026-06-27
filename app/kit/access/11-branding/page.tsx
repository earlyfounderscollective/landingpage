import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { GuideModule, GUIDE_DEFAULT, type GuideData } from "@/components/kit/GuideModule";
import { BRANDING_GUIDE } from "@/lib/kit-guide-configs";

export const dynamic = "force-dynamic";

export default async function Module11Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = GUIDE_DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "11-branding")
      .maybeSingle();
    if (data?.data) initial = { ...GUIDE_DEFAULT, ...(data.data as Partial<GuideData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="11-branding"
        subtitle="Most early founders spend 3 months on the brand instead of 3 months on customers. This guide gets you to a sharp, consistent brand in one day — so you can spend the rest of the quarter actually selling."
      />
      <GuideModule config={BRANDING_GUIDE} initial={initial} />
      <KitModuleNext currentSlug="11-branding" />
    </main>
  );
}
