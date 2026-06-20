import { redirect } from "next/navigation";
import { getKitSessionEmail } from "@/lib/kit-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KitModuleHeader, KitModuleNext } from "@/components/kit/KitModuleShell";
import { AIPromptsLibrary, type AIPromptsData } from "./AIPromptsLibrary";

export const dynamic = "force-dynamic";

const DEFAULT: AIPromptsData = { used: {} };

export default async function Module04Page() {
  const email = getKitSessionEmail();
  if (!email) redirect("/kit/access/login");

  const supabase = getSupabaseAdmin();
  let initial = DEFAULT;
  if (supabase) {
    const { data } = await supabase
      .from("kit_progress")
      .select("data")
      .eq("email", email)
      .eq("module_slug", "04-ai-prompts")
      .maybeSingle();
    if (data?.data) initial = { ...DEFAULT, ...(data.data as Partial<AIPromptsData>) };
  }

  return (
    <main className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-14">
      <KitModuleHeader
        slug="04-ai-prompts"
        subtitle="Ten copy-paste prompts I actually use. Drop them into ChatGPT or Claude with your specifics filled in. They replace 80% of the consultant calls I used to pay for."
      />
      <AIPromptsLibrary initial={initial} />
      <KitModuleNext currentSlug="04-ai-prompts" />
    </main>
  );
}
