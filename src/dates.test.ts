import { describe, expect, it } from "vitest";
import {
  addDays,
  formatDateKey,
  matchesMonthDay,
  monthDayFromKey,
  parseDateKey,
} from "./dates";

describe("formatDateKey", () => {
  it("formats local calendar dates as YYYY-MM-DD", () => {
    expect(formatDateKey(new Date(2024, 5, 7))).toBe("2024-06-07");
    expect(formatDateKey(new Date(2024, 0, 5))).toBe("2024-01-05");
  });
});

describe("parseDateKey", () => {
  it("parses keys into local dates", () => {
    const d = parseDateKey("2024-06-07");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(7);
  });
});

describe("addDays", () => {
  it("shifts calendar days in the local timezone", () => {
    expect(addDays("2024-01-01", 31)).toBe("2024-02-01");
    expect(addDays("2024-06-15", -1)).toBe("2024-06-14");
    expect(addDays("2024-03-01", -1)).toBe("2024-02-29");
  });
});

describe("monthDayFromKey", () => {
  it("returns 1-based month and day", () => {
    expect(monthDayFromKey("2024-12-25")).toEqual({ month: 12, day: 25 });
  });
});

describe("matchesMonthDay", () => {
  it("matches month and day ignoring year", () => {
    expect(matchesMonthDay("2020-07-04", 7, 4)).toBe(true);
    expect(matchesMonthDay("2020-07-04", 7, 5)).toBe(false);
  });
});
