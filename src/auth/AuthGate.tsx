import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { AuthScreen } from "./AuthScreen";

function ConfigureSupabase() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-paper-dark bg-white/90 p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-ink">Connect Supabase</h1>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          Add <code className="text-ink bg-paper-dark/40 px-1 rounded">VITE_SUPABASE_URL</code> and{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to a{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">.env</code> in the project root, then restart{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">npm run dev</code>. For{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">npm start</code>, run{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">npm run build</code> again after saving{" "}
          <code className="text-ink bg-paper-dark/40 px-1 rounded">.env</code> (the server injects those values into the page).
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-ink-muted space-y-2">
          <li>
            <code className="text-ink">VITE_SUPABASE_URL</code> — Settings → API → Project URL
          </li>
          <li>
            <code className="text-ink">VITE_SUPABASE_ANON_KEY</code> — Settings → API → anon public
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-muted">
          In the Supabase dashboard, enable <strong className="text-ink">Email</strong> under Authentication → Providers, and add users or allow sign-ups as you prefer.
        </p>
      </div>
    </div>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { configured, loading, session } = useAuth();

  if (!configured) {
    return <ConfigureSupabase />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-ink-muted text-sm">Loading session…</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return children;
}
