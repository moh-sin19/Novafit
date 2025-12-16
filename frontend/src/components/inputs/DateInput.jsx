import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import "react-day-picker/dist/style.css"; // base styles
import { Calendar } from "lucide-react";

const DISPLAY_FMT = "dd/MM/yyyy";

function formatDateSafe(date) {
  try {
    return date ? format(date, DISPLAY_FMT) : "";
  } catch {
    return "";
  }
}

function parseDateSafe(text) {
  const p = parse(text, DISPLAY_FMT, new Date());
  return isNaN(p?.getTime?.()) ? undefined : p;
}

/**
 * DatePickerInput
 * Props:
 * - label: string
 * - value: Date | undefined
 * - onChange: (date: Date | undefined) => void
 * - error?: string
 * - isRequired?: boolean
 * - disabled?: boolean
 * - min?: Date
 * - max?: Date
 */
const DatePickerInput = forwardRef(function DatePickerInput(
  {
    label,
    value,
    onChange,
    error,
    isRequired = true,
    disabled = false,
    min,
    max,
    className = "",
    placeholder = "DD/MM/YYYY",
  },
  _ref
) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const base =
    "w-full rounded-lg px-4 py-3 p2 bg-base border focus:outline-none focus:ring-1 transition-colors duration-150 ease-out";
  const ok = "border-subtle focus:border-lavender-400 focus:ring-lavender-400";
  const bad = "border-error focus:border-error focus:ring-red-400";

  const inputValue = useMemo(() => formatDateSafe(value), [value]);

  // Text typing support (optional): parse on blur / Enter
  const onInputChange = (e) => {
    // live typing (no parse) — keep the input controlled visually only
    // we rely on blur/Enter to commit; or pick from calendar.
  };
  const commitFromText = () => {
    const parsed = parseDateSafe(inputRef.current?.value || "");
    onChange?.(parsed);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`} ref={rootRef}>
      {label && (
        <label className="sh3 text-secondary w-full text-left px-1">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onBlur={commitFromText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitFromText();
              setOpen(false);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
            }
          }}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          className={`${base} ${error ? bad : ok} pr-10 cursor-pointer`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="daypicker-popover"
          readOnly // <- remove if you want to allow typing; then handle change properly
        />

        {/* Calendar icon (button area) */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => !disabled && setOpen((o) => !o)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
        >
          <Calendar className="h-5 w-5 text-secondary hover:text-primary" />
        </button>

        {open && (
          <div
            id="daypicker-popover"
            role="dialog"
            className="absolute z-20 mt-2 left-0 w-[340px] right-0 rounded-xl border border-subtle bg-base shadow-xl p-2 text-primary"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange?.(d);
                setOpen(false);
              }}
              hideNavigation
              captionLayout="dropdown"
              // captionLayout="buttons" // simple prev/next buttons
              minDate={min} // Enforce min date
              maxDate={max} // Enforce max date
              classNames={{
                root: "rdp-root",
                month: "p-2",
                // caption: "flex items-center gap-2 px-2 pt-2",
                // caption_label: "p2 text-gray-900 dark:text-gray-100",
                // nav: "flex items-center gap-1", // sits right next to the label
                nav_button:
                  "rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                nav_button_previous:
                  "rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                nav_button_next:
                  "rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                table: "w-[300px] border-collapse",
                head_row: "text-gray-500",
                head_cell: "p-2 text-center p3 font-medium",
                cell: "p-0 text-center",
                day: "h-9 w-9 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                day_selected:
                  "bg-lavender-400 text-gray-900 hover:bg-lavender-400",
                day_today: "ring-1 ring-lavender-400",
                day_disabled: "opacity-40 cursor-not-allowed",
                day_outside: "text-gray-400",
              }}
            />
          </div>
        )}
      </div>

      {error && <p className="p3 text-error text-left w-full">{error}</p>}
    </div>
  );
});

export default DatePickerInput;
