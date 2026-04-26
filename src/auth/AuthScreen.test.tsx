import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthScreen } from "./AuthScreen";

const signInWithPassword = vi.fn();
const signUpWithPassword = vi.fn();
const clearAuthError = vi.fn();

vi.mock("./AuthProvider", () => ({
  useAuth: () => ({
    signInWithPassword,
    signUpWithPassword,
    authError: null,
    clearAuthError,
  }),
}));

describe("AuthScreen", () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    signUpWithPassword.mockReset();
    clearAuthError.mockReset();
  });

  it("submits sign-in credentials", async () => {
    const user = userEvent.setup();
    signInWithPassword.mockResolvedValue(undefined);
    render(<AuthScreen />);

    await user.type(screen.getByLabelText("Email"), "you@example.com");
    await user.type(screen.getByLabelText("Password"), "secret12");
    await user.click(screen.getByRole("button", { name: "Submit sign in" }));

    expect(clearAuthError).toHaveBeenCalled();
    expect(signInWithPassword).toHaveBeenCalledWith("you@example.com", "secret12");
    expect(signUpWithPassword).not.toHaveBeenCalled();
  });

  it("submits sign-up credentials", async () => {
    const user = userEvent.setup();
    signUpWithPassword.mockResolvedValue(undefined);
    render(<AuthScreen />);

    await user.click(screen.getByRole("tab", { name: "Show sign-up form" }));
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "newpass1");
    await user.click(screen.getByRole("button", { name: "Submit registration" }));

    expect(signUpWithPassword).toHaveBeenCalledWith("new@example.com", "newpass1");
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});
