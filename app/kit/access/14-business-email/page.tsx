import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { GuideModule, GUIDE_DEFAULT, type GuideData } from "@/components/kit/GuideModule";
import { EMAIL_GUIDE } from "@/lib/kit-guide-configs";

export const dynamic = "force-dynamic";

export default async function Module14Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = GUIDE_DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "14-business-email")
      .maybeSingle();
    if (data?.data) initial = { ...GUIDE_DEFAULT, ...(data.data as Partial<GuideData>) };
  }

  return (
    <main className="max-w-[920px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="14-business-email"
        subtitle="hello@yourdomain.com instead of yourbusiness1234@gmail.com. The cheapest credibility upgrade your business will ever buy — under an hour, under $10/month."
      />
      <GuideModule config={EMAIL_GUIDE} initial={initial} />
      <KitModuleNext currentSlug="14-business-email" />
    </main>
  );
}
