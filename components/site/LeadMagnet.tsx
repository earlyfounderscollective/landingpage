"use client";

import { useState } from "react";

export function LeadMagnet() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "homepage", _gotcha: honey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't send. Try again.");
      setStatus("sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Couldn't send. Try again.";
      setError(msg);
      setStatus("error");
    }
  }

  return (
    <section id="checklist" className="bg-ivory py-24 md:py-32 grain scroll-mt-24 border-t border-forest/10">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow">The Free Checklist</span>
              <div className="rule mt-6 mb-8" aria-hidden />
              <h2 className="font-serif text-[32px] md:text-[40px] lg:text-[44px] leading-[1.06] tracking-[-0.018em] text-forest text-balance">
                Find out where your business is actually stuck.
              </h2>
              <p className="mt-7 text-[15.5px] md:text-[16px] leading-[1.6] text-ink/72 max-w-prose">
                Most founders don&rsquo;t need another idea. They need to know
                whether the real problem is their offer, visibility, sales
                process, follow-up, systems, or consistency.
              </p>
              <p className="mt-4 text-[15.5px] md:text-[16px] leading-[1.6] text-ink/72 max-w-prose">
                Download the free Founder Sales &amp; Systems Checklist and see
                what needs to be fixed first.
              </p>
            </div>

            <div className="bg-bone border border-line/70 rounded-card p-6 md:p-8 shadow-[0_18px_50px_-30px_rgba(35,53,45,0.18)]">
              {status === "sent" ? (
                <div className="py-6 text-center">
                  <p className="font-serif text-[24px] md:text-[26px] leading-[1.2] text-forest tracking-[-0.012em]">
                    Sent.
                  </p>
                  <p className="mt-3 text-[14.5px] text-ink/70 leading-[1.55]">
                    Check your inbox{email ? ` at ${email}` : ""}. If it isn&rsquo;t
                    there in five minutes, check spam.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brass mb-1.5">
                    Get the checklist
                  </p>
                  <p className="font-serif text-[20px] md:text-[22px] leading-[1.25] text-forest tracking-[-0.012em] mb-5">
                    Drop your name and email. Lands in your inbox in seconds.
                  </p>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                    className="absolute -left-[9999px] w-0 h-0"
                    aria-hidden="true"
                  />

                  <div className="space-y-2.5">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-4 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 bg-white border border-line rounded-md text-[14.5px] focus:outline-none focus:border-forest"
                    />
                    <button
                      type="submit"
                      disabled={status === "sending" || !email}
                      className="w-full bg-forest text-ivory px-5 py-[14px] rounded-full text-[14px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Get the Free Checklist"}
                    </button>
                  </div>

                  {error && (
                    <p className="text-[12.5px] text-[#a13a1a] mt-3" role="alert">
                      {error}
                    </p>
                  )}

                  <p className="mt-4 text-[11.5px] text-ink/55 leading-[1.5]">
                    No spam. Unsubscribe whenever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
