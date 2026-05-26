# Early Founders Collective

Premium editorial founder collective — Next.js (App Router) + Tailwind + Supabase + Stripe + Resend.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a custom warm-ivory editorial design system
- Supabase (Postgres) for application storage
- Stripe Checkout (subscription mode) + webhook for paid status sync
- Resend for transactional email (applicant confirmation, admin notification, welcome)
- Zod + Server Actions for the application form

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

The app boots without Supabase/Stripe/Resend env vars — features that need them are skipped gracefully so the marketing site renders for local design work.

## Environment variables

See `.env.example`. All transactional email is sent from `contact@earlyfounderscollective.com`. Admin notifications go to `ogemadu8@gmail.com`.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor to create the `applications` table.

The server uses the **service role key** (not the anon key) for inserts, so RLS does not block writes.

## Stripe

- Create a recurring Price for the membership and set `NEXT_PUBLIC_STRIPE_PRICE_ID`.
- Add a webhook endpoint pointing at `/api/stripe/webhook` and subscribe to `checkout.session.completed`. Set `STRIPE_WEBHOOK_SECRET` from the dashboard.
- Calling `POST /api/checkout` creates a Checkout Session and returns `{ url }`. Pass `{ email, applicationId }` to associate the payment with an application row.

## Project structure

```
app/
  page.tsx                 Home / sales page
  apply/                   Application page + server action + form
  thank-you/               Post-submission page
  success/                 Stripe success page
  cancel/                  Stripe cancel page
  api/
    checkout/route.ts      Create Stripe Checkout Session
    stripe/webhook/route.ts  Sync paid status + send welcome email
components/site/           All page sections
lib/                       env, supabase, stripe, emails, validation
public/media/              Founder photos and videos
supabase/schema.sql        applications table
```

## Notes on assets

The hero and section images currently point at the originals copied from `~/Documents/pics`. A few of them are large (the headshot is ~23MB, the video ~10MB) — before going live, run them through an optimizer / re-encode the video to mp4 so the first paint stays fast.
