import { Minus, Plus } from "lucide-react";
export function Quantity({
  value,
  onChange,
  label,
  max = 99,
  min = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  max?: number;
  min?: number;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Decrease ${label} quantity`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span aria-label={`${label} quantity`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label} quantity`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
