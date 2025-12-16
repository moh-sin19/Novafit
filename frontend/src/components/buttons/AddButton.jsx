import { Plus } from "lucide-react";

export default function AddButton({ ...props }) {
  return (
    <button
      type="button"
      {...props}
      className=" bg-base border border-subtle flex flex-row items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:bg-gray transition disabled:hover:bg-base"
    >
      <Plus className="w-5 h-5 text-primary" />
    </button>
  );
}
