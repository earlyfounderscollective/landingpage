import { z } from "zod";

export const stageOptions = [
  "Idea",
  "Validating",
  "First customers",
  "Early revenue",
  "Scaling",
] as const;

export const participationOptions = ["Yes", "No"] as const;

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please share your full name").max(120),
  email: z.string().trim().email("A valid email is required"),
  phone: z
    .string()
    .trim()
    .min(7, "A reachable phone number is required")
    .max(40),
  city: z.string().trim().min(2, "City is required").max(120),
  socialLink: z
    .string()
    .trim()
    .min(3, "A social or web link helps us learn about you")
    .max(300),
  currentBuild: z
    .string()
    .trim()
    .min(20, "Tell us a bit more about what you're building (20+ characters)")
    .max(2000),
  stage: z.enum(stageOptions, {
    errorMap: () => ({ message: "Select your current stage" }),
  }),
  executionChallenge: z
    .string()
    .trim()
    .min(20, "Share a bit more on what's slowed you down (20+ characters)")
    .max(2000),
  progressGoal: z
    .string()
    .trim()
    .min(20, "Share what meaningful progress looks like (20+ characters)")
    .max(2000),
  whyJoin: z
    .string()
    .trim()
    .min(20, "Help us understand the why (20+ characters)")
    .max(2000),
  participateWeekly: z.enum(participationOptions, {
    errorMap: () => ({ message: "Let us know if you can participate consistently" }),
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
