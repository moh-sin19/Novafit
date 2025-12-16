import { forwardRef, useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * NumberWithUnitInput
 * Props:
 *  - label: string
 *  - value: number | ""          // controlled by parent/RHF Controller
 *  - onChange: (number | "") => void
 *  - unit: string
 *  - onUnitChange: (unit: string) => void
 *  - unitOptions: string[]        // e.g. ["KG","LB"]
 *  - placeholder?: string
 *  - step?: number
 *  - min?: number
 *  - max?: number
 *  - error?: string
 *  - isRequired?: boolean
 *  - convertOnUnitChange?: (val:number|"", from:string, to:string)=>number|""
 */
const NumberWithUnitInput = forwardRef(function NumberWithUnitInput(
  {
    label,
    value,
    onChange,
    unit,
    onUnitChange,
    unitOptions = [],
    placeholder = "0.00",
    step = 0.01,
    min,
    max,
    error,
    isRequired = true,
    convertOnUnitChange,
    className = "",
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const base =
    "w-full rounded-lg px-4 py-3 p2 bg-base border focus:outline-none focus:ring-1 transition-colors duration-150 ease-out";
  const ok = "border-subtle focus:border-lavender-400 focus:ring-lavender-400";
  const bad = "border-error focus:border-error focus:ring-red-400";

  const handleUnitSelect = (nextUnit) => {
    if (typeof convertOnUnitChange === "function") {
      const nextValue = convertOnUnitChange(value, unit, nextUnit);
      onChange(nextValue);
    }
    onUnitChange(nextUnit);
    setOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`} ref={rootRef}>
      {label && (
        <label className="sh3 text-secondary w-full text-left px-1">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Number input */}
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
          className={`${base} ${error ? bad : ok} flex-1 disabled:opacity-50`}
        />

        {/* Custom dropdown for units */}
        <div className="relative w-[88px]">
          <button
            type="button"
            className={`${base} ${
              error ? bad : ok
            } text-primary flex justify-between items-center px-3 h-full`}
            onClick={() => setOpen((o) => !o)}
          >
            <span>{unit}</span>
            <ChevronDown
              className={`h-4 w-4 text-secondary transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <ul className="absolute z-20 mt-1 left-0 right-0 bg-base text-primary border border-subtle rounded-lg shadow-md max-h-60 overflow-y-auto animate-fadeIn">
              {unitOptions.map((u) => (
                <li key={u}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 text-left text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      unit === u
                        ? "font-bold hover:bg-secondary"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => handleUnitSelect(u)}
                  >
                    {u}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && <p className="p3 text-error">{error}</p>}
    </div>
  );
});

export default NumberWithUnitInput;
