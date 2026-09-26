type ToastProps = {
  message: string | null;
};

/** Announcement region for transient confirmations (e.g. "Added to cart"). */
export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div
      className="toast show position-fixed bottom-0 end-0 m-3 text-bg-success border-0 shadow"
      role="status"
      aria-live="polite"
      style={{ zIndex: 1080 }}
    >
      <div className="toast-body d-flex align-items-center gap-2">
        <span aria-hidden="true">✓</span>
        {message}
      </div>
    </div>
  );
}
