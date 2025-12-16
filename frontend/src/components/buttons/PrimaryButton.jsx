// Minimal primary button with loading + fullWidth support
import { useMemo } from "react";

export default function PrimaryButton({
  children,
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  form,
  ...props
}) {
  const cls = useMemo(
    () =>
      [
        "h-12 b1 rounded-full py-4 px-8 btn-primary",
        "transition disabled:opacity-60 disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        className,
      ].join(" "),
    [className, fullWidth]
  );

  return (
    <button
      type={type}
      form={form}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cls}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
