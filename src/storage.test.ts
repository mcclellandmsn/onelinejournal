import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getAllEntriesSorted,
  getEntry,
  searchEntries,
  setEntry,
} from "./storage";

const STORAGE_KEY = "onelinejournal.entries.v1";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns empty string for missing keys", () => {
    expect(getEntry("2024-01-01")).toBe("");
  });

  it("persists trimmed entries and removes empty ones", () => {
    setEntry("2024-01-01", "  hello  ");
    expect(getEntry("2024-01-01")).toBe("hello");
    expect(localStorage.getItem(STORAGE_KEY)).toContain("hello");

    setEntry("2024-01-01", "   ");
    expect(getEntry("2024-01-01")).toBe("");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("{}");
  });

  it("sorts entries newest-first by date key", () => {
    setEntry("2024-01-01", "older");
    setEntry("2024-01-02", "newer");
    expect(getAllEntriesSorted().map((e) => e.dateKey)).toEqual([
      "2024-01-02",
      "2024-01-01",
    ]);
  });

  it("returns empty search results for blank queries", () => {
    setEntry("2024-01-01", "alpha");
    expect(searchEntries("")).toEqual([]);
    expect(searchEntries("   ")).toEqual([]);
  });

  it("finds entries by text and date key substring", () => {
    setEntry("2024-06-15", "saw a blue jay");
    expect(searchEntries("blue")).toEqual([
      { dateKey: "2024-06-15", text: "saw a blue jay" },
    ]);
    expect(searchEntries("2024-06")).toEqual([
      { dateKey: "2024-06-15", text: "saw a blue jay" },
    ]);
  });

  it("ignores invalid JSON in localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(getEntry("2024-01-01")).toBe("");
    expect(getAllEntriesSorted()).toEqual([]);
  });

  it("ignores non-object JSON payloads", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["x"]));
    expect(getAllEntriesSorted()).toEqual([]);
  });
});
