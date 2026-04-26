/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Set at runtime by `server.js` when serving production `index.html`. */
  __APP_SUPABASE_CONFIG__?: { url?: string; anonKey?: string };
}
