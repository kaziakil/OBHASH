import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Privileged administrative Supabase client using the Service Role Key.
 *
 * CRITICAL SECURITY INVARIANT:
 * - This client BYPASSES Row Level Security (RLS).
 * - MUST NEVER be called or bundled into client-side code.
 * - Used exclusively for administrative jobs, migrations, and internal system tasks.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: createAdminSupabaseClient cannot be invoked in a browser environment."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
