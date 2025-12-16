import { AlertTriangle } from "lucide-react";

/**
 * ErrorCard - A reusable card component for displaying warnings/errors with optional action
 *
 * @param {string} title - The main title/heading
 * @param {string} message - The descriptive message
 * @param {React.Component} [icon] - Optional custom icon component (defaults to AlertTriangle)
 * @param {"warning"|"error"|"info"} [variant="warning"] - Color variant
 */
export default function ErrorCard({
  title,
  message,
  actionText,
  onAction,
  icon: Icon = AlertTriangle,
  variant = "warning",
}) {
  // Tailwind color schemes for different variants
  const variants = {
    warning: {
      bg: "bg-yellow-50",
      border: "border border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    info: {
      bg: "bg-lavender-50",
      border: "border-lavender-200",
      iconBg: "bg-lavender-100",
      iconColor: "text-lavender-600",
    },
  };

  const colors = variants[variant] || variants.warning;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`card p-4 sm:p-6 ${colors.bg} ${colors.border}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${colors.iconColor}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h6 className="text-primary mb-2">{title}</h6>
          <p className="p3 text-secondary">{message}</p>

          {actionText && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border bg-white hover:bg-gray-50 transition"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
