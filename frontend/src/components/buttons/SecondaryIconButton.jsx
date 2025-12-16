export default function SecondaryIconButton({
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
      className="flex flex-row justify-center items-center gap-2 rounded-full w-11 h-11 md:w-12 md:h-12 px-3 py-3 btn-base border border-subtle bg-base text-primary disabled:opacity-50 disabled:pointer-events-none transition"
    >
      {children}
    </button>
  );
}
