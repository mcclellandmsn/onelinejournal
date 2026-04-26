import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readUrl(): string {
  const injected =
    typeof window !== "undefined" ? window.__APP_SUPABASE_CONFIG__?.url : undefined;
  return String(injected ?? import.meta.env.VITE_SUPABASE_URL ?? "").trim();
}

function readAnonKey(): string {
  const injected =
    typeof window !== "undefined" ? window.__APP_SUPABASE_CONFIG__?.anonKey : undefined;
  return String(injected ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
}

const url = readUrl();
const anonKey = readAnonKey();

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
