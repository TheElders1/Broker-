-- Genesis Pro LTD — Supabase schema
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- on a fresh project. It creates every table the frontend's data contract
-- (lib/api/types.ts) expects, plus Row Level Security so client accounts can
-- only ever see their own data.
--
-- This does NOT wire the app's pages to Supabase yet — that happens once the
-- VPS/Bitcoin backend is ready to write into these tables (deposit addresses,
-- confirmations, balances). Running this script just gets the database ready
-- for that connection.
--
-- Safe to run once. Re-running on a project that already has these objects
-- will error on the "create type"/"create table" statements — drop the
-- objects first (or run on a fresh project) if you need to re-apply it.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================

create type account_type as enum ('Basic', 'Professional', 'Premium');
create type user_status as enum ('active', 'suspended');
create type kyc_status as enum ('not_started', 'pending', 'verified', 'rejected');
create type account_request_status as enum ('pending', 'processed', 'dismissed');
create type crypto_asset as enum ('BTC', 'USDT');
create type crypto_network as enum ('Bitcoin', 'TRC20', 'ERC20', 'BEP20');
create type crypto_tx_status as enum ('pending', 'confirming', 'confirmed', 'completed', 'failed', 'cancelled');
create type transaction_type as enum ('Deposit', 'Withdrawal', 'Trade Settlement', 'Transfer');
create type transaction_status as enum ('pending', 'confirming', 'confirmed', 'completed', 'failed', 'cancelled', 'settled');
create type position_side as enum ('Buy', 'Sell');
create type support_ticket_status as enum ('open', 'pending', 'resolved');

-- ============================================================================
-- profiles — 1:1 extension of auth.users
-- ============================================================================
-- Client accounts are created by the admin (per the "copy details, admin
-- creates the account" flow already in the app), which means an auth.users
-- row gets created via the Supabase Admin API using the service-role key.
-- This trigger auto-creates the matching profile row whenever that happens,
-- so the admin route never has to insert into both tables by hand.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  account_type account_type not null default 'Basic',
  status user_status not null default 'active',
  kyc_status kyc_status not null default 'not_started',
  balance_usd numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- account_requests — public "Open Account" form submissions
-- ============================================================================
-- Anyone can submit one (no login required). Only the admin can read or
-- act on them, and the admin panel isn't a Supabase-authenticated role — so
-- reads/updates here must go through a server route using the service-role
-- key (see the note in the RLS section below), never the publishable key.

create table public.account_requests (
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

create table public.wallet_balances (
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
-- deposit_addresses — BTC/USDT receive addresses assigned by the VPS wallet
-- service. Empty until that backend is connected.
-- ============================================================================

create table public.deposit_addresses (
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

create table public.crypto_deposits (
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

create table public.crypto_withdrawals (
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

create table public.transactions (
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

create table public.positions (
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

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  status support_ticket_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index on public.wallet_balances (user_id);
create index on public.deposit_addresses (user_id);
create index on public.crypto_deposits (user_id, created_at desc);
create index on public.crypto_withdrawals (user_id, created_at desc);
create index on public.transactions (user_id, occurred_at desc);
create index on public.positions (user_id);
create index on public.notifications (user_id, created_at desc);
create index on public.support_tickets (user_id);
create index on public.account_requests (status, submitted_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Every table below is only ever readable/writable by its owning user
-- through the publishable key. Balances, deposits, withdrawal status,
-- and admin actions on account_requests are NOT client-writable — those
-- must go through server-only routes using SUPABASE_SERVICE_ROLE_KEY
-- (which bypasses RLS entirely), driven by the admin panel and, later,
-- the VPS/Bitcoin backend. Never expose the service-role key to the browser.

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

-- profiles: a user can read and update their own row. There is deliberately
-- no insert/delete policy — profile rows are created only by the trigger
-- above, and balance/status/account_type changes must go through the admin
-- (service-role) path, never a direct client write.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- account_requests: anyone (including logged-out visitors) can submit one.
-- No select/update/delete policy exists for anon/authenticated, so RLS
-- denies those by default — only the service-role key can read or process
-- the queue, from a server route (mirrors the current admin API routes).
create policy "account_requests_public_insert" on public.account_requests
  for insert with check (true);

-- wallet_balances / deposit_addresses / crypto_deposits / transactions /
-- positions: read-only to the owning user. All writes are server-side.
create policy "wallet_balances_select_own" on public.wallet_balances
  for select using (auth.uid() = user_id);
create policy "deposit_addresses_select_own" on public.deposit_addresses
  for select using (auth.uid() = user_id);
create policy "crypto_deposits_select_own" on public.crypto_deposits
  for select using (auth.uid() = user_id);
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "positions_select_own" on public.positions
  for select using (auth.uid() = user_id);

-- crypto_withdrawals: a user can read their own and create a withdrawal
-- request for themselves (always starts 'pending'); only the service-role
-- path may update its status once the VPS backend processes it.
create policy "crypto_withdrawals_select_own" on public.crypto_withdrawals
  for select using (auth.uid() = user_id);
create policy "crypto_withdrawals_insert_own" on public.crypto_withdrawals
  for insert with check (auth.uid() = user_id);

-- notifications: read own, and mark own as read.
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

-- support_tickets: read own, and open new ones.
create policy "support_tickets_select_own" on public.support_tickets
  for select using (auth.uid() = user_id);
create policy "support_tickets_insert_own" on public.support_tickets
  for insert with check (auth.uid() = user_id);
