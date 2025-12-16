export default function PrimaryIconButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  form,
}) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full w-11 h-11 md:w-12 md:h-12 px-3 py-3 btn-primary disabled:opacity-50 disabled:pointer-events-none transition"
    >
      {children}
    </button>
  );
}
