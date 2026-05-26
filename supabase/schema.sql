-- Early Founders Collective — applications schema
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  city text,
  social_link text,
  current_build text,
  stage text,
  execution_challenge text,
  progress_goal text,
  why_join text,
  participate_weekly text,
  status text not null default 'pending',
  stripe_customer_id text,
  paid boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- For existing installs migrating from older field names, run these once:
-- alter table public.applications add column if not exists progress_goal text;
-- update public.applications set progress_goal = coalesce(progress_goal, six_month_progress);
-- alter table public.applications drop column if exists six_month_progress;
-- alter table public.applications drop column if exists weekly_commitment;
-- alter table public.applications drop column if exists value_bring;

create index if not exists applications_email_idx on public.applications (email);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_created_at_idx on public.applications (created_at desc);

alter table public.applications enable row level security;

-- Service role bypasses RLS, so no public policies are needed.
-- Add policies only if you intend to read from the client.
