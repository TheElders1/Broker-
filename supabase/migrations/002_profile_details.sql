-- Genesis Pro LTD — migration 002: profile detail fields + self-registration
--
-- The public Open Account form now creates a real, immediately-usable
-- account (supabase.auth.signUp) instead of only queuing a request for an
-- admin to review. This adds the fields it collects to `profiles` and
-- extends the on_auth_user_created trigger to populate them straight from
-- signUp's metadata — which is captured immediately regardless of whether
-- your project requires email confirmation, so the account request's full
-- details always land in the admin dashboard, password excluded, without
-- needing a second authenticated write back to profiles.
--
-- Run this once in the Supabase SQL Editor, after schema.sql.
-- Safe to run once on a project that already has schema.sql applied.

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

-- IMPORTANT — a code change alone cannot skip email verification: in the
-- Supabase dashboard, go to Authentication > Sign In / Providers > Email
-- and turn OFF "Confirm email". With it on, signUp() still creates the
-- account but withholds a session (and therefore dashboard access) until
-- the confirmation link is clicked, regardless of what this app sends.
