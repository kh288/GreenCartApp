import { useCallback, useEffect, useState } from "react";

type UseToastResult = {
  toast: string | null;
  showToast: (message: string) => void;
};

/** Holds a transient status message that auto-dismisses after `durationMs`. */
export function useToast(durationMs = 2500): UseToastResult {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(timer);
  }, [toast, durationMs]);

  const showToast = useCallback((message: string) => setToast(message), []);

  return { toast, showToast };
}
