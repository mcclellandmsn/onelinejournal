import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";

export function AuthScreen() {
  const { signInWithPassword, signUpWithPassword, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setNotice(null);

    if (mode === "signUp") {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    setPending(true);
    try {
      if (mode === "signIn") {
        await signInWithPassword(email, password);
      } else {
        const err = await signUpWithPassword(email, password);
        if (!err) {
          setNotice("Account created. Check your email to verify your address, then come back and sign in.");
        }
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-paper-dark bg-white/90 p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-ink text-center">
          One line a day
        </h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Sign in with your Supabase account (email + password).
        </p>

        <div
          className="mt-6 flex rounded-lg border border-paper-dark p-0.5 bg-paper-dark/20"
          role="tablist"
          aria-label="Account mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signIn"}
            aria-label="Show sign-in form"
            onClick={() => {
              setMode("signIn");
              clearAuthError();
              setLocalError(null);
              setNotice(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "signIn"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signUp"}
            aria-label="Show sign-up form"
            onClick={() => {
              setMode("signUp");
              clearAuthError();
              setLocalError(null);
              setNotice(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "signUp"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink-muted">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-paper-dark bg-white px-3 py-2.5 text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink-muted">Password</span>
            <input
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-paper-dark bg-white px-3 py-2.5 text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </label>

          {mode === "signUp" ? (
            <label className="block">
              <span className="text-sm font-medium text-ink-muted">Confirm password</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-paper-dark bg-white px-3 py-2.5 text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </label>
          ) : null}

          {notice ? (
            <p className="text-sm text-ink bg-paper-dark/25 border border-paper-dark rounded-lg px-3 py-2">
              {notice}
            </p>
          ) : null}

          {localError ? (
            <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {localError}
            </p>
          ) : null}

          {authError ? (
            <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {authError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            aria-label={mode === "signIn" ? "Submit sign in" : "Submit registration"}
            className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-paper shadow-sm hover:bg-accent-light disabled:opacity-60"
          >
            {pending ? "Please wait…" : mode === "signIn" ? "Sign in" : "Create account"}
          </button>
        </form>

        {mode === "signUp" ? (
          <p className="mt-4 text-xs text-ink-muted text-center">
            If your project requires email confirmation, check your inbox after signing up.
          </p>
        ) : null}
      </div>
    </div>
  );
}
