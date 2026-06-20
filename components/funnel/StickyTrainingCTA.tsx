import { TrainingForm } from "./TrainingForm";

type Mode = "upcoming" | "replay" | "between";

/**
 * Persistent CTA floating at the bottom of the viewport on every page
 * width. Ivory backdrop + subtle top shadow so it reads cleanly over
 * dark hero sections AND light content sections. Opens the same modal
 * as the inline CTAs.
 */
export function StickyTrainingCTA({
  mode,
  ctaLabel,
  ctaSubline,
  helperText,
}: {
  mode: Mode;
  ctaLabel: string;
  ctaSubline?: string;
  helperText?: string;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-t border-line/60 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.18)]"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="container-page pt-3">
        <div className="max-w-[420px] mx-auto">
          <TrainingForm
            mode={mode}
            ctaLabel={ctaLabel}
            ctaSubline={ctaSubline}
            helperText={helperText}
            variant="modal"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
