import Link from "next/link";
import { EmailGate } from "@/components/plan/EmailGate";

type ModuleCard = {
  n: string;
  slug: string;
  title: string;
  desc: string;
  questions: number;
  tasks: number;
  status: "complete" | "active" | "locked" | "open";
  questionsDone?: number;
  tasksDone?: number;
};

const modules: ModuleCard[] = [
  {
    n: "01",
    slug: "01-your-brand",
    title: "Your Brand",
    desc: "Mission, target customer, values, name. The foundation everything else builds on.",
    questions: 7,
    tasks: 7,
    status: "open",
    questionsDone: 0,
    tasksDone: 0,
  },
  {
    n: "02",
    slug: "02-your-market",
    title: "Your Market",
    desc: "Who you're really for. Who else is there. Where the opening is.",
    questions: 7,
    tasks: 4,
    status: "open",
  },
  {
    n: "03",
    slug: "03-your-offer",
    title: "Your Offer",
    desc: "What you actually sell. What it solves. Why it's different.",
    questions: 11,
    tasks: 6,
    status: "open",
  },
  {
    n: "04",
    slug: "04-your-plan",
    title: "Your Plan",
    desc: "The operating doc. Vision, goals, money, team, risk.",
    questions: 10,
    tasks: 6,
    status: "open",
  },
  {
    n: "05",
    slug: "05-your-reach",
    title: "Your Reach",
    desc: "Where you'll be found. Two channels done well beats five done badly.",
    questions: 7,
    tasks: 6,
    status: "open",
  },
  {
    n: "06",
    slug: "06-your-funnel",
    title: "Your Funnel",
    desc: "The path from stranger to customer. Top, middle, bottom of funnel.",
    questions: 8,
    tasks: 6,
    status: "open",
  },
  {
    n: "07",
    slug: "07-your-retention",
    title: "Your Retention",
    desc: "Onboarding, support, the referral loop that compounds.",
    questions: 9,
    tasks: 6,
    status: "open",
  },
];

function ModuleCard({ m }: { m: ModuleCard }) {
  const totalSteps = m.questions + m.tasks;
  const stepsDone = (m.questionsDone ?? 0) + (m.tasksDone ?? 0);
  const isLocked = m.status === "locked";
  const isComplete = m.status === "complete";
  const isActive = m.status === "active";

  const card = (
    <article
      className={`bg-white border border-line rounded-[14px] p-[22px] transition-all ${
        isLocked
          ? "opacity-55"
          : "hover:-translate-y-[1px] hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.1)] cursor-pointer"
      }`}
    >
      {/* Dots indicator */}
      <div className="flex gap-1 mb-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < stepsDone ? "bg-brass" : "bg-bone"
            }`}
          />
        ))}
      </div>

      <p className="font-serif text-[13px] text-brass tracking-[0.05em] mb-2.5">
        {m.n}
      </p>
      <h3 className="font-serif text-[24px] font-normal leading-[1.15] tracking-[-0.012em] text-forest mb-2">
        {m.title}
      </h3>
      <p className="text-[13.5px] text-mute leading-[1.5] mb-[18px]">
        {m.desc}
      </p>

      <footer className="flex items-center justify-between pt-3.5 border-t border-dashed border-line">
        <span className="text-[11px] text-mute">
          {stepsDone} of {totalSteps} done
        </span>
        <span
          className={`text-[10.5px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-md ${
            isComplete
              ? "bg-forest text-ivory"
              : isActive
                ? "bg-brass text-ivory"
                : isLocked
                  ? "bg-bone text-mute"
                  : "bg-bone text-forest"
          }`}
        >
          {isComplete
            ? "Complete"
            : isActive
              ? "In progress"
              : isLocked
                ? "Locked"
                : "Open"}
        </span>
      </footer>
    </article>
  );

  if (isLocked) return card;
  return (
    <Link href={`/plan/${m.slug}`} className="block">
      {card}
    </Link>
  );
}

export default function PlanDashboard() {
  const totalSteps = modules.reduce(
    (acc, m) => acc + m.questions + m.tasks,
    0,
  );
  const stepsDone = modules.reduce(
    (acc, m) => acc + (m.questionsDone ?? 0) + (m.tasksDone ?? 0),
    0,
  );
  const pct = Math.round((stepsDone / totalSteps) * 100);

  return (
    <main className="max-w-[1240px] mx-auto px-6 md:px-10 py-12 md:py-14">
      {/* Hello / progress */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 mb-12 md:items-start">
        <div>
          <h1 className="font-serif text-[36px] md:text-[42px] leading-[1.05] tracking-[-0.018em] text-forest">
            Welcome in.
          </h1>
          <p className="mt-3 text-[15px] text-mute max-w-[480px] leading-[1.55]">
            Pick up where you left off. Most members finish in 6–8 weeks of
            consistent work. There's no rush. The work compounds.
          </p>
        </div>

        <aside className="bg-white border border-line rounded-[14px] p-5 min-w-[280px]">
          <p className="text-[10.5px] font-medium tracking-[0.28em] uppercase text-brass mb-1.5">
            Your plan
          </p>
          <p className="font-serif text-[34px] text-forest leading-none mb-2.5">
            {pct}%
            <span className="text-[14px] text-mute ml-1">complete</span>
          </p>
          <div className="h-[5px] bg-bone rounded-full overflow-hidden mb-3.5">
            <div
              className="h-full bg-gradient-to-r from-[#9B7A4A] to-[#B59164] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-forest hover:text-brass transition-colors"
            disabled
          >
            Export current draft →
          </button>
        </aside>
      </div>

      <EmailGate />

      {/* Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <ModuleCard key={m.slug} m={m} />
        ))}
      </div>

      {/* Bottom helper */}
      <div className="mt-12 bg-bone rounded-[14px] p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-[42px] w-[42px] rounded-full bg-forest text-ivory flex items-center justify-center font-serif text-[18px]">
            ↗
          </div>
          <div>
            <h4 className="font-serif text-[18px] text-forest mb-0.5">
              Share your progress in the room
            </h4>
            <p className="text-[13px] text-mute">
              Drop a snapshot of your in-progress plan in #momentum for
              feedback.
            </p>
          </div>
        </div>
        <a
          href="https://app.theoperatorera.com/c/early-founders-collective/feed"
          target="_blank"
          rel="noreferrer"
          className="bg-forest text-ivory px-5 py-3 rounded-full text-[13px] font-medium tracking-[0.02em] hover:bg-ink transition-colors"
        >
          Open community →
        </a>
      </div>
    </main>
  );
}
