"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { submitApplication, type SubmitResult } from "./actions";
import { stageOptions, participationOptions } from "@/lib/validation";

type Errors = Record<string, string>;

const fieldClass = "editorial-input";
const labelClass = "editorial-label";
const helpClass = "text-[12.5px] text-ink/55 mt-2";
const errorClass = "text-[12.5px] text-[#8B2E1F] mt-2 font-medium";

export function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [topMessage, setTopMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ id: string | null; name: string } | null>(null);
  const [pending, startTransition] = useTransition();
  // Stamp the moment this form mounts — used by the server action to detect
  // instant bot submissions. Computed once per mount.
  const loadedAtRef = useRef<number>(Date.now());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const name = String(fd.get("fullName") ?? "Builder");

    setErrors({});
    setTopMessage(null);

    startTransition(async () => {
      const res: SubmitResult = await submitApplication(fd);
      if (res.ok) {
        setSubmitted({ id: res.id, name });
        formRef.current?.reset();
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setErrors(res.fieldErrors ?? {});
        setTopMessage(res.message ?? "Something went wrong.");
        const firstKey = Object.keys(res.fieldErrors ?? {})[0];
        if (firstKey) {
          const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-forest text-ivory">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M4 11L9 16L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <p className="eyebrow mb-5">Application Received</p>
        <h2 className="font-serif text-display-md text-forest">
          Thank you, {submitted.name.split(" ")[0]}.
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-[16.5px] leading-[1.65] text-ink/75">
          Your application has been received and will be reviewed manually. If it looks like a strong fit, you&rsquo;ll hear from us shortly with next steps. In the meantime, keep building.
        </p>
        {submitted.id && (
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-ink/45 font-medium">
            Reference &middot; {submitted.id}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">Back to home</Link>
          <a href="mailto:contact@earlyfounderscollective.com" className="btn-ghost">
            contact@earlyfounderscollective.com →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-16"
    >
      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <div className="sr-only" aria-hidden tabIndex={-1}>
        <label htmlFor="websiteUrl">
          Leave this field empty
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <input type="hidden" name="loadedAt" value={loadedAtRef.current} />

      {topMessage && (
        <div
          role="alert"
          className="rounded-soft border border-[#D7B2A8] bg-[#FBEDE8] text-[#8B2E1F] px-5 py-3.5 text-[14px]"
        >
          {topMessage}
        </div>
      )}

      <Section index="01" title="The basics" subtitle="A few quick details about you.">
        <Grid>
          <Field label="Full name" name="fullName" error={errors.fullName}>
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              className={fieldClass}
              placeholder="First and last"
            />
          </Field>
          <Field label="Email" name="email" error={errors.email}>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className={fieldClass}
              placeholder="you@domain.com"
            />
          </Field>
          <Field label="Phone" name="phone" error={errors.phone}>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              className={fieldClass}
              placeholder="+1 …"
            />
          </Field>
          <Field label="City" name="city" error={errors.city}>
            <input
              type="text"
              name="city"
              autoComplete="address-level2"
              required
              className={fieldClass}
              placeholder="Where you live"
            />
          </Field>
          <Field
            label="Social or web link"
            name="socialLink"
            error={errors.socialLink}
            span={2}
            help="Twitter, Instagram, LinkedIn, personal site, wherever you show up."
          >
            <input
              type="text"
              name="socialLink"
              required
              className={fieldClass}
              placeholder="https://"
            />
          </Field>
        </Grid>
      </Section>

      <Section index="02" title="What you're building" subtitle="The honest version, not the pitch deck version.">
        <Grid>
          <Field
            label="What are you currently building?"
            name="currentBuild"
            error={errors.currentBuild}
            span={2}
          >
            <textarea
              name="currentBuild"
              rows={4}
              required
              className="editorial-textarea"
              placeholder="The honest, specific version. What it is, who it's for, where it's at."
            />
          </Field>

          <Field label="What stage are you in?" name="stage" error={errors.stage} span={2}>
            <div className="flex flex-wrap gap-2 pt-2">
              {stageOptions.map((s) => (
                <label
                  key={s}
                  className="cursor-pointer text-[13px] font-medium px-4 py-2.5 rounded-full border border-line bg-white text-ink has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:checked]:border-forest transition-colors"
                >
                  <input
                    type="radio"
                    name="stage"
                    value={s}
                    className="sr-only"
                    required
                  />
                  {s}
                </label>
              ))}
            </div>
          </Field>
        </Grid>
      </Section>

      <Section index="03" title="The work" subtitle="What's actually been getting in the way.">
        <Grid>
          <Field
            label="What has slowed your execution the most in the last 90 days?"
            name="executionChallenge"
            error={errors.executionChallenge}
            span={2}
          >
            <textarea
              name="executionChallenge"
              rows={4}
              required
              className="editorial-textarea"
              placeholder="Be honest. Patterns matter more than excuses."
            />
          </Field>

          <Field
            label="What would meaningful progress look like in the next 180 days?"
            name="progressGoal"
            error={errors.progressGoal}
            span={2}
          >
            <textarea
              name="progressGoal"
              rows={4}
              required
              className="editorial-textarea"
              placeholder="The version of progress that would actually change something for you."
            />
          </Field>
        </Grid>
      </Section>

      <Section index="04" title="The fit" subtitle="Why now, and how you'll show up.">
        <Grid>
          <Field
            label="Why do you want to join Early Founders Collective?"
            name="whyJoin"
            error={errors.whyJoin}
            span={2}
          >
            <textarea
              name="whyJoin"
              rows={4}
              required
              className="editorial-textarea"
              placeholder="What you're looking for and why now."
            />
          </Field>

          <Field
            label="Are you willing to participate consistently?"
            name="participateWeekly"
            error={errors.participateWeekly}
            span={2}
            help="The room only works when people show up. Honest answers only."
          >
            <div className="flex gap-2 pt-2">
              {participationOptions.map((p) => (
                <label
                  key={p}
                  className="cursor-pointer text-[13px] font-medium px-5 py-2.5 rounded-full border border-line bg-white text-ink has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:checked]:border-forest transition-colors"
                >
                  <input
                    type="radio"
                    name="participateWeekly"
                    value={p}
                    className="sr-only"
                    required
                  />
                  {p}
                </label>
              ))}
            </div>
          </Field>
        </Grid>
      </Section>

      <div className="pt-8 border-t border-line/70 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <p className="text-[13.5px] text-ink/60 max-w-sm leading-relaxed">
          Applications are reviewed manually. Replies usually arrive within 2-3 days.
        </p>
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60 disabled:pointer-events-none">
          {pending ? "Sending…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-y-8 lg:gap-x-16">
      <div className="col-span-12 lg:col-span-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brass">
          Step {index}
        </p>
        <h3 className="mt-3 font-serif text-[26px] md:text-[28px] leading-[1.18] text-forest tracking-[-0.012em]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-3 text-[14.5px] leading-[1.6] text-ink/60 max-w-xs">
            {subtitle}
          </p>
        )}
      </div>
      <div className="col-span-12 lg:col-span-8">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">{children}</div>;
}

function Field({
  label,
  name,
  error,
  children,
  span = 1,
  help,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
  span?: 1 | 2;
  help?: string;
}) {
  return (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
      {help && !error && <p className={helpClass}>{help}</p>}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
