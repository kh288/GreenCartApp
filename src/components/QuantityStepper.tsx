type QuantityStepperProps = {
  quantity: number;
  max: number;
  disabled?: boolean;
  label?: string;
  onChange: (quantity: number) => void;
};

/**
 * A −/+ quantity control shared by the product detail and cart views.
 * Clamps between 1 and `max`; disabled when `disabled` is true.
 */
export function QuantityStepper({
  quantity,
  max,
  disabled = false,
  label = "quantity",
  onChange,
}: QuantityStepperProps) {
  return (
    <div className="input-group" style={{ maxWidth: "8rem" }}>
      <button
        type="button"
        className="btn btn-outline-success"
        aria-label={`Decrease ${label}`}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(Math.max(1, quantity - 1))}
      >
        −
      </button>
      <output
        className="form-control text-center fw-semibold d-flex align-items-center justify-content-center"
        aria-live="polite"
      >
        {quantity}
      </output>
      <button
        type="button"
        className="btn btn-outline-success"
        aria-label={`Increase ${label}`}
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
      >
        +
      </button>
    </div>
  );
}
