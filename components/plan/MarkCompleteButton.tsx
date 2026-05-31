"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "efc:plan:saved";

function readProjectId(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as { projectId?: string };
    return obj.projectId || null;
  } catch {
    return null;
  }
}

type Status = "idle" | "saving" | "done" | "error" | "no-project";

export function MarkCompleteButton({ moduleSlug }: { moduleSlug: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [pid, setPid] = useState<string | null>(null);

  useEffect(() => {
    setPid(readProjectId());
  }, []);

  async function onClick() {
    if (!pid) {
      setStatus("no-project");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/plan/complete-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: pid, moduleSlug }),
      });
      if (!res.ok) throw new Error("complete failed");
      const data = (await res.json()) as { nextSlug: string | null };
      setStatus("done");
      setTimeout(() => {
        router.push(data.nextSlug ? `/plan/${data.nextSlug}` : "/plan");
      }, 900);
    } catch {
      setStatus("error");
    }
  }

  const isDone = status === "done";
  const isSaving = status === "saving";
  const noProject = status === "no-project";
  const isError = status === "error";

  let label = "Mark module complete";
  if (isSaving) label = "Saving…";
  else if (isDone) label = "Done. Onwards →";
  else if (isError) label = "Try again";

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isSaving || isDone}
        className={`px-7 py-3 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap ${
          isDone
            ? "bg-forest text-ivory cursor-default"
            : "bg-forest text-ivory hover:bg-ink disabled:opacity-60"
        }`}
      >
        {label}
      </button>
      {noProject && (
        <p className="text-[11px] text-[#a13a1a] max-w-[260px] text-right leading-[1.4]">
          Sign up at <a href="/plan" className="underline">/plan</a> first so we can save this.
        </p>
      )}
    </div>
  );
}
