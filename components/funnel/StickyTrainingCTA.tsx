import { TrainingForm } from "./TrainingForm";

type Mode = "upcoming" | "replay" | "between";

/**
 * Mobile-only persistent CTA at the bottom of the /training viewport.
 * Opens the same modal as the inline CTAs. Hidden on md+ where the
 * inline buttons are already in view.
 */
export function StickyTrainingCTA({
  mode,
  ctaLabel,
  helperText,
}: {
  mode: Mode;
  ctaLabel: string;
  helperText?: string;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-8 bg-gradient-to-t from-forest via-forest/90 to-transparent"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <TrainingForm
        mode={mode}
        ctaLabel={ctaLabel}
        helperText={helperText}
        variant="modal"
        fullWidth
      />
    </div>
  );
}
