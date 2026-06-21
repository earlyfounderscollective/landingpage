import { AdminGate } from "@/components/admin/AdminGate";
import {
  SLOTS,
  getAllImageSlots,
  getRecentHistory,
} from "@/lib/ai-images";
import { ImagesWorkbench } from "./ImagesWorkbench";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const [slotMap, history] = await Promise.all([
    getAllImageSlots(),
    getRecentHistory(48),
  ]);

  return (
    <AdminGate>
      <div className="max-w-[1180px] mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">
            AI Image Studio
          </p>
          <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
            Generate. Pick. Ship.
          </h1>
          <p className="mt-2 text-[14px] text-mute leading-[1.55] max-w-[640px]">
            Type a prompt, generate with DALL-E 3, assign it to any slot. The
            page reads the slot on its next render — no code changes.
          </p>
        </div>

        <ImagesWorkbench
          slots={SLOTS.map((s) => ({ ...s, current: slotMap[s.key] ?? null }))}
          history={history}
        />
      </div>
    </AdminGate>
  );
}
