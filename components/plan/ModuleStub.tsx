import Link from "next/link";

export function ModuleStub({
  n,
  total = 7,
  title,
  desc,
  questions,
  tasks,
  prevSlug,
  nextSlug,
}: {
  n: string;
  total?: number;
  title: string;
  desc: string;
  questions: number;
  tasks: number;
  prevSlug?: string;
  nextSlug?: string;
}) {
  return (
    <div className="max-w-[820px] mx-auto px-6 md:px-10 py-12 md:py-16">
      <Link
        href="/plan"
        className="text-[12px] text-brass hover:text-forest mb-5 inline-block"
      >
        ← All modules
      </Link>

      <header className="mb-10">
        <p className="font-serif text-[14px] text-brass tracking-[0.04em] mb-2">
          {n} · Module {parseInt(n, 10)} of {total}
        </p>
        <h1 className="font-serif text-[36px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.018em] text-forest mb-4">
          {title}
        </h1>
        <p className="text-[16px] text-mute leading-[1.6] max-w-[560px]">
          {desc}
        </p>
      </header>

      {/* Voice note slot */}
      <div className="bg-bone rounded-xl p-4 flex items-center gap-3.5 mb-10">
        <div className="h-[38px] w-[38px] rounded-full bg-forest/30 text-ivory flex items-center justify-center shrink-0">
          <span className="ml-0.5 inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-ivory" />
        </div>
        <div className="flex-1 text-[12px] text-mute">
          <strong className="block font-serif italic text-forest font-normal text-[14px] mb-0.5">
            A note from Oge
          </strong>
          Voice note coming soon
        </div>
        <span className="text-[11px] text-mute tracking-[0.04em]">—:—</span>
      </div>

      {/* Coming-soon body */}
      <div className="bg-white border border-line rounded-[14px] p-10 md:p-12 text-center">
        <p className="font-serif italic text-brass text-[16px] mb-3">
          Building this now.
        </p>
        <h2 className="font-serif text-[24px] md:text-[28px] text-forest leading-[1.2] mb-5 text-balance">
          The module is being drafted in your voice.
        </h2>
        <p className="text-[14.5px] text-mute leading-[1.6] max-w-[460px] mx-auto mb-7">
          {questions} questions and {tasks} tactical tasks will live here.
          You'll be able to jump in as soon as it's wired up. In the meantime,
          you can keep working on the other modules.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {prevSlug && (
            <Link
              href={`/plan/${prevSlug}`}
              className="border border-forest/25 text-forest px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-forest hover:text-ivory transition-colors"
            >
              ← Previous module
            </Link>
          )}
          <Link
            href="/plan"
            className="bg-forest text-ivory px-5 py-2.5 rounded-full text-[13px] font-medium tracking-[0.02em] hover:bg-ink transition-colors"
          >
            Back to dashboard
          </Link>
          {nextSlug && (
            <Link
              href={`/plan/${nextSlug}`}
              className="border border-forest/25 text-forest px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-forest hover:text-ivory transition-colors"
            >
              Next module →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
