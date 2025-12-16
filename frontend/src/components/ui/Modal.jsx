import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import SecondaryButton from "../buttons/SecondaryButton";

/**
 * Modal
 * Props:
 * - open: boolean
 * - type: "success" | "error" | "info"
 * - title: string
 * - description?: string
 * - confirmText?: string  (default: "Okay")
 * - onClose: () => void
 * - onConfirm?: () => void  (defaults to onClose)
 */
export default function Modal({
  open,
  type = "info",
  title,
  description,
  confirmText = "OKAY",
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const styles = {
    success: {
      ring: "bg-lime-100",
      iconWrap: "bg-lime-400",
      icon: "text-primary",
    },
    error: {
      ring: "bg-red-100",
      iconWrap: "bg-red-200",
      icon: "text-red-600",
    },
    info: {
      ring: "bg-cyan-100",
      iconWrap: "bg-cyan-200",
      icon: "text-primary",
    },
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
  }[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="alert-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-white/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-base p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Close button */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-gray-100"
        >
          <X className="h-5 w-5 lg:h-6 lg:w-6 text-secondary" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`relative w-12 h-12 md:h-16 md:w-16 rounded-full ${styles.iconWrap} grid place-items-center`}
          >
            <div
              className={`absolute inset-[-8px] rounded-full ${styles.ring} opacity-50`}
            />
            <Icon className={`relative h-6 w-6 md:h-8 md:w-8 ${styles.icon}`} />
          </div>
        </div>

        {/* Title & description */}
        <div className="mt-5 text-center">
          <h4 id="alert-title" className="text-primary">
            {title}
          </h4>
          {description && (
            <p className="p2 mt-2 text-secondary text-balance">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <SecondaryButton onClick={onConfirm} fullWidth>
            {confirmText}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
