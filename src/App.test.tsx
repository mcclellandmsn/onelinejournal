import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("./auth/AuthProvider", () => ({
  useAuth: () => ({
    user: { email: "reader@example.com" },
    signOut: vi.fn(),
  }),
}));

/** Noon on a calendar day in the **local** TZ so `formatDateKey` matches YYYY-MM-DD on every machine. */
function localNoon(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day, 12, 0, 0);
}

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(localNoon(2024, 5, 15));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("shows the signed-in email", () => {
    render(<App />);
    expect(screen.getByText("reader@example.com")).toBeInTheDocument();
  });

  it("moves the selected day with navigation controls", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dateInput = screen.getByLabelText("Jump to");
    expect(dateInput).toHaveValue("2024-06-15");

    await user.click(screen.getByRole("button", { name: "← Previous day" }));
    expect(dateInput).toHaveValue("2024-06-14");

    await user.click(screen.getByRole("button", { name: "Next day →" }));
    expect(dateInput).toHaveValue("2024-06-15");
  });

  it("saves the draft when Save is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByPlaceholderText("What happened today—in one line?"),
      "Shipped the journal tests",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(localStorage.getItem("onelinejournal.entries.v1")).toContain(
      "Shipped the journal tests",
    );
  });

  it("lists search hits and jumps to a chosen day", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "onelinejournal.entries.v1",
      JSON.stringify({
        "2024-01-10": "Found a four-leaf clover",
      }),
    );

    render(<App />);
    await user.type(screen.getByPlaceholderText("Search your journal…"), "clover");

    const results = screen.getByRole("region", { name: "Search results" });
    expect(within(results).getByText("Found a four-leaf clover")).toBeInTheDocument();

    await user.click(within(results).getByRole("button", { name: /clover/i }));

    expect(screen.queryByRole("region", { name: "Search results" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Jump to")).toHaveValue("2024-01-10");
    expect(
      screen.getByPlaceholderText("What happened today—in one line?"),
    ).toHaveValue("Found a four-leaf clover");
  });
});
