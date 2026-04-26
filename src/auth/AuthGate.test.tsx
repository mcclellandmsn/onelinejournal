import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "./AuthGate";

const mockUseAuth = vi.fn();

vi.mock("./AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("./AuthScreen", () => ({
  AuthScreen: () => <div data-testid="auth-screen">Auth screen</div>,
}));

function baseAuth() {
  return {
    configured: true,
    loading: false,
    session: null as unknown,
    user: null,
    authError: null,
    clearAuthError: vi.fn(),
    signInWithPassword: vi.fn(),
    signUpWithPassword: vi.fn(),
    signOut: vi.fn(),
  };
}

describe("AuthGate", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("prompts to configure Supabase when auth is not configured", () => {
    mockUseAuth.mockReturnValue({ ...baseAuth(), configured: false });
    render(
      <AuthGate>
        <span>App</span>
      </AuthGate>,
    );
    expect(screen.getByRole("heading", { name: "Connect Supabase" })).toBeInTheDocument();
    expect(screen.queryByText("App")).not.toBeInTheDocument();
  });

  it("shows a loading state while the session is loading", () => {
    mockUseAuth.mockReturnValue({ ...baseAuth(), loading: true });
    render(
      <AuthGate>
        <span>App</span>
      </AuthGate>,
    );
    expect(screen.getByText("Loading session…")).toBeInTheDocument();
  });

  it("renders the auth screen when there is no session", () => {
    mockUseAuth.mockReturnValue({ ...baseAuth(), session: null });
    render(
      <AuthGate>
        <span>App</span>
      </AuthGate>,
    );
    expect(screen.getByTestId("auth-screen")).toBeInTheDocument();
  });

  it("renders children when a session exists", () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth(),
      session: { access_token: "token" },
      user: { id: "u1" },
    });
    render(
      <AuthGate>
        <span>App</span>
      </AuthGate>,
    );
    expect(screen.getByText("App")).toBeInTheDocument();
  });
});
