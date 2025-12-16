import { Flame, Clock, Hash } from "lucide-react";

export default function WorkoutSummaryCards({
  loading,
  calories,
  duration,
  sets,
}) {
  const cards = [
    {
      icon: <Flame className="w-7 h-7 stoke-1 text-lime-700" />,
      bg: "bg-lime-100",
      label: "Calories Burned",
      value: loading ? "—" : `${calories} kcal`,
    },
    {
      icon: <Clock className="w-7 h-7 text-aqua-700" />,
      bg: "bg-aqua-100",
      label: "Workout Length",
      value: loading ? "—" : `${duration} mins`,
    },
    {
      icon: <Hash className="w-7 h-7 text-lavender-700" />,
      bg: "bg-lavender-100",
      label: "Number of Sets",
      value: loading ? "—" : `${sets} sets`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className="card p-4 flex items-center gap-4 transition-all duration-150"
        >
          <div
            className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center`}
          >
            {c.icon}
          </div>
          <div className="flex-1 text-left">
            <p className="p4 text-subtitle">{c.label}</p>
            <h6 className="text-primary">{c.value}</h6>
          </div>
        </div>
      ))}
    </div>
  );
}
