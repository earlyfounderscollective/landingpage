"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "loading" | "saving" | "saved" | "error";

const SIGNUP_KEY = "efc:plan:saved";

function readProjectId(): string | null {
  try {
    const raw = localStorage.getItem(SIGNUP_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as { projectId?: string };
    return obj.projectId || null;
  } catch {
    return null;
  }
}

function localKey(moduleSlug: string) {
  return `efc:plan:answers:${moduleSlug}`;
}

function readLocal<T>(moduleSlug: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(localKey(moduleSlug));
    if (!raw) return null;
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return null;
  }
}

function writeLocal<T>(moduleSlug: string, answers: T) {
  try {
    localStorage.setItem(localKey(moduleSlug), JSON.stringify(answers));
  } catch {
    // Quota exceeded — silently skip; server save still happens if signed in.
  }
}

export function usePlanAutoSave<T extends object>({
  moduleSlug,
  answers,
  setAnswers,
}: {
  moduleSlug: string;
  answers: T;
  setAnswers: (next: T) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const projectIdRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const setAnswersRef = useRef(setAnswers);
  setAnswersRef.current = setAnswers;

  // Hydrate on mount: prefer server, fall back to local.
  useEffect(() => {
    const pid = readProjectId();
    projectIdRef.current = pid;
    const local = readLocal<T>(moduleSlug);

    const applyMerged = (data: Partial<T>) => {
      const merged = { ...(answersRef.current as object), ...(data as object) } as T;
      setAnswersRef.current(merged);
    };

    if (pid) {
      setStatus("loading");
      const url = `/api/plan/load?projectId=${encodeURIComponent(pid)}&moduleSlug=${encodeURIComponent(moduleSlug)}`;
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("load failed"))))
        .then((data) => {
          if (data?.answers && typeof data.answers === "object") {
            applyMerged(data.answers as Partial<T>);
          } else if (local) {
            applyMerged(local);
          }
        })
        .catch(() => {
          if (local) applyMerged(local);
        })
        .finally(() => {
          hydratedRef.current = true;
          setStatus("idle");
        });
    } else {
      if (local) applyMerged(local);
      hydratedRef.current = true;
    }
    // moduleSlug is stable for the lifetime of the page; we don't want re-hydrate on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug]);

  // Debounced save on every change.
  useEffect(() => {
    if (!hydratedRef.current) return;

    writeLocal(moduleSlug, answers);

    if (!projectIdRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("saving");
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/plan/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: projectIdRef.current,
            moduleSlug,
            answers: answersRef.current,
          }),
        });
        if (!res.ok) throw new Error("save failed");
        setStatus("saved");
        setSavedAt(new Date());
      } catch {
        setStatus("error");
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [answers, moduleSlug]);

  return { status, savedAt };
}
