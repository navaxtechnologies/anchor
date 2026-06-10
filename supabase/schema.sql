-- ANCHOR — Supabase Postgres schema (target for M1). RLS-first.
-- Public-read tables power the no-login crisis flow; per-user tables are locked to auth.uid().

-- ---------- Reference / public-read data ----------
create table if not exists resources (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  address text not null,
  phone text not null,
  hours text not null,
  eligibility text not null,
  languages text[] not null default '{}',
  estimated_wait text not null,
  website text,
  application_url text,
  lat double precision,
  lng double precision,
  city text not null default 'San Antonio',
  verified_at timestamptz
);

create table if not exists crisis_categories (
  id text primary key,
  key text not null unique,
  urgency text not null check (urgency in ('emergency','urgent','support')),
  actions jsonb not null default '[]'
);

-- ---------- Per-user data ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'en' check (language in ('en','es')),
  simple_mode boolean not null default false,
  tier text not null default 'free' check (tier in ('free','plus','pro','community')),
  remember_context boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  storage_path text not null,            -- ciphertext handle; server never sees plaintext
  mime_type text not null,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists circles (
  id text primary key,
  name text not null,
  topic text not null,
  description text not null,
  member_count int not null default 0,
  is_moderated boolean not null default true
);

create table if not exists circle_members (
  circle_id text not null references circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  mood int not null check (mood between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists advisor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  flagged_crisis boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table resources enable row level security;
alter table crisis_categories enable row level security;
alter table profiles enable row level security;
alter table documents enable row level security;
alter table circles enable row level security;
alter table circle_members enable row level security;
alter table check_ins enable row level security;
alter table advisor_messages enable row level security;
alter table subscriptions enable row level security;

-- Public read for crisis/resource data (no auth required — the trust anchor).
create policy resources_public_read on resources for select using (true);
create policy crisis_public_read on crisis_categories for select using (true);
create policy circles_public_read on circles for select using (true);

-- Per-user isolation.
create policy profiles_self on profiles using (id = auth.uid()) with check (id = auth.uid());
create policy documents_self on documents using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy checkins_self on check_ins using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy advisor_self on advisor_messages using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy members_self on circle_members using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy subs_self on subscriptions using (user_id = auth.uid()) with check (user_id = auth.uid());
