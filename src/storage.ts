const STORAGE_KEY = "onelinejournal.entries.v1";

export type EntryMap = Record<string, string>;

function loadRaw(): EntryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as EntryMap;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function saveRaw(map: EntryMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getEntry(dateKey: string): string {
  return loadRaw()[dateKey] ?? "";
}

export function setEntry(dateKey: string, text: string): void {
  const map = loadRaw();
  const trimmed = text.trim();
  if (trimmed === "") {
    delete map[dateKey];
  } else {
    map[dateKey] = trimmed;
  }
  saveRaw(map);
}

export function getAllEntriesSorted(): { dateKey: string; text: string }[] {
  const map = loadRaw();
  return Object.entries(map)
    .map(([dateKey, text]) => ({ dateKey, text }))
    .sort((a, b) => (a.dateKey < b.dateKey ? 1 : a.dateKey > b.dateKey ? -1 : 0));
}

export function searchEntries(query: string): { dateKey: string; text: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllEntriesSorted().filter(
    (e) =>
      e.text.toLowerCase().includes(q) ||
      e.dateKey.includes(q) ||
      displayDateForSearch(e.dateKey).toLowerCase().includes(q),
  );
}

function displayDateForSearch(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
