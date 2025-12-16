import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  placeholder = "Search...",
  onChange,
  onSubmit,
}) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 w-full rounded-lg border border-subtle bg-base px-3 py-3 focus-within:border-accent transition"
    >
      <Search className="w-6 h-6 text-secondary flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-primary placeholder:text-secondary focus:outline-none"
      />
    </form>
  );
}
