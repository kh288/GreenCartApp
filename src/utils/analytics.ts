/**
 * FR7: Anonymized analytics events.
 *
 * We record coarse, non-identifying shopper actions (what was searched, which
 * product was viewed, what was added to the cart) so the business can see
 * aggregate trends. No personal data and no session identifiers are stored.
 */

export type AnalyticsEventType =
  "search" | "view" | "add_to_cart" | "remove_from_cart" | "checkout";

export type AnalyticsEvent = {
  /** Monotonic id so the log can be keyed in tables. */
  id: number;
  type: AnalyticsEventType;
  /** ISO timestamp of when the event occurred. */
  at: string;
  /** Product id, when the event concerns a specific product. */
  productId?: string;
  /** Product name, denormalized for readable reports. */
  productName?: string;
  /** Quantity involved (cart events). */
  quantity?: number;
  /** Search term, when the event is a search. */
  term?: string;
  /** Category/badge/product filters active at the time of a search. */
  category?: string;
  badge?: string;
};

/** The shape persisted to localStorage. */
type StoredEvents = {
  nextId: number;
  events: AnalyticsEvent[];
};

const STORAGE_KEY = "greencart:analytics";

/** Cap the log so localStorage never grows without bound. */
export const MAX_EVENTS = 500;

function readStore(): StoredEvents {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nextId: 1, events: [] };
    const parsed = JSON.parse(raw) as Partial<StoredEvents>;
    if (!Array.isArray(parsed.events)) return { nextId: 1, events: [] };
    return {
      nextId: typeof parsed.nextId === "number" ? parsed.nextId : parsed.events.length + 1,
      events: parsed.events,
    };
  } catch {
    return { nextId: 1, events: [] };
  }
}

function writeStore(store: StoredEvents): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Best-effort; analytics must never break the app.
  }
}

/** Returns the full event log, oldest first. */
export function getEvents(): AnalyticsEvent[] {
  return readStore().events;
}

/** Returns a snapshot of the current event count. */
export function getEventCount(): number {
  return getEvents().length;
}

/**
 * Appends an analytics event. Returns the stored event, including its id.
 * The log is trimmed to the most recent {@link MAX_EVENTS} entries.
 */
export function logEvent(event: Omit<AnalyticsEvent, "id" | "at">): AnalyticsEvent {
  const store = readStore();
  const stored: AnalyticsEvent = {
    id: store.nextId,
    at: new Date().toISOString(),
    ...event,
  };
  const events = [...store.events, stored].slice(-MAX_EVENTS);
  writeStore({ nextId: store.nextId + 1, events });
  // Notify subscribers (e.g. the Insights panel) within this tab.
  window.dispatchEvent(new CustomEvent("greencart:analytics", { detail: stored }));
  return stored;
}

/** Clears the event log entirely. */
export function clearEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("greencart:analytics"));
  } catch {
    // Ignore.
  }
}

/** Aggregated metrics derived from the raw event log. */
export type AnalyticsSummary = {
  total: number;
  searches: number;
  views: number;
  addToCart: number;
  checkouts: number;
  /** Most frequent search terms, descending. */
  topTerms: { term: string; count: number }[];
  /** Most viewed products, descending. */
  topViewed: { name: string; count: number }[];
  /** Most frequently added products, descending (by total quantity). */
  topAdded: { name: string; quantity: number }[];
};

/** Computes aggregate metrics from a list of events. */
export function summarize(events: AnalyticsEvent[]): AnalyticsSummary {
  const tally = <T>(items: T[], key: (item: T) => string | undefined) => {
    const map = new Map<string, number>();
    for (const item of items) {
      const k = key(item);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  };

  const searches = events.filter((e) => e.type === "search" && e.term);
  const views = events.filter((e) => e.type === "view" && e.productName);
  const adds = events.filter((e) => e.type === "add_to_cart");

  const topTerms = [...tally(searches, (e) => e.term!.toLowerCase()).entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topViewed = [...tally(views, (e) => e.productName).entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const addedQty = new Map<string, number>();
  for (const event of adds) {
    if (!event.productName) continue;
    addedQty.set(event.productName, (addedQty.get(event.productName) ?? 0) + (event.quantity ?? 1));
  }
  const topAdded = [...addedQty.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    total: events.length,
    searches: searches.length,
    views: views.length,
    addToCart: adds.length,
    checkouts: events.filter((e) => e.type === "checkout").length,
    topTerms,
    topViewed,
    topAdded,
  };
}
