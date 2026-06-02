"use client";

import { useState } from "react";

const SERVICES = [
  "Business Mentorship",
  "Business Growth Audit",
  "Brand Strategy",
  "Brand Identity",
  "Brand Management",
  "Social Media Strategy",
  "Shopify Website or Funnel",
  "Social Media Automation",
] as const;

const SOCIAL_PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "TikTok",
  "Twitter / X",
  "Other",
] as const;

const BUSINESS_TYPES = [
  "Service Business",
  "Product / Ecommerce",
  "Community-Based Business",
  "Creator / Personal Brand",
  "Real Estate",
  "Fitness / Wellness",
  "Restaurant / Hospitality",
  "Technology / SaaS",
  "Other",
] as const;

const BUSINESS_AGES = [
  "Idea Stage",
  "Less Than 6 Months",
  "6–12 Months",
  "1–3 Years",
  "3–5 Years",
  "5+ Years",
] as const;

const REVENUES = [
  "Pre-Revenue",
  "$0–$5,000",
  "$5,000–$10,000",
  "$10,000–$25,000",
  "$25,000–$50,000",
  "$50,000–$100,000",
  "$100,000+",
] as const;

type State = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  servicesInterested: string[];
  socials: Record<string, string>;
  website: string;
  startTiming: string;
  businessType: string;
  businessAge: string;
  monthlyRevenue: string;
  biggestBottleneck: string;
  triedSolutions: string;
  whatsWorking: string;
  ninetyDayGoal: string;
  whyThisCall: string;
  additionalQuestions: string;
  consent: boolean;
};

const initial: State = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  servicesInterested: [],
  socials: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])),
  website: "",
  startTiming: "",
  businessType: "",
  businessAge: "",
  monthlyRevenue: "",
  biggestBottleneck: "",
  triedSolutions: "",
  whatsWorking: "",
  ninetyDayGoal: "",
  whyThisCall: "",
  additionalQuestions: "",
  consent: false,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass">
      {children}
    </p>
  );
}

function Group({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line/70 pt-10 md:pt-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className="mt-3 font-serif text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.012em] text-forest">
          {title}
        </h2>
      )}
      <div className="mt-8 space-y-7 md:space-y-8">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  help,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block">
        <span className="block text-[13.5px] font-medium text-forest mb-2">
          {label}
          {required && <span className="text-brass ml-1">*</span>}
        </span>
        {children}
      </label>
      {help && !error && (
        <p className="mt-2 text-[12.5px] text-mute italic">{help}</p>
      )}
      {error && (
        <p className="mt-2 text-[12.5px] text-[#a13a1a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest transition-colors";
const textareaCls =
  "w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest transition-colors resize-y min-h-[120px]";
const selectCls =
  "w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] text-ink focus:outline-none focus:border-forest transition-colors appearance-none";

export function DiscoveryForm() {
  const [s, setS] = useState<State>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");
  const [honey, setHoney] = useState("");

  function set<K extends keyof State>(k: K, v: State[K]) {
    setS((p) => ({ ...p, [k]: v }));
  }

  function toggleService(name: string) {
    setS((p) => ({
      ...p,
      servicesInterested: p.servicesInterested.includes(name)
        ? p.servicesInterested.filter((x) => x !== name)
        : [...p.servicesInterested, name],
    }));
  }

  function setSocial(platform: string, value: string) {
    setS((p) => ({ ...p, socials: { ...p.socials, [platform]: value } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, _gotcha: honey }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        throw new Error(data?.error || "Something went wrong");
      }
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setServerError(msg);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <section className="bg-ivory min-h-[calc(100vh-200px)] grain">
        <div className="container-page py-32 md:py-44">
          <div className="max-w-[640px] mx-auto text-center">
            <Eyebrow>Application Received</Eyebrow>
            <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
            <h1 className="font-serif text-[36px] md:text-[48px] lg:text-[54px] leading-[1.05] tracking-[-0.02em] text-forest text-balance">
              Application received.
            </h1>
            <div className="mt-10 space-y-5 text-[16px] md:text-[17px] leading-[1.7] text-ink/75 max-w-prose mx-auto">
              <p>
                Thank you for taking the time to complete the application.
              </p>
              <p>
                We'll review your responses before the discovery call so we can
                make the conversation as valuable and productive as possible.
              </p>
              <p>If any additional information is needed, we'll reach out directly.</p>
            </div>
            <p className="mt-14 font-serif italic text-[17px] md:text-[18px] text-forest/85">
              — Oge
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-ivory grain">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-[640px] mx-auto">
          {/* Header */}
          <header className="mb-14 md:mb-16">
            <Eyebrow>Early Founders Collective</Eyebrow>
            <h1 className="mt-5 font-serif text-[36px] md:text-[48px] lg:text-[54px] leading-[1.04] tracking-[-0.022em] text-forest text-balance">
              Discovery Call Application
            </h1>
            <div className="mt-8 space-y-4 text-[15.5px] md:text-[16.5px] leading-[1.65] text-ink/72">
              <p>Complete this application before scheduling a discovery call.</p>
              <p>
                This helps us understand your business, identify where you&rsquo;re
                stuck, and make the most of our conversation.
              </p>
            </div>
          </header>

          {/* Honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            className="absolute -left-[9999px] w-0 h-0"
            aria-hidden="true"
          />

          {/* Group 1 — Who you are */}
          <Group eyebrow="01 · About you">
            <Field label="Full name" required error={errors.fullName}>
              <input
                type="text"
                className={inputCls}
                value={s.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Email address" required error={errors.email}>
              <input
                type="email"
                className={inputCls}
                value={s.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone number" required error={errors.phone}>
              <input
                type="tel"
                className={inputCls}
                value={s.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
            <Field label="Business name" required error={errors.businessName}>
              <input
                type="text"
                className={inputCls}
                value={s.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                autoComplete="organization"
              />
            </Field>
          </Group>

          {/* Group 2 — What you're exploring */}
          <Group eyebrow="02 · What you're exploring">
            <Field
              label="What services are you interested in?"
              required
              error={errors.servicesInterested}
            >
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SERVICES.map((name) => {
                  const checked = s.servicesInterested.includes(name);
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => toggleService(name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md border text-left text-[14px] transition-colors ${
                        checked
                          ? "bg-forest text-ivory border-forest"
                          : "bg-white text-forest border-line hover:border-forest/40"
                      }`}
                    >
                      <span
                        className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border ${
                          checked
                            ? "bg-ivory border-ivory"
                            : "bg-white border-line"
                        }`}
                      >
                        {checked && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M2 5.5L4.5 8L9 3"
                              stroke="#23352D"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {name}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Group>

          {/* Group 3 — Online presence */}
          <Group eyebrow="03 · Online presence">
            <Field label="Social media accounts" required>
              <div className="mt-1 grid grid-cols-1 gap-2.5">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div
                    key={platform}
                    className="grid grid-cols-[110px_1fr] items-center gap-3"
                  >
                    <span className="text-[12.5px] uppercase tracking-[0.12em] text-mute font-medium">
                      {platform}
                    </span>
                    <input
                      type="text"
                      className={inputCls}
                      value={s.socials[platform] ?? ""}
                      onChange={(e) => setSocial(platform, e.target.value)}
                      placeholder={
                        platform === "Other" ? "Platform + link" : "@handle or URL"
                      }
                    />
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Existing website URL">
              <input
                type="url"
                className={inputCls}
                value={s.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://"
                autoComplete="url"
              />
            </Field>
            <Field
              label="How soon would you like to get started?"
              required
              error={errors.startTiming}
            >
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(["Right Now", "Next 2 Weeks"] as const).map((opt) => {
                  const checked = s.startTiming === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => set("startTiming", opt)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md border text-left text-[14px] transition-colors ${
                        checked
                          ? "bg-forest text-ivory border-forest"
                          : "bg-white text-forest border-line hover:border-forest/40"
                      }`}
                    >
                      <span
                        className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                          checked
                            ? "bg-ivory border-ivory"
                            : "bg-white border-line"
                        }`}
                      >
                        {checked && (
                          <span className="h-[8px] w-[8px] rounded-full bg-forest" />
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Group>

          {/* Group 4 — Your business */}
          <Group eyebrow="04 · Your business">
            <Field
              label="What type of business do you run?"
              required
              error={errors.businessType}
            >
              <div className="relative">
                <select
                  className={selectCls}
                  value={s.businessType}
                  onChange={(e) => set("businessType", e.target.value)}
                >
                  <option value="">Select one</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute">
                  ▾
                </span>
              </div>
            </Field>
            <Field
              label="How long have you been in business?"
              required
              error={errors.businessAge}
            >
              <div className="relative">
                <select
                  className={selectCls}
                  value={s.businessAge}
                  onChange={(e) => set("businessAge", e.target.value)}
                >
                  <option value="">Select one</option>
                  {BUSINESS_AGES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute">
                  ▾
                </span>
              </div>
            </Field>
            <Field
              label="Current monthly revenue"
              required
              error={errors.monthlyRevenue}
            >
              <div className="relative">
                <select
                  className={selectCls}
                  value={s.monthlyRevenue}
                  onChange={(e) => set("monthlyRevenue", e.target.value)}
                >
                  <option value="">Select one</option>
                  {REVENUES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute">
                  ▾
                </span>
              </div>
            </Field>
          </Group>

          {/* Group 5 — Where things stand */}
          <Group eyebrow="05 · Where things stand">
            <Field
              label="What is the biggest bottleneck in your business right now?"
              required
              help="If you could solve one thing over the next 90 days, what would it be?"
              error={errors.biggestBottleneck}
            >
              <textarea
                className={textareaCls}
                value={s.biggestBottleneck}
                onChange={(e) => set("biggestBottleneck", e.target.value)}
                rows={4}
              />
            </Field>
            <Field label="What have you already tried to solve this problem?">
              <textarea
                className={textareaCls}
                value={s.triedSolutions}
                onChange={(e) => set("triedSolutions", e.target.value)}
                rows={4}
              />
            </Field>
            <Field label="What is currently working well in your business?">
              <textarea
                className={textareaCls}
                value={s.whatsWorking}
                onChange={(e) => set("whatsWorking", e.target.value)}
                rows={4}
              />
            </Field>
          </Group>

          {/* Group 6 — Looking forward */}
          <Group eyebrow="06 · Looking forward">
            <Field label="What is your primary goal over the next 90 days?">
              <textarea
                className={textareaCls}
                value={s.ninetyDayGoal}
                onChange={(e) => set("ninetyDayGoal", e.target.value)}
                rows={4}
              />
            </Field>
            <Field label="Why are you interested in having this conversation?">
              <textarea
                className={textareaCls}
                value={s.whyThisCall}
                onChange={(e) => set("whyThisCall", e.target.value)}
                rows={4}
              />
            </Field>
            <Field label="Additional questions or inquiries">
              <textarea
                className={textareaCls}
                value={s.additionalQuestions}
                onChange={(e) => set("additionalQuestions", e.target.value)}
                rows={4}
              />
            </Field>
          </Group>

          {/* Consent + Submit */}
          <section className="border-t border-line/70 pt-10 md:pt-14 mt-12">
            <label className="flex gap-3.5 cursor-pointer items-start">
              <input
                type="checkbox"
                checked={s.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-[3px] h-[18px] w-[18px] accent-forest cursor-pointer flex-shrink-0"
              />
              <span className="text-[14px] leading-[1.55] text-ink/80">
                I agree to be contacted by Early Founders Collective regarding my
                application and discovery call.
                <span className="text-brass ml-1">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="mt-2 ml-[30px] text-[12.5px] text-[#a13a1a]">
                {errors.consent}
              </p>
            )}

            {serverError && (
              <p className="mt-6 text-[13px] text-[#a13a1a]" role="alert">
                {serverError}
              </p>
            )}

            <div className="mt-10">
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto bg-forest text-ivory px-10 py-[18px] rounded-full text-[14.5px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60"
              >
                {status === "sending" ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
