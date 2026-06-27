import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { GuideModule, GUIDE_DEFAULT, type GuideData } from "@/components/kit/GuideModule";
import { DOMAIN_GUIDE } from "@/lib/kit-guide-configs";

export const dynamic = "force-dynamic";

export default async function Module13Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = GUIDE_DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "13-domain")
      .maybeSingle();
    if (data?.data) initial = { ...GUIDE_DEFAULT, ...(data.data as Partial<GuideData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="13-domain"
        subtitle="The right extension, the right registrar, and the 5 settings you'd kick yourself for not turning on. 20 minutes today saves you a stolen domain or a renewal disaster later."
      />
      <GuideModule config={DOMAIN_GUIDE} initial={initial} />
      <KitModuleNext currentSlug="13-domain" />
    </main>
  );
}
