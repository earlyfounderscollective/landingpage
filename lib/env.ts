function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  supabaseUrl: optional("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: optional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),

  resendApiKey: optional("RESEND_API_KEY"),
  resendFromEmail: optional("RESEND_FROM_EMAIL") ?? "contact@earlyfounderscollective.com",
  adminEmail: optional("ADMIN_NOTIFICATION_EMAIL") ?? "ogemadu8@gmail.com",

  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  stripePriceId: optional("NEXT_PUBLIC_STRIPE_PRICE_ID"),

  siteUrl: optional("NEXT_PUBLIC_SITE_URL") ?? "https://earlyfounderscollective.com",

  // Used to sign the one-click "Accept / Decline / Waitlist" buttons inside
  // the admin notification email. Set to any long random string in production.
  adminActionSecret:
    optional("ADMIN_ACTION_SECRET") ?? "dev-only-change-me-in-production",

  // Verifies Vercel cron requests for /api/cron/plan-drips. Without it, the
  // route refuses to run (fail loud rather than silently send to everyone).
  cronSecret: optional("CRON_SECRET"),

  // Password for the /admin/* pages. Set in Vercel env. If unset, admin
  // routes refuse to log anyone in.
  adminPassword: optional("ADMIN_PASSWORD"),
};
