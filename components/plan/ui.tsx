"use client";

import { ReactNode, useState } from "react";

// === Field wrapper ===
export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="block text-[14px] font-medium text-forest mb-1.5">
        {label}
      </label>
      {help && (
        <p className="text-[13px] text-mute mb-2.5 leading-[1.5]">{help}</p>
      )}
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-white border border-line rounded-lg text-[14px] text-ink placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-colors";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input type="text" {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`${inputClass} resize-none leading-[1.5] ${props.className ?? ""}`}
    />
  );
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ""}`}>
      {children}
    </select>
  );
}

export function Example({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-[12px] text-mute">
      <span className="text-brass font-semibold tracking-[0.04em] uppercase text-[11px] mr-1.5">
        Example
      </span>
      {children}
    </p>
  );
}

// === Step block ===
export function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-9">
      <header className="flex items-baseline gap-3 mb-4 pb-2.5 border-b border-line">
        <span className="font-serif text-[13px] text-brass tracking-[0.04em]">
          {number}
        </span>
        <h3 className="font-serif text-[20px] font-normal text-forest">
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

// === Task (expandable) ===
export function Task({
  title,
  sub,
  children,
  defaultOpen,
}: {
  title: string;
  sub?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="bg-[#fdfbf6] border border-line rounded-[10px] overflow-hidden mb-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-3.5 text-left"
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            setDone((v) => !v);
          }}
          role="checkbox"
          aria-checked={done}
          className={`relative mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[5px] border-[1.5px] cursor-pointer ${
            done
              ? "bg-forest border-forest"
              : "bg-white border-mute hover:border-forest/60"
          }`}
        >
          {done && (
            <span className="absolute left-[5px] top-[1px] h-[10px] w-[5px] border-r-2 border-b-2 border-ivory rotate-45" />
          )}
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-medium text-forest mb-0.5">{title}</p>
          {sub && (
            <p className="text-[12.5px] text-mute leading-[1.5]">{sub}</p>
          )}
        </div>
        {children && (
          <span
            className={`text-mute text-[18px] transition-transform ${
              open ? "rotate-45" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        )}
      </button>
      {open && children && (
        <div className="px-3.5 pb-3.5 pl-[44px]">{children}</div>
      )}
    </div>
  );
}

// === Mission grid (fill-in-the-blank) ===
export function MissionGrid({
  values,
  onChange,
}: {
  values: Record<string, string>;
  onChange?: (key: string, value: string) => void;
}) {
  const rows = [
    { key: "we_are", label: "WE ARE" },
    { key: "we_provide", label: "WE PROVIDE" },
    { key: "for", label: "FOR" },
    { key: "who_want", label: "WHO WANT" },
    { key: "launched", label: "WE LAUNCHED" },
  ];
  return (
    <div className="grid grid-cols-[120px_1fr] gap-x-3.5 gap-y-2 items-center">
      {rows.map((r) => (
        <div key={r.key} className="contents">
          <label className="font-serif italic text-brass text-[14px]">
            {r.label}
          </label>
          <TextInput
            value={values[r.key] ?? ""}
            onChange={(e) => onChange?.(r.key, e.target.value)}
            placeholder={r.label === "WE LAUNCHED" ? "2026, Houston" : ""}
          />
        </div>
      ))}
    </div>
  );
}

// === Values list (3-5 rows) ===
export function ValuesList({
  values,
  onChange,
}: {
  values: string[];
  onChange?: (idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <TextInput
          key={i}
          value={values[i] ?? ""}
          onChange={(e) => onChange?.(i, e.target.value)}
          placeholder={i < 3 ? `Value ${i + 1}` : `Value ${i + 1} (optional)`}
        />
      ))}
    </div>
  );
}

// === Color picker (3 swatches) ===
export function ColorRow({
  label,
  hex,
  onChange,
}: {
  label: string;
  hex: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.22em] text-mute mb-1.5 font-medium">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="h-[30px] w-[30px] rounded-md border border-black/10 shrink-0"
          style={{ background: hex }}
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 px-2.5 py-[7px] bg-white border border-line rounded-md text-[12px] font-mono text-ink focus:outline-none focus:border-forest"
        />
      </div>
    </div>
  );
}

// === Name brainstorm grid (10 inputs, 2-col) ===
export function NameGrid({
  names,
  onChange,
}: {
  names: string[];
  onChange?: (idx: number, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <input
          key={i}
          type="text"
          value={names[i] ?? ""}
          onChange={(e) => onChange?.(i, e.target.value)}
          placeholder={`Name ${i + 1}`}
          className="w-full px-3 py-2 bg-white border border-line rounded-md text-[13px] text-ink placeholder:text-ink/35 focus:outline-none focus:border-forest"
        />
      ))}
    </div>
  );
}

// === Handle grid ===
export function HandleGrid({
  values,
  onChange,
}: {
  values: Record<string, string>;
  onChange?: (key: string, value: string) => void;
}) {
  const rows = [
    { key: "instagram", label: "Instagram", ph: "@handle" },
    { key: "x", label: "X / Twitter", ph: "@handle" },
    { key: "linkedin", label: "LinkedIn", ph: "linkedin.com/company/…" },
    { key: "tiktok", label: "TikTok", ph: "@handle" },
  ];
  return (
    <div className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-2 items-center">
      {rows.map((r) => (
        <div key={r.key} className="contents">
          <label className="font-serif italic text-brass text-[12.5px]">
            {r.label}
          </label>
          <input
            type="text"
            value={values[r.key] ?? ""}
            onChange={(e) => onChange?.(r.key, e.target.value)}
            placeholder={r.ph}
            className="w-full px-3 py-2 bg-white border border-line rounded-md text-[13px] text-ink placeholder:text-ink/35 focus:outline-none focus:border-forest"
          />
        </div>
      ))}
    </div>
  );
}

// === File upload stub ===
export function FileUploadStub({
  helper,
}: {
  helper?: string;
}) {
  return (
    <div className="border-[1.5px] border-dashed border-line rounded-[10px] p-6 text-center bg-white">
      <div className="mx-auto mb-2.5 h-[34px] w-[34px] rounded-full bg-bone text-brass flex items-center justify-center text-[18px]">
        ↑
      </div>
      <p className="text-[13px] text-forest">
        <strong>Drop your file here</strong> or click to browse
      </p>
      {helper && <p className="mt-1 text-[11.5px] text-mute">{helper}</p>}
      <p className="mt-2 text-[10.5px] uppercase tracking-[0.22em] text-mute/70">
        Upload coming in next phase
      </p>
    </div>
  );
}
