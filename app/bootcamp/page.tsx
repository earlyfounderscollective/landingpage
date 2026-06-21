import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { VideoReviews } from "@/components/site/VideoReviews";
import { FAQAccordion } from "@/components/funnel/FAQAccordion";
import { VSLEmbed } from "@/components/funnel/VSLEmbed";
import { getBootcampConfig, formatCohortDate } from "@/lib/bootcamp";
import { getImageSlot } from "@/lib/ai-images";
import { lookupReferralCode, REFERRAL } from "@/lib/referrals";
import { CheckoutButton } from "./CheckoutButton";
import { BrushUnderline } from "@/components/bootcamp/BrushUnderline";
import { HeroGradientField, SwooshDivider } from "@/components/bootcamp/GradientSwoosh";
import { FoundationGlyph } from "@/components/bootcamp/FoundationGlyph";

export const metadata: Metadata = {
  title: "Founders Foundation · Early Founders Collective",
  description:
    "A 4-week guided program to turn your skill, side hustle, or business idea into a legitimate business. $497.",
};

export const dynamic = "force-dynamic";

export default async function BootcampPage({
  searchParams,
}: {
  searchParams: { source?: string; ref?: string };
}) {
  const source = searchParams.source ?? "direct";
  const refCodeRaw = (searchParams.ref ?? "").trim().toUpperCase().slice(0, 32);
  const [config, heroImage, referral] = await Promise.all([
    getBootcampConfig(),
    getImageSlot("bootcamp.hero"),
    refCodeRaw ? lookupReferralCode(refCodeRaw) : Promise.resolve(null),
  ]);

  const discountActive = Boolean(referral);
  const finalPriceCents = discountActive
    ? Math.max(0, config.priceCents - REFERRAL.friendDiscountCents)
    : config.priceCents;
  const priceLabel = `$${(finalPriceCents / 100).toLocaleString()}`;
  // Always anchor against the original retail price ($997) so the
  // perceived discount looks like the full delta from retail, not
  // from the standard sale price.
  const originalLabel = `$${(config.originalPriceCents / 100).toLocaleString()}`;
  const cohortDate = formatCohortDate(config.cohortStartDate);

  return (
    <>
      <Header tone="dark" minimal />
      <main>
        {/* HERO */}
        <section className="bg-forest text-ivory pt-28 md:pt-36 pb-20 md:pb-24 relative overflow-hidden">
          {heroImage ? (
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={heroImage}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-forest/65 via-forest/55 to-forest/85" />
            </div>
          ) : (
            <HeroGradientField />
          )}
          <div className="container-page relative">
            <div className="max-w-[920px] mx-auto text-center">
              {discountActive && (
                <div className="inline-flex items-center gap-2.5 bg-brass text-ivory rounded-full px-5 py-2 mb-5 shadow-[0_18px_40px_-18px_rgba(155,122,74,0.7)]">
                  <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase">
                    $100 off · Referral applied
                  </span>
                </div>
              )}
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2.5 bg-ivory/8 border border-brass/40 rounded-full px-5 py-2.5 mb-9 backdrop-blur-sm">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-brass animate-ping opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.26em] uppercase text-brass">
                  The foundation starts here
                </span>
              </div>

              {/* Headline with mixed weight + brush underline */}
              <h1 className="font-serif text-[44px] sm:text-[58px] md:text-[72px] leading-[1.02] tracking-[-0.022em] text-ivory">
                Turn your skill into a{" "}
                <span className="text-brass">
                  <BrushUnderline color="#9B7A4A">real business</BrushUnderline>
                </span>{" "}
                in 4 weeks.
              </h1>

              <p className="mt-9 max-w-[680px] mx-auto text-[16.5px] md:text-[18px] leading-[1.7] text-ivory/78">
                A 4-week guided program designed to help you turn your skill,
                side hustle, or business idea into a legitimate business that's
                structured, professional, and ready to grow.
              </p>

              {/* Video slot */}
              <div className="mt-12 max-w-[780px] mx-auto">
                <VSLEmbed url={config.videoUrl} />
              </div>

              {/* Pricing line above CTA — sets the value before the button */}
              <div className="mt-12 inline-flex items-baseline gap-3 flex-wrap justify-center">
                <span className="text-[11.5px] font-semibold tracking-[0.26em] uppercase text-ivory/55">
                  Investment
                </span>
                <span className="font-serif text-[26px] text-ivory/45 line-through tabular-nums">
                  {originalLabel}
                </span>
                <span className="font-serif text-[34px] md:text-[40px] text-brass tabular-nums leading-none">
                  {priceLabel}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-7 flex justify-center">
                <CheckoutButton
                  refCode={discountActive ? refCodeRaw : undefined}
                  source={source}
                  label="Join Founders Foundation"
                  accent
                  size="large"
                />
              </div>

              {config.cohortLabel && (
                <p className="mt-7 text-[12px] text-ivory/55 tracking-[0.22em] uppercase">
                  {config.cohortLabel}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEAVE WITH */}
        <section className="bg-ivory py-20 md:py-28 relative">
          <div className="container-page">
            <div className="max-w-[1080px] mx-auto">
              <div className="text-center max-w-[680px] mx-auto mb-14">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  What you'll leave with
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.06] tracking-[-0.02em] text-forest">
                  Four weeks of work.{" "}
                  <BrushUnderline color="#9B7A4A">A business that lasts.</BrushUnderline>
                </h2>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 max-w-[860px] mx-auto">
                {LEAVE_WITH.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-4 items-start text-[16px] md:text-[17px] leading-[1.55] text-forest"
                  >
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest text-ivory"
                      aria-hidden
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6.5L4.5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-14 max-w-[560px] mx-auto text-center">
                <p className="font-serif text-[22px] md:text-[26px] leading-[1.3] text-ink/55 italic">
                  This isn't about consuming more content.
                </p>
                <p className="mt-1 font-serif text-[26px] md:text-[32px] leading-[1.2] text-forest">
                  It's about building a business.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SwooshDivider />

        {/* VIDEO REVIEWS (testimonials) */}
        <section className="bg-bone pt-20 md:pt-24 pb-4 md:pb-6 grain">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto text-center mb-12">
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                Real founders. Real businesses.
              </p>
              <h2 className="font-serif text-[34px] md:text-[44px] leading-[1.08] tracking-[-0.018em] text-forest">
                People who started right where{" "}
                <BrushUnderline color="#9B7A4A">you are.</BrushUnderline>
              </h2>
            </div>
          </div>
        </section>
        <VideoReviews showHeading={false} />

        {/* WHY THIS EXISTS */}
        <section className="bg-forest text-ivory py-20 md:py-28 relative overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(155,122,74,0.4) 0%, rgba(155,122,74,0) 70%)",
            }}
            aria-hidden
          />
          <div className="container-page relative">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  Why Founders Foundation exists
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-ivory">
                  Most people don't fail because they lack{" "}
                  <BrushUnderline color="#9B7A4A">talent.</BrushUnderline>
                </h2>
              </div>

              <div className="space-y-5 text-[16.5px] md:text-[17.5px] leading-[1.75] text-ivory/78 max-w-[640px] mx-auto">
                <p>
                  Most people fail because nobody teaches them{" "}
                  <span className="text-ivory">how to turn a skill into a business</span>.
                </p>
                <p>
                  So they spend months jumping between YouTube videos, Google
                  searches, podcasts, and random advice trying to figure out
                  what to do next.
                </p>
                <p>
                  Founders Foundation was built to simplify the process.
                </p>
                <p className="font-serif text-[19px] md:text-[22px] text-brass italic leading-[1.5] pt-3">
                  Instead of wondering where to start, you'll follow a proven
                  roadmap and build alongside people doing the same thing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE FOUR FOUNDATIONS */}
        <section className="bg-ivory py-20 md:py-28">
          <div className="container-page">
            <div className="max-w-[1180px] mx-auto">
              <div className="text-center max-w-[680px] mx-auto mb-16">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  The four foundations
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.06] tracking-[-0.02em] text-forest">
                  The same{" "}
                  <BrushUnderline color="#9B7A4A">four pillars</BrushUnderline>{" "}
                  show up in every real business.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
                {FOUNDATIONS.map((f, i) => (
                  <article
                    key={f.title}
                    className="relative bg-bone rounded-2xl p-8 md:p-10 border border-line/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-30px_rgba(35,53,45,0.25)]"
                  >
                    <FoundationGlyph variant={f.variant} index={i} />
                    <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-mute mb-1">
                      Foundation {NUM[i]}
                    </p>
                    <h3 className="font-serif text-[30px] md:text-[36px] leading-[1.08] tracking-[-0.015em] text-forest mb-5">
                      {f.title}
                    </h3>
                    <p className="text-[15.5px] leading-[1.65] text-ink/72 mb-3">
                      {f.lead}
                    </p>
                    {f.body && (
                      <p className="text-[15px] leading-[1.65] text-ink/68">
                        {f.body}
                      </p>
                    )}
                    {f.list && (
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-[14.5px] leading-[1.55] text-ink/72">
                        {f.list.map((x) => (
                          <li
                            key={x}
                            className="grid grid-cols-[auto_1fr] gap-2 items-center"
                          >
                            <span className="h-1 w-1 rounded-full bg-brass" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-bone py-20 md:py-28 grain relative overflow-hidden">
          <div className="container-page relative">
            <div className="max-w-[920px] mx-auto">
              <div className="text-center mb-14">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  What's included
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.06] tracking-[-0.02em] text-forest">
                  Everything you need for {priceLabel}.
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {INCLUDED.map((item, i) => (
                  <div
                    key={item.title}
                    className="bg-ivory rounded-2xl p-7 md:p-9 border border-line/60 flex flex-col md:flex-row md:items-start gap-5 md:gap-7"
                  >
                    <div className="shrink-0">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-ivory">
                        <IncludedIcon variant={item.icon} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-mute mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.2] text-forest mb-3">
                        {item.title}
                      </h3>
                      {item.body && (
                        <p className="text-[15px] leading-[1.65] text-ink/72">
                          {item.body}
                        </p>
                      )}
                      {item.list && (
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-[14.5px] leading-[1.55] text-ink/72">
                          {item.list.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      )}
                      {item.foot && (
                        <p className="mt-3 text-[14px] italic leading-[1.65] text-ink/60">
                          {item.foot}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHO THIS IS FOR / NOT FOR */}
        <section className="bg-ivory py-20 md:py-28 relative overflow-hidden">
          <div className="container-page relative">
            <div className="max-w-[1180px] mx-auto">
              <div className="text-center max-w-[720px] mx-auto mb-14">
                <h2 className="font-serif text-[40px] md:text-[58px] leading-[1.05] tracking-[-0.022em] text-forest">
                  This isn't{" "}
                  <BrushUnderline color="#9B7A4A">for everyone</BrushUnderline>.
                </h2>
                <p className="mt-6 text-[16.5px] leading-[1.65] text-ink/72">
                  We only work with people we know we can get results for.{" "}
                  <span className="text-forest font-medium">Read this carefully before you apply.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
                {/* FOR YOU */}
                <article className="relative bg-ivory rounded-3xl border-2 border-forest/15 p-8 md:p-10 shadow-[0_18px_50px_-30px_rgba(35,53,45,0.25)]">
                  <div className="absolute -top-4 left-7 inline-flex items-center gap-2 bg-forest text-ivory rounded-full px-4 py-1.5 shadow-md">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ivory" />
                    <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase">
                      This is for you if…
                    </span>
                  </div>
                  <ul className="mt-3 space-y-5">
                    {FIT_YES.map((item) => (
                      <li
                        key={item.label}
                        className="grid grid-cols-[auto_1fr] gap-3.5 items-start"
                      >
                        <span
                          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest/8 text-forest"
                          aria-hidden
                        >
                          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6.5L4.5 9L10 3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          className="text-[15px] md:text-[15.5px] leading-[1.55] text-ink/82"
                          dangerouslySetInnerHTML={{ __html: item.label }}
                        />
                      </li>
                    ))}
                  </ul>
                </article>

                {/* NOT FOR YOU */}
                <article className="relative bg-ivory rounded-3xl border-2 border-ink/8 p-8 md:p-10 shadow-[0_10px_30px_-20px_rgba(17,17,17,0.18)]">
                  <div className="absolute -top-4 left-7 inline-flex items-center gap-2 bg-ink/85 text-ivory rounded-full px-4 py-1.5 shadow-md">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ivory/70" />
                    <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase">
                      This is NOT for you if…
                    </span>
                  </div>
                  <ul className="mt-3 space-y-5">
                    {FIT_NO.map((item) => (
                      <li
                        key={item}
                        className="grid grid-cols-[auto_1fr] gap-3.5 items-start"
                      >
                        <span
                          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink/8 text-ink/55"
                          aria-hidden
                        >
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M3 3L9 9M9 3L3 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span className="text-[15px] md:text-[15.5px] leading-[1.55] text-ink/70">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              {/* Inline CTA below grid */}
              <div className="mt-14 text-center">
                <CheckoutButton
                  refCode={discountActive ? refCodeRaw : undefined}
                  source={source}
                  label="Join Founders Foundation"
                  accent
                />
                <p className="mt-4 text-[12.5px] tracking-[0.18em] uppercase text-mute">
                  14-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MEET YOUR HOST — govtech 2-column style */}
        <section className="bg-bone py-20 md:py-28 grain relative overflow-hidden">
          <div className="container-page relative">
            <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 md:gap-14 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  Meet your{" "}
                  <span className="text-mute">host</span>
                </p>
                <h2 className="font-serif text-[40px] md:text-[58px] leading-[1.04] tracking-[-0.02em] text-forest mb-3">
                  Meet your{" "}
                  <BrushUnderline color="#9B7A4A">host</BrushUnderline>.
                </h2>
                <p className="font-serif text-[22px] md:text-[24px] text-forest mb-7">
                  Oge Madu —{" "}
                  <span className="text-ink/55 italic font-normal">
                    Founder, Early Founders Collective
                  </span>
                </p>
                <div className="space-y-5 text-[16px] md:text-[17px] leading-[1.7] text-ink/75 max-w-[560px]">
                  <p>
                    Over the last decade, Oge has built businesses across
                    multiple industries —{" "}
                    <span className="text-forest font-medium">
                      home services, consumer products, finance, real estate,
                      and community organizations
                    </span>
                    .
                  </p>
                  <p>Along the way, he learned something important:</p>
                  <p className="font-serif text-[19px] md:text-[21px] text-forest italic leading-[1.5] border-l-2 border-brass/60 pl-5">
                    Successful businesses often look completely different on
                    the surface, but they usually have the same foundation.
                  </p>
                  <p>
                    Founders Foundation is the roadmap he wishes he had when
                    he started.
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                <div
                  className="absolute -inset-5 bg-brass/15 rounded-3xl blur-2xl"
                  aria-hidden
                />
                <Image
                  src="/media/speaking.jpg"
                  alt="Oge Madu speaking"
                  width={620}
                  height={760}
                  className="relative rounded-2xl object-cover w-full shadow-[0_40px_90px_-40px_rgba(35,53,45,0.55)]"
                  style={{ aspectRatio: "4/5", maxHeight: "640px" }}
                />
                {/* Decorative tag */}
                <div className="hidden md:block absolute bottom-6 -left-6 bg-ivory rounded-2xl px-5 py-4 shadow-card border border-line/60">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brass mb-1">
                    Building since
                  </p>
                  <p className="font-serif text-[24px] text-forest leading-none tabular-nums">
                    2014
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AFTER GRADUATION */}
        <section className="bg-ivory py-20 md:py-28 relative">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-10">
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass mb-4">
                  After graduation
                </p>
                <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.06] tracking-[-0.02em] text-forest">
                  Graduation isn't the end.
                </h2>
                <p className="mt-3 font-serif italic text-[22px] md:text-[26px] text-brass leading-[1.3]">
                  It's the beginning.
                </p>
              </div>

              <div className="bg-bone rounded-3xl p-8 md:p-10 border border-line/60 max-w-[680px] mx-auto relative">
                <p className="text-[15.5px] leading-[1.7] text-ink/72 mb-6">
                  After completing Founders Foundation, graduates receive:
                </p>
                <ul className="space-y-4">
                  {AFTER_GRADUATION.map((g, i) => (
                    <li
                      key={g}
                      className="grid grid-cols-[auto_1fr] gap-4 items-start"
                    >
                      <span
                        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest text-ivory"
                        aria-hidden
                      >
                        <span className="font-serif text-[12px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span className="text-[15.5px] leading-[1.55] text-forest font-medium pt-1">
                        {g}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 pt-6 border-t border-line/60 text-[15.5px] leading-[1.7] text-ink/72">
                  Early Founders Collective is designed for founders who want
                  ongoing accountability, implementation, networking, and
                  support as they continue building their businesses.
                </p>
                <p className="mt-3 font-serif italic text-[16px] text-forest/85 leading-[1.55]">
                  Because building a business doesn't end after four weeks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-bone py-20 md:py-28 grain">
          <div className="container-page">
            <div className="max-w-[760px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.02em] text-forest">
                  FAQ
                </h2>
              </div>
              <FAQAccordion
                items={[
                  {
                    q: "When does the next cohort start?",
                    a: cohortDate
                      ? `The next cohort begins ${cohortDate}.`
                      : "The next cohort opens soon. Reserve your seat and we'll email you the start date.",
                  },
                  {
                    q: "What if I miss a session?",
                    a: "Every session is recorded and available to participants.",
                  },
                  {
                    q: "Do I keep access to the toolkit?",
                    a: "Yes. You'll retain access to the Business Builder Toolkit after the program ends.",
                  },
                  {
                    q: "How much time should I expect to commit?",
                    a: "Plan for approximately 4-6 hours per week, including live sessions and implementation.",
                  },
                  {
                    q: "Will this work for my type of business?",
                    a: "Founders Foundation is designed around business fundamentals that apply across industries. The businesses may be different. The foundation is often the same.",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-forest text-ivory py-24 md:py-32 relative overflow-hidden">
          <HeroGradientField />
          <div className="container-page relative">
            <div className="max-w-[760px] mx-auto text-center">
              <h2 className="font-serif text-[40px] md:text-[60px] leading-[1.04] tracking-[-0.022em] text-ivory">
                You already have the{" "}
                <BrushUnderline color="#9B7A4A">skill.</BrushUnderline>
              </h2>
              <p
                className="mt-5 font-serif italic text-brass text-[26px] md:text-[34px] leading-[1.2]"
                style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
              >
                Now it's time to build the business.
              </p>
              <p className="mt-8 text-[16px] md:text-[18px] leading-[1.7] text-ivory/78 max-w-[580px] mx-auto">
                Join Founders Foundation and spend the next four weeks building
                something you're proud to put your name on.
              </p>
              <div className="mt-10">
                <CheckoutButton
                  refCode={discountActive ? refCodeRaw : undefined}
                  source={source}
                  label="Join Founders Foundation"
                  accent
                />
                <div className="mt-6 inline-flex items-baseline gap-3 flex-wrap justify-center">
                  <span className="text-[12px] font-semibold tracking-[0.22em] uppercase text-ivory/55">
                    Investment
                  </span>
                  <span className="font-serif text-[22px] text-ivory/45 line-through tabular-nums">
                    {originalLabel}
                  </span>
                  <span className="font-serif text-[28px] text-brass tabular-nums">
                    {priceLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const LEAVE_WITH = [
  "A clear offer you can confidently explain",
  "Pricing that makes sense for your market",
  "A professional business foundation",
  "A customer acquisition plan",
  "A 90-day roadmap for growth",
  "A community of founders building alongside you",
];

const NUM = ["One", "Two", "Three", "Four"];

const FOUNDATIONS: {
  title: string;
  variant: "clarity" | "structure" | "customers" | "growth";
  lead: string;
  body?: string;
  list?: string[];
}[] = [
  {
    title: "Clarity",
    variant: "clarity",
    lead: "Know exactly what you sell, who it's for, and why someone should choose you.",
    body: "By the end of week one, you'll be able to clearly explain your business and confidently communicate the value you provide.",
  },
  {
    title: "Structure",
    variant: "structure",
    lead: "Build the foundation that makes your business legitimate.",
    list: ["Business setup", "Pricing", "Systems", "Processes"],
    body: "The pieces most people skip until they become problems.",
  },
  {
    title: "Customers",
    variant: "customers",
    lead: "Learn how to generate conversations, referrals, and opportunities.",
    body: "You'll identify the people most likely to buy from you and create a practical plan for getting in front of them. No complicated funnels. No expensive ads. Just focused action.",
  },
  {
    title: "Growth",
    variant: "growth",
    lead: "Build your 90-day roadmap.",
    body: "Know what to focus on. Know what to ignore. Know what actions move your business forward. Leave with a clear plan instead of more uncertainty.",
  },
];

const INCLUDED: {
  title: string;
  icon: "calls" | "toolkit" | "recordings" | "office" | "community";
  body?: string;
  list?: string[];
  foot?: string;
}[] = [
  {
    title: "Four Live Implementation Sessions",
    icon: "calls",
    body: "Build alongside other founders in a structured environment focused on execution, feedback, and progress.",
  },
  {
    title: "Business Builder Toolkit",
    icon: "toolkit",
    body: "Everything you'll need to build your foundation:",
    list: [
      "Templates",
      "Worksheets",
      "Business planning resources",
      "Pricing frameworks",
      "Customer acquisition exercises",
      "AI prompts",
      "Launch checklists",
    ],
  },
  {
    title: "Session Recordings",
    icon: "recordings",
    body: "Miss a session? Every call is recorded so you can revisit the material and continue making progress.",
  },
  {
    title: "Office Hours",
    icon: "office",
    body: "Additional opportunities to ask questions, get feedback, and work through roadblocks.",
  },
  {
    title: "Founder Community",
    icon: "community",
    body: "Build relationships with other people who are actively working on their businesses.",
    foot: "Because entrepreneurship is hard enough without doing it alone.",
  },
];

const FIT_YES = [
  {
    label:
      "You've been <strong class='text-forest'>paid for a skill</strong>, service, or expertise.",
  },
  {
    label:
      "You have a <strong class='text-forest'>business idea you're serious about</strong> pursuing.",
  },
  {
    label:
      "You're ready to stop treating your side hustle <strong class='text-forest'>like a hobby</strong>.",
  },
  {
    label:
      "You want <strong class='text-forest'>structure, accountability, and direction</strong>.",
  },
  {
    label:
      "You can commit <strong class='text-forest'>4-6 hours per week</strong> for four weeks.",
  },
];

const FIT_NO = [
  "People looking for overnight success.",
  "People unwilling to take action.",
  "People who want to passively watch videos.",
  "Established businesses already operating at an advanced level.",
];

const AFTER_GRADUATION = [
  "Founders Foundation Certificate of Completion",
  "Alumni Network Access",
  "Invitation to join Early Founders Collective",
];

function IncludedIcon({
  variant,
}: {
  variant: "calls" | "toolkit" | "recordings" | "office" | "community";
}) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  if (variant === "calls") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 10L21 8V16L17 14V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === "toolkit") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "recordings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
      </svg>
    );
  }
  if (variant === "office") {
    return (
      <svg {...common}>
        <path
          d="M4 18V8C4 6.9 4.9 6 6 6H18C19.1 6 20 6.9 20 8V14C20 15.1 19.1 16 18 16H10L4 18Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // community
  return (
    <svg {...common}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 19C 3 14, 15 14, 15 19"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M14 18C 14 14, 22 14, 22 18"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
