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
    <div>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(Math.max(1, quantity - 1))}
      >
        −
      </button>
      <output aria-live="polite">{quantity}</output>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
      >
        +
      </button>
    </div>
  );
}
