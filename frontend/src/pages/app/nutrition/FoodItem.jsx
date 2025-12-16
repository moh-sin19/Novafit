import AddButton from "../../../components/buttons/AddButton";

export default function FoodItem({
  name,
  description,
  onClick,
  disabled = false,
}) {
  // Ensure safe display values (avoid "undefined, undefined")
  const descText =
    description && description.trim().length > 0
      ? description
      : "No description available";

  return (
    <div
      className={`w-full flex items-center justify-between rounded-2xl border border-subtle bg-base px-5 py-3 gap-10 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Left side: food info */}
      <div className="flex flex-col gap-0">
        <p className="sh3 text-primary truncate max-w-[220px]">{name}</p>
        <p className="p3 text-subtitle truncate max-w-[260px]">
          {descText}
        </p>
      </div>

      {/* Right side: add button */}
      <AddButton
        onClick={!disabled ? onClick : undefined}
        aria-label={`Add ${name}`}
      />
    </div>
  );
}
