import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  sendDiscoveryApplicantConfirmation,
  sendDiscoveryAdminNotification,
  type DiscoveryInput,
} from "@/lib/discovery-email";

export const runtime = "nodejs";

const SERVICES = new Set([
  "Business Mentorship",
  "Business Growth Audit",
  "Brand Strategy",
  "Brand Identity",
  "Brand Management",
  "Social Media Strategy",
  "Shopify Website or Funnel",
  "Social Media Automation",
]);

const TIMINGS = new Set(["Right Now", "Next 2 Weeks"]);
const TYPES = new Set([
  "Service Business",
  "Product / Ecommerce",
  "Community-Based Business",
  "Creator / Personal Brand",
  "Real Estate",
  "Fitness / Wellness",
  "Restaurant / Hospitality",
  "Technology / SaaS",
  "Other",
]);
const AGES = new Set([
  "Idea Stage",
  "Less Than 6 Months",
  "6–12 Months",
  "1–3 Years",
  "3–5 Years",
  "5+ Years",
]);
const REVENUES = new Set([
  "Pre-Revenue",
  "$0–$5,000",
  "$5,000–$10,000",
  "$10,000–$25,000",
  "$25,000–$50,000",
  "$50,000–$100,000",
  "$100,000+",
]);

function trim(v: unknown, max = 2000): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (typeof body._gotcha === "string" && body._gotcha.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const fullName = trim(body.fullName, 200);
  const email = trim(body.email, 320).toLowerCase();
  const phone = trim(body.phone, 60);
  const businessName = trim(body.businessName, 200);
  const servicesRaw = Array.isArray(body.servicesInterested)
    ? body.servicesInterested
    : [];
  const servicesInterested = servicesRaw
    .map((s) => String(s ?? "").trim())
    .filter((s) => SERVICES.has(s));
  const socialsRaw =
    body.socials && typeof body.socials === "object"
      ? (body.socials as Record<string, unknown>)
      : {};
  const socials: Record<string, string> = {};
  for (const key of [
    "Instagram",
    "Facebook",
    "LinkedIn",
    "TikTok",
    "Twitter / X",
    "Other",
  ]) {
    const v = trim(socialsRaw[key], 400);
    if (v) socials[key] = v;
  }
  const website = trim(body.website, 400);
  const startTiming = trim(body.startTiming, 60);
  const businessType = trim(body.businessType, 60);
  const businessAge = trim(body.businessAge, 60);
  const monthlyRevenue = trim(body.monthlyRevenue, 60);
  const biggestBottleneck = trim(body.biggestBottleneck, 4000);
  const triedSolutions = trim(body.triedSolutions, 4000);
  const whatsWorking = trim(body.whatsWorking, 4000);
  const ninetyDayGoal = trim(body.ninetyDayGoal, 4000);
  const whyThisCall = trim(body.whyThisCall, 4000);
  const additionalQuestions = trim(body.additionalQuestions, 4000);
  const consent = body.consent === true;

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Required";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Valid email required";
  if (!phone || phone.replace(/\D/g, "").length < 7) errors.phone = "Required";
  if (!businessName) errors.businessName = "Required";
  if (servicesInterested.length === 0)
    errors.servicesInterested = "Select at least one";
  if (!TIMINGS.has(startTiming)) errors.startTiming = "Required";
  if (!TYPES.has(businessType)) errors.businessType = "Required";
  if (!AGES.has(businessAge)) errors.businessAge = "Required";
  if (!REVENUES.has(monthlyRevenue)) errors.monthlyRevenue = "Required";
  if (!biggestBottleneck) errors.biggestBottleneck = "Required";
  if (!consent) errors.consent = "Required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  let id: string | undefined;
  if (supabase) {
    const { data, error } = await supabase
      .from("discovery_applications")
      .insert({
        full_name: fullName,
        email,
        phone,
        business_name: businessName,
        services_interested: servicesInterested,
        socials,
        website: website || null,
        start_timing: startTiming,
        business_type: businessType,
        business_age: businessAge,
        monthly_revenue: monthlyRevenue,
        biggest_bottleneck: biggestBottleneck,
        tried_solutions: triedSolutions || null,
        whats_working: whatsWorking || null,
        ninety_day_goal: ninetyDayGoal || null,
        why_this_call: whyThisCall || null,
        additional_questions: additionalQuestions || null,
        consent: true,
      })
      .select("id")
      .single();
    if (error) {
      console.error("discovery_applications insert failed:", error);
    } else {
      id = data?.id;
    }
  }

  const input: DiscoveryInput = {
    fullName,
    email,
    phone,
    businessName,
    servicesInterested,
    socials,
    website,
    startTiming,
    businessType,
    businessAge,
    monthlyRevenue,
    biggestBottleneck,
    triedSolutions,
    whatsWorking,
    ninetyDayGoal,
    whyThisCall,
    additionalQuestions,
  };

  try {
    await Promise.allSettled([
      sendDiscoveryApplicantConfirmation(input),
      sendDiscoveryAdminNotification(input, id),
    ]);
  } catch (err) {
    console.error("Discovery emails failed (non-blocking):", err);
  }

  return NextResponse.json({ ok: true, id });
}
