/** Calendar date in local timezone, YYYY-MM-DD */
export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, delta: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + delta);
  return formatDateKey(d);
}

/** Month and day for "on this day" comparisons (handles leap day by clamping Feb 29). */
export function monthDayFromKey(key: string): { month: number; day: number } {
  const d = parseDateKey(key);
  return { month: d.getMonth() + 1, day: d.getDate() };
}

export function matchesMonthDay(key: string, month: number, day: number): boolean {
  const d = parseDateKey(key);
  return d.getMonth() + 1 === month && d.getDate() === day;
}

export function displayLongDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function displayShortDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
