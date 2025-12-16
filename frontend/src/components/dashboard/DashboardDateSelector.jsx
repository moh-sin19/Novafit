import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DashboardDateSelector({ value, onChange }) {
  const [selected, setSelected] = useState(
    value ? new Date(value) : new Date()
  );
  console.log("DashboardDateSelector selected: ", selected);
  const [open, setOpen] = useState(false);

  const handleSelect = (day) => {
    setSelected(day);
    setOpen(false);
    onChange?.(day);
  };

  const label =
    selected.toDateString() === new Date().toDateString()
      ? "Today"
      : format(selected, "EEE, MMM d");

  return (
    <div className="relative">
      {/* Date Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-12 flex flex-row items-center gap-3 rounded-full py-4 px-6 border border-subtle bg-base text-primary hover:bg-gray transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Calendar className="w-6 h-6 text-secondary" />
        <h6 className="text-primary">{label}</h6>
      </button>

      {/* Dropdown Calendar */}
      {open && (
        <div
          className="absolute mt-2 z-50 bg-base border border-subtle rounded-2xl shadow-lg p-3"
          onBlur={() => setOpen(false)}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            weekStartsOn={1}
            styles={{
              caption: { color: "var(--color-primary)" },
              head_cell: { color: "var(--color-secondary)" },
              day_selected: { backgroundColor: "var(--color-accent)" },
            }}
          />
        </div>
      )}
    </div>
  );
}
