import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicSupabaseClient: SupabaseClient | null | undefined;

export function getPublicSupabaseClient(): SupabaseClient | null {
  if (publicSupabaseClient !== undefined) {
    return publicSupabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  /*
   * Supabase is optional for the public website.
   * If it is unavailable, the Header uses the coded fallback hours.
   */
  if (!supabaseUrl || !publishableKey) {
    publicSupabaseClient = null;
    return null;
  }

  publicSupabaseClient = createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  return publicSupabaseClient;
}