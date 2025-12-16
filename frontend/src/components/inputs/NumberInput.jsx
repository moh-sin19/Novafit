import { forwardRef } from "react";

/**
 * NumberInput
 * Props:
 *  - label: string
 *  - value: number | ""
 *  - onChange: (number | "") => void
 *  - placeholder?: string
 *  - step?: number
 *  - min?: number
 *  - max?: number
 *  - error?: string
 *  - isRequired?: boolean
 */
const NumberInput = forwardRef(function NumberInput(
  {
    label,
    value,
    onChange,
    placeholder = "0",
    step = 1,
    min = 0,
    max,
    error,
    isRequired = true,
    className = "",
  },
  ref
) {
  const base =
    "w-full rounded-lg px-4 py-3 p2 bg-base text-primary border focus:outline-none focus:ring-1 transition-colors duration-150 ease-out";
  const ok = "border-subtle focus:border-lavender-400 focus:ring-lavender-400";
  const bad = "border-error focus:border-error focus:ring-red-400";

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="sh3 text-secondary w-full text-left px-1">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type="number"
        step={step}
        min={min}
        max={max}
        inputMode="decimal"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? "" : Number(v));
        }}
        className={`${base} ${error ? bad : ok} disabled:opacity-50`}
      />

      {error && <p className="p3 text-error">{error}</p>}
    </div>
  );
});

export default NumberInput;
