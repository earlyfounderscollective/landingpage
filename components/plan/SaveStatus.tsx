"use client";

type Status = "idle" | "loading" | "saving" | "saved" | "error";

function fmt(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function SaveStatus({
  status,
  savedAt,
}: {
  status: Status;
  savedAt: Date | null;
}) {
  let label: string | null = null;
  let cls = "text-mute";

  if (status === "loading") label = "Loading your draft…";
  else if (status === "saving") label = "Saving…";
  else if (status === "error") {
    label = "Couldn't save. Will retry.";
    cls = "text-[#a13a1a]";
  } else if (status === "saved" && savedAt) label = `Saved · ${fmt(savedAt)}`;

  if (!label) return null;
  return <span className={`text-[11px] ${cls} tracking-[0.02em]`}>{label}</span>;
}
