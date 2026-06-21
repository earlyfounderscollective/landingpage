"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Slot = {
  key: string;
  label: string;
  hint: string;
  current: string | null;
};

type HistoryItem = {
  id: string;
  image_url: string;
  prompt: string | null;
  size: string | null;
  quality: string | null;
  created_at: string;
};

const SIZE_OPTIONS = [
  { value: "1024x1024", label: "Square · 1024×1024" },
  { value: "1792x1024", label: "Landscape · 1792×1024" },
  { value: "1024x1792", label: "Portrait · 1024×1792" },
];

const QUALITY_OPTIONS = [
  { value: "standard", label: "Standard (~$0.04)" },
  { value: "hd", label: "HD (~$0.08-0.12)" },
];

const STYLE_OPTIONS = [
  { value: "vivid", label: "Vivid (more dramatic)" },
  { value: "natural", label: "Natural (more realistic)" },
];

const PROMPT_PRESETS = [
  {
    label: "Brass abstract hero",
    text:
      "Editorial abstract composition with flowing brass and antique gold curves dissolving into deep forest green negative space. Faint diagonal light rays, soft grain texture, premium magazine art direction. No text. Cinematic, restrained.",
  },
  {
    label: "Founder portrait illustration",
    text:
      "Elegant minimalist line illustration of a founder at a desk, drawn with single weight brass-colored brush strokes on an ivory background, soft grain. Editorial style, generous negative space. No text.",
  },
  {
    label: "Foundation: Clarity",
    text:
      "Editorial illustration evoking clarity — a single brass thread emerging from a soft fog into sharp focus, on a textured ivory background. Minimal. No text. Premium magazine cover style.",
  },
  {
    label: "Foundation: Structure",
    text:
      "Editorial illustration evoking architectural structure — abstract brass scaffolding forms organized in calm grid composition, on a deep forest green ground. Minimal. No text.",
  },
];

export function ImagesWorkbench({
  slots,
  history,
}: {
  slots: Slot[];
  history: HistoryItem[];
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1792x1024");
  const [quality, setQuality] = useState("hd");
  const [style, setStyle] = useState("vivid");
  const [slotKey, setSlotKey] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [latest, setLatest] = useState<string | null>(null);

  async function generate() {
    if (!prompt.trim()) {
      setErr("Prompt required");
      return;
    }
    setBusy(true);
    setErr(null);
    setLatest(null);
    try {
      const res = await fetch("/api/admin/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size,
          quality,
          style,
          slot_key: slotKey || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error || "Generation failed.");
      } else {
        setLatest(json.image_url);
        router.refresh();
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function assign(imageUrl: string, key: string) {
    if (!key) return;
    await fetch("/api/admin/images/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, slot_key: key }),
    });
    router.refresh();
  }

  async function clearSlot(key: string) {
    if (!confirm("Clear this slot? The page will fall back to the default visual.")) return;
    await fetch("/api/admin/images/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_key: key, clear: true }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
      {/* LEFT — generator + history */}
      <div className="space-y-8">
        {/* Generator */}
        <section className="bg-white border border-line rounded-2xl p-6 md:p-7">
          <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4">
            Generate new image
          </h2>

          <label className="block mb-4">
            <span className="block text-[12px] font-medium text-forest mb-1.5">
              Prompt
            </span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe what you want. Be specific about composition, mood, and brand palette (brass / forest / ivory)."
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-forest placeholder:text-ink/30 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 leading-[1.5] resize-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PROMPT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPrompt(p.text)}
                  className="text-[11px] font-medium tracking-[0.04em] bg-bone hover:bg-bone/70 text-forest px-2.5 py-1 rounded-full border border-line/60"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Selector
              label="Aspect"
              value={size}
              onChange={setSize}
              options={SIZE_OPTIONS}
            />
            <Selector
              label="Quality"
              value={quality}
              onChange={setQuality}
              options={QUALITY_OPTIONS}
            />
            <Selector
              label="Style"
              value={style}
              onChange={setStyle}
              options={STYLE_OPTIONS}
            />
          </div>

          <Selector
            label="Assign to slot (optional)"
            value={slotKey}
            onChange={setSlotKey}
            options={[
              { value: "", label: "— None — just save to history" },
              ...slots.map((s) => ({ value: s.key, label: s.label })),
            ]}
          />

          {err && (
            <p className="mt-4 text-[13px] text-[#9b2828]">{err}</p>
          )}

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="mt-5 inline-flex items-center justify-center gap-2 bg-forest text-ivory px-7 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.06em] uppercase hover:bg-ink transition-colors disabled:opacity-60"
          >
            {busy ? "Generating… (15-25s)" : "Generate image →"}
          </button>

          {latest && (
            <div className="mt-6 pt-6 border-t border-line/60">
              <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brass mb-2">
                Latest result
              </p>
              <img
                src={latest}
                alt=""
                className="rounded-xl border border-line w-full"
              />
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4">
            History
          </h2>
          {history.length === 0 ? (
            <div className="bg-white border border-line rounded-2xl p-8 text-center">
              <p className="text-[14px] text-mute">
                No images yet. Generate your first one above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((h) => (
                <HistoryTile
                  key={h.id}
                  h={h}
                  slots={slots}
                  onAssign={(slot) => assign(h.image_url, slot)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RIGHT — current slots */}
      <aside>
        <h2 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-4">
          Active slots
        </h2>
        <div className="space-y-3">
          {slots.map((s) => (
            <div key={s.key} className="bg-white border border-line rounded-xl overflow-hidden">
              {s.current ? (
                <img
                  src={s.current}
                  alt=""
                  className="w-full aspect-[16/9] object-cover"
                />
              ) : (
                <div className="w-full aspect-[16/9] bg-bone/60 flex items-center justify-center">
                  <span className="text-[11.5px] tracking-[0.16em] uppercase text-mute">
                    Empty
                  </span>
                </div>
              )}
              <div className="p-3.5">
                <p className="text-[13px] font-semibold text-forest leading-[1.3]">
                  {s.label}
                </p>
                <p className="mt-1 text-[11.5px] text-mute leading-[1.45]">
                  {s.hint}
                </p>
                {s.current && (
                  <button
                    type="button"
                    onClick={() => clearSlot(s.key)}
                    className="mt-2 text-[11px] text-mute hover:text-[#9b2828] underline decoration-line"
                  >
                    Clear slot
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Selector({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold tracking-[0.18em] uppercase text-mute mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[14px] text-forest focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function HistoryTile({
  h,
  slots,
  onAssign,
}: {
  h: HistoryItem;
  slots: Slot[];
  onAssign: (slot: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden group">
      <a href={h.image_url} target="_blank" rel="noreferrer" className="block relative">
        <img src={h.image_url} alt="" className="w-full aspect-square object-cover" />
        <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold tracking-[0.14em] uppercase bg-ivory/90 text-forest rounded-full px-1.5 py-0.5">
          {h.size}
        </span>
      </a>
      <div className="p-2.5">
        {picking ? (
          <select
            autoFocus
            onBlur={() => setPicking(false)}
            onChange={(e) => {
              if (e.target.value) {
                onAssign(e.target.value);
                setPicking(false);
              }
            }}
            className="w-full text-[11px] rounded border border-line px-2 py-1"
          >
            <option value="">— Pick slot —</option>
            {slots.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        ) : (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="w-full text-[11px] font-semibold tracking-[0.06em] uppercase text-forest hover:text-brass"
          >
            Assign to slot →
          </button>
        )}
        {h.prompt && (
          <p className="mt-1.5 text-[10.5px] text-mute leading-[1.4] line-clamp-2">
            {h.prompt}
          </p>
        )}
      </div>
    </div>
  );
}
