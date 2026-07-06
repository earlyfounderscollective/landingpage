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

-- ────────────────────────────────────────────────────────────────────────
-- The Plan: guided business builder
-- ────────────────────────────────────────────────────────────────────────

create table if not exists public.plan_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  name text,
  title text not null default 'My Plan',
  status text not null default 'active',
  last_active_at timestamp with time zone not null default now(),
  last_module_slug text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- One project per email for now (until auth lands).
create unique index if not exists plan_projects_email_idx
  on public.plan_projects (email);

create index if not exists plan_projects_last_active_idx
  on public.plan_projects (last_active_at);

create table if not exists public.plan_modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_desc text,
  sequence_order int not null,
  question_count int not null default 0,
  task_count int not null default 0
);

create table if not exists public.plan_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.plan_projects(id) on delete cascade,
  module_slug text not null,
  field_key text not null,
  field_value jsonb,
  version int not null default 1,
  updated_at timestamp with time zone not null default now(),
  unique (project_id, module_slug, field_key)
);

create index if not exists plan_responses_project_idx
  on public.plan_responses (project_id);

create table if not exists public.plan_progress (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.plan_projects(id) on delete cascade,
  module_slug text not null,
  questions_done int not null default 0,
  tasks_done int not null default 0,
  is_completed boolean not null default false,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  unique (project_id, module_slug)
);

-- Tracks which re-engagement drip we've sent so we don't double-send.
create table if not exists public.plan_email_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.plan_projects(id) on delete cascade,
  kind text not null,  -- 'welcome' | 'inactive_24h' | 'inactive_72h' | 'inactive_7d' | 'module_complete'
  module_slug text,
  sent_at timestamp with time zone not null default now()
);

create index if not exists plan_email_log_project_idx
  on public.plan_email_log (project_id);
create index if not exists plan_email_log_kind_idx
  on public.plan_email_log (kind);

alter table public.plan_projects enable row level security;
alter table public.plan_responses enable row level security;
alter table public.plan_progress enable row level security;
alter table public.plan_email_log enable row level security;

-- Service role bypasses RLS. Add policies later when client-side auth lands.

-- Migrations for existing installs:
-- alter table public.plan_projects add column if not exists name text;
-- alter table public.plan_projects add column if not exists last_active_at timestamp with time zone not null default now();
-- alter table public.plan_projects add column if not exists last_module_slug text;
-- alter table public.plan_projects alter column user_id drop not null;
-- create unique index if not exists plan_projects_email_idx on public.plan_projects (email);

-- ────────────────────────────────────────────────────────────────────────
-- Post-webinar survey: learn what landed so the training + offers improve
-- ────────────────────────────────────────────────────────────────────────

create table if not exists public.training_survey_responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid,                    -- which training_event this feedback is for
  email text,                       -- optional; ties back to registration
  full_name text,
  rating int,                       -- overall, 1-5
  most_valuable text,               -- what landed
  confusing text,                   -- what to cut / fix
  wish_covered text,                -- content gaps
  kit_likelihood int,               -- intent to buy the kit, 1-5
  cohort_likelihood int,            -- intent to join the cohort, 1-5
  barrier text,                     -- what's holding them back from buying
  other text,
  source text,
  created_at timestamp with time zone not null default now()
);

create index if not exists training_survey_event_idx
  on public.training_survey_responses (event_id);
create index if not exists training_survey_created_idx
  on public.training_survey_responses (created_at desc);

alter table public.training_survey_responses enable row level security;
-- Service role bypasses RLS; the API writes with the service key.
