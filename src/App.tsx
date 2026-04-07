import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDays,
  displayLongDate,
  displayShortDate,
  formatDateKey,
  matchesMonthDay,
  monthDayFromKey,
} from "./dates";
import {
  getAllEntriesSorted,
  getEntry,
  searchEntries,
  setEntry,
} from "./storage";

export function App() {
  const [todayKey, setTodayKey] = useState(() => formatDateKey(new Date()));
  const [selectedKey, setSelectedKey] = useState(() => formatDateKey(new Date()));
  const [draft, setDraft] = useState(() => getEntry(formatDateKey(new Date())));
  const [searchQuery, setSearchQuery] = useState("");
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const syncCalendarToday = () => {
      setTodayKey((prev) => {
        const next = formatDateKey(new Date());
        return prev === next ? prev : next;
      });
    };

    syncCalendarToday();
    const intervalId = window.setInterval(syncCalendarToday, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") syncCalendarToday();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setDraft(getEntry(selectedKey));
  }, [selectedKey, version]);

  const saveDraft = useCallback(() => {
    const current = getEntry(selectedKey);
    if (draft.trim() === current.trim()) return;
    setEntry(selectedKey, draft);
    bump();
  }, [draft, selectedKey, bump]);

  const onBlurSave = () => {
    saveDraft();
  };

  const { month, day } = monthDayFromKey(selectedKey);
  const sameDayOtherYears = useMemo(() => {
    return getAllEntriesSorted().filter(
      (e) => e.dateKey !== selectedKey && matchesMonthDay(e.dateKey, month, day),
    );
  }, [selectedKey, month, day, version]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEntries(searchQuery);
  }, [searchQuery, version]);

  const isToday = selectedKey === todayKey;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-paper-dark/60 bg-paper/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-5">
          <h1 className="font-serif text-2xl font-semibold text-ink tracking-tight">
            One line a day
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            A single sentence for each day—yours to keep in the browser.
          </p>
          <label className="mt-4 block">
            <span className="sr-only">Search entries</span>
            <input
              type="search"
              placeholder="Search your journal…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full rounded-lg border border-paper-dark bg-white/80 px-3 py-2.5 text-ink placeholder:text-ink-muted/70 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-16">
        {searchQuery.trim() ? (
          <section aria-label="Search results" className="mb-10">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Results
            </h2>
            {searchResults.length === 0 ? (
              <p className="mt-3 text-ink-muted">No entries match that search.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {searchResults.map((e) => (
                  <li key={e.dateKey}>
                    <button
                      type="button"
                      onClick={() => {
                        saveDraft();
                        setSelectedKey(e.dateKey);
                        setSearchQuery("");
                      }}
                      className="w-full rounded-lg border border-paper-dark bg-white/70 p-4 text-left shadow-sm transition hover:border-accent/40 hover:bg-white"
                    >
                      <div className="font-sans text-xs font-medium text-accent">
                        {displayShortDate(e.dateKey)}
                      </div>
                      <p className="mt-1 font-serif text-ink leading-relaxed">{e.text}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <section aria-label="Selected day">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                saveDraft();
                setSelectedKey(addDays(selectedKey, -1));
              }}
              className="rounded-lg border border-paper-dark bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm hover:bg-paper-dark/30"
            >
              ← Previous day
            </button>
            <button
              type="button"
              onClick={() => {
                saveDraft();
                setSelectedKey(todayKey);
              }}
              disabled={isToday}
              className="rounded-lg border border-accent/40 bg-accent px-3 py-2 text-sm font-medium text-paper shadow-sm disabled:cursor-not-allowed disabled:opacity-45 hover:bg-accent-light"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                saveDraft();
                setSelectedKey(addDays(selectedKey, 1));
              }}
              className="rounded-lg border border-paper-dark bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm hover:bg-paper-dark/30"
            >
              Next day →
            </button>
            <label className="ml-auto flex items-center gap-2 text-sm text-ink-muted">
              <span className="whitespace-nowrap">Jump to</span>
              <input
                type="date"
                value={selectedKey}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) {
                    saveDraft();
                    setSelectedKey(v);
                  }
                }}
                className="rounded-lg border border-paper-dark bg-white px-2 py-2 text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </label>
          </div>

          <h2 className="mt-8 font-serif text-xl text-ink">{displayLongDate(selectedKey)}</h2>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-ink-muted">
              {isToday ? "Today’s line" : "Entry for this day"}
            </span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={onBlurSave}
              rows={4}
              placeholder="What happened today—in one line?"
              className="w-full resize-y rounded-xl border border-paper-dark bg-white/90 p-4 font-serif text-lg leading-relaxed text-ink placeholder:text-ink-muted/60 shadow-inner focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </label>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                saveDraft();
              }}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-paper shadow-sm hover:bg-accent-light"
            >
              Save
            </button>
          </div>
        </section>

        <section aria-label="On this day in other years" className="mt-12">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-ink-muted">
            On this day in other years
          </h2>
          {sameDayOtherYears.length === 0 ? (
            <p className="mt-3 text-ink-muted">
              No entries yet for this calendar date in other years.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {sameDayOtherYears.map((e) => (
                <li
                  key={e.dateKey}
                  className="rounded-xl border border-paper-dark bg-white/60 p-4 shadow-sm"
                >
                  <div className="font-sans text-xs font-medium text-accent">
                    {displayShortDate(e.dateKey)}
                  </div>
                  <p className="mt-2 font-serif text-ink leading-relaxed">{e.text}</p>
                  <button
                    type="button"
                    onClick={() => {
                      saveDraft();
                      setSelectedKey(e.dateKey);
                    }}
                    className="mt-3 text-sm font-medium text-accent hover:text-accent-light"
                  >
                    Open this day
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
