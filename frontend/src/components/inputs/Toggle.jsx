import { forwardRef } from "react";

/**
 * Toggle Component
 *
 * Props:
 *  - label?: string
 *  - checked: boolean
 *  - onChange: (checked: boolean) => void
 *  - disabled?: boolean
 *  - className?: string
 */
const Toggle = forwardRef(function Toggle(
  { label, checked, onChange, disabled = false, className = "" },
  ref
) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-out
          ${checked ? "btn-secondary" : "bg-gray"}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>

      {label && <span className="b3 text-primary">{label}</span>}
    </div>
  );
});

export default Toggle;
