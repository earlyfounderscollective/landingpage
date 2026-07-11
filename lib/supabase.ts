import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;
  cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Never let Next.js cache DB reads. This is admin/server data (funnel
      // state, orders, registrations, progress) that must always be fresh —
      // otherwise edits look "stuck" until a redeploy. Fixes the whole class
      // of stale-data bugs in one place instead of per-page.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
  return cached;
}
