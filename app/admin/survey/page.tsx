import { AdminGate } from "@/components/admin/AdminGate";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SurveyResponse = {
  id: string;
  email: string | null;
  full_name: string | null;
  rating: number | null;
  most_valuable: string | null;
  confusing: string | null;
  wish_covered: string | null;
  kit_likelihood: number | null;
  cohort_likelihood: number | null;
  barrier: string | null;
  other: string | null;
  created_at: string;
};

async function loadResponses(): Promise<SurveyResponse[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("training_survey_responses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as SurveyResponse[];
}

function avg(nums: (number | null)[]): number | null {
  const vals = nums.filter((n): n is number => typeof n === "number");
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function formatRelTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

export default async function AdminSurveyPage() {
  const responses = await loadResponses();
  const avgRating = avg(responses.map((r) => r.rating));
  const avgKit = avg(responses.map((r) => r.kit_likelihood));
  const avgCohort = avg(responses.map((r) => r.cohort_likelihood));

  return (
    <AdminGate>
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-brass mb-2">
              Post-webinar feedback
            </p>
            <h1 className="font-serif text-[34px] md:text-[40px] tracking-[-0.018em] text-forest">
              What they're telling you.
            </h1>
          </div>
          <p className="text-[12px] text-mute">{responses.length} responses</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Responses" value={responses.length} sub="all-time" />
          <Stat
            label="Avg rating"
            value={avgRating ?? "—"}
            sub="out of 5"
            accent
          />
          <Stat
            label="Kit intent"
            value={avgKit ?? "—"}
            sub="avg 1-5"
          />
          <Stat
            label="Cohort intent"
            value={avgCohort ?? "—"}
            sub="avg 1-5"
          />
        </div>

        {responses.length === 0 ? (
          <div className="bg-white border border-line rounded-2xl p-10 text-center">
            <p className="text-[14px] text-mute">
              No survey responses yet. They'll show up here as attendees fill it
              out after the training.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {responses.map((r) => (
              <li
                key={r.id}
                className="bg-white border border-line rounded-2xl p-5 md:p-6"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[14.5px] text-forest font-medium truncate">
                      {r.full_name || r.email || "Anonymous"}
                    </p>
                    {r.email && (
                      <p className="text-[12px] text-mute truncate">{r.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {typeof r.rating === "number" && (
                      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase bg-forest text-ivory px-2.5 py-1 rounded-full">
                        {r.rating}/5
                      </span>
                    )}
                    <span className="text-[11.5px] text-mute">
                      {formatRelTime(r.created_at)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <Answer label="Most valuable" value={r.most_valuable} />
                  <Answer label="Confusing / not useful" value={r.confusing} />
                  <Answer label="Wish I'd covered" value={r.wish_covered} />
                  <Answer label="Holding them back" value={r.barrier} />
                  {r.other && (
                    <div className="md:col-span-2">
                      <Answer label="Anything else" value={r.other} />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-line">
                  {typeof r.kit_likelihood === "number" && (
                    <span className="text-[11px] text-forest bg-bone px-2.5 py-1 rounded-full">
                      Kit intent: {r.kit_likelihood}/5
                    </span>
                  )}
                  {typeof r.cohort_likelihood === "number" && (
                    <span className="text-[11px] text-forest bg-bone px-2.5 py-1 rounded-full">
                      Cohort intent: {r.cohort_likelihood}/5
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGate>
  );
}

function Answer({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-brass mb-1">
        {label}
      </p>
      <p className="text-[14px] text-ink/80 leading-[1.55] whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent ? "bg-forest border-forest" : "bg-white border-line"
      }`}
    >
      <p
        className={`text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5 ${
          accent ? "text-brass" : "text-mute"
        }`}
      >
        {label}
      </p>
      <p
        className={`font-serif text-[26px] tabular-nums leading-none ${
          accent ? "text-ivory" : "text-forest"
        }`}
      >
        {value}
      </p>
      <p className={`text-[11px] mt-1.5 ${accent ? "text-ivory/70" : "text-mute"}`}>
        {sub}
      </p>
    </div>
  );
}
