import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getActiveTrainingEvent } from "@/lib/training";
import { TrainingEditor } from "@/components/admin/TrainingEditor";
import { TrainingEmailTester } from "@/components/admin/TrainingEmailTester";
import { AdminGate } from "@/components/admin/AdminGate";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  if (!isAdmin()) {
    redirect("/admin/login?next=/admin/training");
  }

  const event = await getActiveTrainingEvent();
  if (!event) {
    return (
      <AdminGate>
        <div className="max-w-[640px] mx-auto text-center py-20">
          <p className="text-[14px] text-mute">
            No active training row found. Check Supabase — there should be one
            row in <code>public.training_event</code> with{" "}
            <code>is_active = true</code>.
          </p>
        </div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <TrainingEditor initial={event} />
      <TrainingEmailTester defaultEmail={env.adminEmail} />
    </AdminGate>
  );
}
