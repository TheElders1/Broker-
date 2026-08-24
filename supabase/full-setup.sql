-- Genesis Pro LTD — full Supabase setup (idempotent)
--
-- This single script combines supabase/schema.sql and
-- supabase/migrations/002_profile_details.sql. It is safe to run on:
--   (a) a brand-new Supabase project, or
--   (b) this project's existing database, which already has schema.sql
--       applied — every statement below only creates something if it
--       doesn't already exist, so re-running it changes nothing that's
--       already there.
--
-- Run it once in Supabase → SQL Editor → New query.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================

do $$ begin
  create type account_type as enum ('Basic', 'Professional', 'Premium');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type kyc_status as enum ('not_started', 'pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type account_request_status as enum ('pending', 'processed', 'dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type crypto_asset as enum ('BTC', 'USDT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type crypto_network as enum ('Bitcoin', 'TRC20', 'ERC20', 'BEP20');
exception when duplicate_object then null; end $$;

do $$ begin
  create type crypto_tx_status as enum ('pending', 'confirming', 'confirmed', 'completed', 'failed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_type as enum ('Deposit', 'Withdrawal', 'Trade Settlement', 'Transfer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_status as enum ('pending', 'confirming', 'confirmed', 'completed', 'failed', 'cancelled', 'settled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type position_side as enum ('Buy', 'Sell');
exception when duplicate_object then null; end $$;

do $$ begin
  create type support_ticket_status as enum ('open', 'pending', 'resolved');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- profiles — 1:1 extension of auth.users
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  account_type account_type not null default 'Basic',
  status user_status not null default 'active',
  kyc_status kyc_status not null default 'not_started',
  balance_usd numeric(18, 2) not null default 0,
  created_at timestamptz not null default now(),
  date_of_birth date,
  phone text,
  address text,
  city text,
  postal_code text,
  country text,
  currency text,
  experience text
);

-- If profiles already existed from schema.sql without the detail columns
-- (migration 002), this adds whatever is still missing.
alter table public.profiles
  add column if not exists date_of_birth date,
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists postal_code text,
  add column if not exists country text,
  add column if not exists currency text,
  add column if not exists experience text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, first_name, last_name, email, account_type,
    date_of_birth, phone, address, city, postal_code, country, currency, experience
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'account_type', ''), 'Basic')::account_type,
    nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'address', ''),
    nullif(new.raw_user_meta_data ->> 'city', ''),
    nullif(new.raw_user_meta_data ->> 'postal_code', ''),
    nullif(new.raw_user_meta_data ->> 'country', ''),
    nullif(new.raw_user_meta_data ->> 'currency', ''),
    nullif(new.raw_user_meta_data ->> 'experience', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- account_requests — legacy public "Open Account" queue
-- ============================================================================
-- No longer written to by the app (Open Account now signs a real account up
-- directly — see profiles above), but kept for the admin's manual-entry path
-- and any historical rows. Safe to leave in place either way.

create table if not exists public.account_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  country text not null,
  account_type text not null,
  currency text not null,
  experience text not null,
  status account_request_status not null default 'pending',
  submitted_at timestamptz not null default now()
);

-- ============================================================================
-- wallet_balances — one row per user per asset (BTC / USDT / USD)
-- ============================================================================

create table if not exists public.wallet_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset text not null,
  total numeric(24, 8) not null default 0,
  available numeric(24, 8) not null default 0,
  pending numeric(24, 8) not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, asset)
);

-- ============================================================================
-- deposit_addresses — BTC/USDT receive addresses (VPS wallet service fills these in)
-- ============================================================================

create table if not exists public.deposit_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset crypto_asset not null,
  network crypto_network not null,
  address text not null,
  assigned_at timestamptz not null default now(),
  unique (user_id, asset, network)
);

-- ============================================================================
-- crypto_deposits / crypto_withdrawals — unified BTC + USDT history
-- ============================================================================

create table if not exists public.crypto_deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset crypto_asset not null,
  network crypto_network,
  amount numeric(24, 8) not null,
  status crypto_tx_status not null default 'pending',
  confirmations int not null default 0,
  confirmations_required int not null default 2,
  tx_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.crypto_withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset crypto_asset not null,
  network crypto_network,
  destination_address text not null,
  amount numeric(24, 8) not null,
  network_fee numeric(24, 8) not null default 0,
  status crypto_tx_status not null default 'pending',
  tx_id text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- transactions — unified ledger feed shown in the dashboard
-- ============================================================================

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type transaction_type not null,
  asset text not null,
  amount numeric(24, 8) not null,
  status transaction_status not null,
  tx_id text,
  occurred_at timestamptz not null default now()
);

-- ============================================================================
-- positions — open trading positions (trading engine writes here)
-- ============================================================================

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null,
  side position_side not null,
  size numeric(18, 4) not null,
  entry_price numeric(18, 6) not null,
  current_price numeric(18, 6) not null,
  pl numeric(18, 2) not null default 0,
  opened_at timestamptz not null default now()
);

-- ============================================================================
-- notifications / support_tickets
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  status support_ticket_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index if not exists wallet_balances_user_id_idx on public.wallet_balances (user_id);
create index if not exists deposit_addresses_user_id_idx on public.deposit_addresses (user_id);
create index if not exists crypto_deposits_user_id_created_idx on public.crypto_deposits (user_id, created_at desc);
create index if not exists crypto_withdrawals_user_id_created_idx on public.crypto_withdrawals (user_id, created_at desc);
create index if not exists transactions_user_id_occurred_idx on public.transactions (user_id, occurred_at desc);
create index if not exists positions_user_id_idx on public.positions (user_id);
create index if not exists notifications_user_id_created_idx on public.notifications (user_id, created_at desc);
create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);
create index if not exists account_requests_status_submitted_idx on public.account_requests (status, submitted_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Every table below is only ever readable/writable by its owning user
-- through the publishable key. Balances, deposits, withdrawal status,
-- and admin actions on account_requests are NOT client-writable — those
-- go through server-only routes (app/api/admin/*) using
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely. Never expose
-- that key to the browser.

alter table public.profiles enable row level security;
alter table public.account_requests enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.deposit_addresses enable row level security;
alter table public.crypto_deposits enable row level security;
alter table public.crypto_withdrawals enable row level security;
alter table public.transactions enable row level security;
alter table public.positions enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "account_requests_public_insert" on public.account_requests;
create policy "account_requests_public_insert" on public.account_requests
  for insert with check (true);

drop policy if exists "wallet_balances_select_own" on public.wallet_balances;
create policy "wallet_balances_select_own" on public.wallet_balances
  for select using (auth.uid() = user_id);

drop policy if exists "deposit_addresses_select_own" on public.deposit_addresses;
create policy "deposit_addresses_select_own" on public.deposit_addresses
  for select using (auth.uid() = user_id);

drop policy if exists "crypto_deposits_select_own" on public.crypto_deposits;
create policy "crypto_deposits_select_own" on public.crypto_deposits
  for select using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "positions_select_own" on public.positions;
create policy "positions_select_own" on public.positions
  for select using (auth.uid() = user_id);

drop policy if exists "crypto_withdrawals_select_own" on public.crypto_withdrawals;
create policy "crypto_withdrawals_select_own" on public.crypto_withdrawals
  for select using (auth.uid() = user_id);

drop policy if exists "crypto_withdrawals_insert_own" on public.crypto_withdrawals;
create policy "crypto_withdrawals_insert_own" on public.crypto_withdrawals
  for insert with check (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

drop policy if exists "support_tickets_select_own" on public.support_tickets;
create policy "support_tickets_select_own" on public.support_tickets
  for select using (auth.uid() = user_id);

drop policy if exists "support_tickets_insert_own" on public.support_tickets;
create policy "support_tickets_insert_own" on public.support_tickets
  for insert with check (auth.uid() = user_id);

-- ============================================================================
-- Optional: wipe every account (danger — irreversible)
-- ============================================================================
-- Nothing above creates any account — this app has never had network
-- access to your Supabase project (see the accompanying message), so
-- there are no "default" accounts to clear out. If you've been testing
-- signups yourself and want a clean slate before going live, uncomment
-- and run this separately (not as part of the setup above):
--
-- delete from auth.users;
-- -- profiles and everything referencing it cascade-delete automatically.
