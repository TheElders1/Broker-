import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser-side Supabase client for use inside "use client" components.
 * Uses the publishable (anon) key only — safe to ship to the browser,
 * RLS policies (see supabase/schema.sql) decide what it can read or write.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
