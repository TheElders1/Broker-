/**
 * Whether Supabase is configured for this deployment. Independent of
 * IS_DEMO_MODE (lib/api/config.ts) — that flag governs the VPS-backend
 * services (markets, trading, wallet/crypto) which are still pending the
 * VPS/Bitcoin backend connection. Auth, client profiles, and admin user
 * management go live against Supabase as soon as these env vars are set,
 * regardless of whether the VPS is connected yet.
 */
export const IS_SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
