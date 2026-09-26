import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearEvents,
  type AnalyticsEvent,
  type AnalyticsSummary,
  getEvents,
  logEvent,
  summarize,
} from "../utils/analytics";

type UseAnalyticsResult = {
  events: AnalyticsEvent[];
  summary: AnalyticsSummary;
  track: (event: Omit<AnalyticsEvent, "id" | "at">) => void;
  clear: () => void;
};

/**
 * FR7: subscribes to the anonymized analytics log and exposes a live summary.
 *
 * Any call to `track` (or the shared `logEvent`) refreshes the summary in every
 * component using this hook, within the same tab.
 */
export function useAnalytics(): UseAnalyticsResult {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => getEvents());

  useEffect(() => {
    const refresh = () => setEvents(getEvents());
    window.addEventListener("greencart:analytics", refresh);
    return () => window.removeEventListener("greencart:analytics", refresh);
  }, []);

  const track = useCallback((event: Omit<AnalyticsEvent, "id" | "at">) => {
    logEvent(event);
  }, []);

  const clear = useCallback(() => {
    clearEvents();
  }, []);

  const summary = useMemo(() => summarize(events), [events]);

  return { events, summary, track, clear };
}
