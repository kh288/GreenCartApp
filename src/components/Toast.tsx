type ToastProps = {
  message: string | null;
};

/** Announcement region for transient confirmations (e.g. "Added to cart"). */
export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <p role="status" aria-live="polite">
      {message}
    </p>
  );
}
