import { useState } from "react";
import { emptyProduct, nextProductId } from "../utils/productStore";
import { formatPrice } from "../utils/format";
import type { Product } from "../types";

type AdminPanelProps = {
  products: Product[];
  onSave: (product: Product) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
  hasAdminChanges: boolean;
};

/** FR8: admin panel to add, edit, and remove products and inventory. */
export function AdminPanel({
  products,
  onSave,
  onRemove,
  onReset,
  onClose,
  hasAdminChanges,
}: AdminPanelProps) {
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setDraft(emptyProduct(nextProductId(products)));
    setIsNew(true);
  };

  const startEdit = (product: Product) => {
    setDraft({ ...product });
    setIsNew(false);
  };

  const cancel = () => {
    setDraft(null);
    setIsNew(false);
  };

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return;
    onSave(draft);
    cancel();
  };

  const update = <K extends keyof Product>(key: K, value: Product[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div
      className="modal app-modal-backdrop d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Product administration"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-success-subtle">
            <h2 className="modal-title h5 d-flex align-items-center gap-2">
              <span aria-hidden="true">🛠️</span> Manage Products
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {draft ? (
              <ProductForm
                draft={draft}
                isNew={isNew}
                onChange={update}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <button type="button" className="btn btn-success" onClick={startAdd}>
                    + Add product
                  </button>
                  <div className="d-flex align-items-center gap-2">
                    {hasAdminChanges && (
                      <span className="badge text-bg-warning">Unsaved-to-CSV changes</span>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={onReset}
                      disabled={!hasAdminChanges}
                    >
                      Reset to CSV
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col" className="text-end">
                          Price
                        </th>
                        <th scope="col" className="text-end">
                          Inventory
                        </th>
                        <th scope="col" className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <code>{product.id}</code>
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td className="text-end">{formatPrice(product.price)}</td>
                          <td className="text-end">
                            <span
                              className={
                                product.inventory > 0 ? "text-success" : "text-danger fw-semibold"
                              }
                            >
                              {product.inventory}
                            </span>
                          </td>
                          <td className="text-end text-nowrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success me-1"
                              onClick={() => startEdit(product)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onRemove(product.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted small mb-0">
                  Changes are saved in this browser and layered over the CSV catalog.
                </p>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  draft,
  isNew,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Product;
  isNew: boolean;
  onChange: <K extends keyof Product>(key: K, value: Product[K]) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const text =
    (key: keyof Product) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(key, event.target.value as never);

  const number = (key: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(key, (Number(event.target.value) || 0) as never);

  const flag = (key: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(key, event.target.checked as never);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <h3 className="h6 text-uppercase text-muted fw-semibold mb-3">
        {isNew ? "New product" : `Editing ${draft.id}`}
      </h3>

      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="ap-name">
            Name
          </label>
          <input
            id="ap-name"
            className="form-control"
            value={draft.name}
            onChange={text("name")}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="ap-category">
            Category
          </label>
          <input
            id="ap-category"
            className="form-control"
            value={draft.category}
            onChange={text("category")}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="ap-brand">
            Brand
          </label>
          <input
            id="ap-brand"
            className="form-control"
            value={draft.brand}
            onChange={text("brand")}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="ap-price">
            Price
          </label>
          <input
            id="ap-price"
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={draft.price}
            onChange={number("price")}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="ap-size">
            Size
          </label>
          <input id="ap-size" className="form-control" value={draft.size} onChange={text("size")} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="ap-inventory">
            Inventory
          </label>
          <input
            id="ap-inventory"
            type="number"
            min="0"
            className="form-control"
            value={draft.inventory}
            onChange={number("inventory")}
          />
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="ap-description">
            Description
          </label>
          <textarea
            id="ap-description"
            className="form-control"
            rows={2}
            value={draft.description}
            onChange={text("description")}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="ap-ingredients">
            Ingredients / Sourcing
          </label>
          <input
            id="ap-ingredients"
            className="form-control"
            value={draft.ingredients}
            onChange={text("ingredients")}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="ap-badges">
            Eco-badges (semicolon-separated)
          </label>
          <input
            id="ap-badges"
            className="form-control"
            value={draft.ecoBadges.join(";")}
            onChange={(event) =>
              onChange(
                "ecoBadges",
                event.target.value
                  .split(";")
                  .map((badge) => badge.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>

        <div className="col-12 d-flex flex-wrap gap-3">
          <FlagCheck
            id="ap-plastic"
            label="Plastic-Free"
            checked={draft.plasticFree}
            onChange={flag("plasticFree")}
          />
          <FlagCheck id="ap-vegan" label="Vegan" checked={draft.vegan} onChange={flag("vegan")} />
          <FlagCheck
            id="ap-local"
            label="Locally Made"
            checked={draft.locallyMade}
            onChange={flag("locallyMade")}
          />
          <FlagCheck
            id="ap-carbon"
            label="Carbon-Neutral Shipping"
            checked={draft.carbonNeutralShipping}
            onChange={flag("carbonNeutralShipping")}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-success">
          {isNew ? "Add product" : "Save changes"}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function FlagCheck({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="form-check">
      <input
        id={id}
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
