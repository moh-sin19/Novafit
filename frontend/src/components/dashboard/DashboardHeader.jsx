import { format } from "date-fns";

export default function Header({ title, leftSlot, rightSlot }) {
  const today = format(new Date(), "PPP");

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {leftSlot /* e.g., a date button or breadcrumb */}
      </div>
      <div className="flex items-center gap-3">
        {rightSlot /* action buttons */}
      </div>
    </div>
  );
}
