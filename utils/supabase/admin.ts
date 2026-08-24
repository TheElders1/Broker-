import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 * Import this ONLY inside app/api/admin/* Route Handlers, after verifying
 * the caller holds a valid admin session (see lib/adminAuth.ts). Never
 * import it into a "use client" component or any code that ships to the
 * browser — the `server-only` import above makes that a build error if it
 * ever happens by mistake.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
