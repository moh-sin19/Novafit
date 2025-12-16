//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import React, { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectInput = forwardRef(
  (
    {
      label,
      placeholder = "Select one of the choice",
      options = [], // [{label, value}]
      value,
      onChange,
      error,
      isRequired = true,
      disabled = false,
      className = "",
      ...rest
    },
    _ref
  ) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
      const onDocClick = (e) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const base =
      "w-full rounded-lg px-4 py-3 p2 bg-base border text-left flex items-center justify-between focus:outline-none focus:ring-1 transition-colors duration-150 ease-out dark:bg-gray-800 dark:text-white dark:border-gray-600";
    const ok =
      "border-subtle focus:border-lavender-400 focus:ring-lavender-400";
    const bad = "border-error focus:border-error focus:ring-red-400";

    const selected = options.find((o) => o.value === value);

    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && (
          <label className="sh3 text-secondary w-full text-left px-1">
            {label} {isRequired && <span className="text-error">*</span>}
          </label>
        )}

        {/* The RELATIVE container keeps the popup the same width as the trigger */}
        <div className="relative" ref={rootRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className={`${base} ${error ? bad : ok} disabled:opacity-50`}
            aria-haspopup="listbox"
            aria-expanded={open}
            {...rest}
          >
            <span className={selected ? "text-primary" : "text-secondary"}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-secondary transition-transform ${
                open ? "rotate-180" : ""
              } dark:text-gray-400`}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute z-20 left-0 right-0 top-full mt-1
                         bg-base border border-subtle rounded-lg
                         shadow-md max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-600"
            >
              {options.map((opt) => {
                const isSel = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSel}
                      onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left transition-colors
                        ${
                          isSel
                            ? "font-bold hover:bg-secondary"
                            : "hover:bg-secondary"
                        } dark:bg-gray-800 dark:text-white`}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error && <p className="p3 text-error text-left w-full">{error}</p>}
      </div>
    );
  }
);

export default SelectInput;
