import React, { forwardRef } from "react";

const PasswordInput = forwardRef(
  ({ label, placeholder, error, isRequired = true, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="sh3 text-secondary w-full text-left px-1">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>

        <input
          type="password"
          placeholder={placeholder}
          ref={ref}
          {...props}
          className={`w-full rounded-lg px-4 py-3 p2 bg-base border disabled:opacity-50
          ${
            error
              ? "border-error focus:ring-red-400 focus:border-error focus:ring-opacity-50 focus:ring-1"
              : "border-subtle focus:ring-lavender-400 focus:border-lavender-400 focus:ring-opacity-50 focus:ring-1"
          } 
           focus:outline-none focus:ring-1 transition-colors duration-150 ease-out`}
        />

        {error && <p className="p3 text-error text-left w-full">{error}</p>}
      </div>
    );
  }
);

export default PasswordInput;
