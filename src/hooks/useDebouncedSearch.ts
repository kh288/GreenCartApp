import { useEffect, useRef } from "react";
import type { AnalyticsEvent } from "../utils/analytics";

type Omit1<T, K extends keyof T> = Omit<T, K>;

/**
 * Records a "search" analytics event for a search term once the user stops
 * typing, instead of once per keystroke.
 *
 * Without this, typing "soap" would log `s`, `so`, `soa`, and `soap`. We wait
 * `delayMs` after the last change, then log only the settled term. Terms shorter
 * than `minLength` are ignored as noise.
 */
export function useDebouncedSearch(
  term: string,
  onChange: (event: Omit1<AnalyticsEvent, "id" | "at">) => void,
  { delayMs = 600, minLength = 2 }: { delayMs?: number; minLength?: number } = {},
): void {
  // Keep the latest callback without resetting the timer on every render.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < minLength) return;

    const timer = window.setTimeout(() => {
      onChangeRef.current({ type: "search", term: trimmed });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [term, delayMs, minLength]);
}
