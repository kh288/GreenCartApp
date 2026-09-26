import type { AnalyticsSummary } from "../utils/analytics";

type InsightsPanelProps = {
  summary: AnalyticsSummary;
  onClear: () => void;
  onClose: () => void;
};

/** FR7: an admin-facing view of aggregated, anonymized shopper activity. */
export function InsightsPanel({ summary, onClear, onClose }: InsightsPanelProps) {
  return (
    <div
      className="modal app-modal-backdrop d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Store insights"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-success-subtle">
            <h2 className="modal-title h5 d-flex align-items-center gap-2">
              <span aria-hidden="true">📊</span> Store Insights
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <p className="text-muted small">
              Anonymized activity logged in this browser. No personal data is collected.
            </p>

            <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
              <StatCard label="Events" value={summary.total} />
              <StatCard label="Searches" value={summary.searches} />
              <StatCard label="Product views" value={summary.views} />
              <StatCard label="Add to cart" value={summary.addToCart} />
            </div>

            <div className="row g-4">
              <RankedList
                title="Top Search Terms"
                empty="No searches yet."
                rows={summary.topTerms.map((t) => ({ label: t.term, value: String(t.count) }))}
              />
              <RankedList
                title="Most Viewed"
                empty="No product views yet."
                rows={summary.topViewed.map((t) => ({ label: t.name, value: String(t.count) }))}
              />
              <RankedList
                title="Most Added to Cart"
                empty="Nothing added yet."
                rows={summary.topAdded.map((t) => ({ label: t.name, value: String(t.quantity) }))}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-danger me-auto" onClick={onClear}>
              Clear data
            </button>
            <button type="button" className="btn btn-success" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="col">
      <div className="card border-0 shadow-sm h-100 text-center">
        <div className="card-body">
          <div className="fs-3 fw-bold text-success">{value}</div>
          <div className="small text-muted text-uppercase">{label}</div>
        </div>
      </div>
    </div>
  );
}

function RankedList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; value: string }[];
  empty: string;
}) {
  return (
    <div className="col-md-4">
      <h3 className="h6 text-uppercase text-muted fw-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-muted small mb-0">{empty}</p>
      ) : (
        <ol className="list-group list-group-numbered list-group-flush">
          {rows.map((row) => (
            <li
              key={row.label}
              className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent"
            >
              <span className="text-truncate me-2">{row.label}</span>
              <span className="badge text-bg-success rounded-pill">{row.value}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
