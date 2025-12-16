import { useNavigate } from "react-router-dom";

import WorkoutIcon from "../../../assets/icons/workout.svg";
import MacroIcon from "../../../assets/icons/macro.svg";
import InsightsIcon from "../../../assets/icons/insights.svg";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: WorkoutIcon,
      bgColor: "bg-lime-100 dark:bg-lime-400",
      hoverBgColor: "group-hover:bg-lime-300 dark:group-hover:bg-lime-100",
      label: "Workout Management",
      action: "Add Session",
      onClick: () => navigate("/app/workouts"),
    },
    {
      icon: MacroIcon,
      bgColor: "bg-aqua-100  dark:bg-aqua-400",
      hoverBgColor: "group-hover:bg-aqua-300 dark:group-hover:bg-aqua-100",
      label: "Macro Tracking",
      action: "Add Food",
      onClick: () => navigate("/app/nutrition"),
    },
    {
      icon: InsightsIcon,
      bgColor: "bg-lavender-100  dark:bg-lavender-400",
      hoverBgColor:
        "group-hover:bg-lavender-300 dark:group-hover:bg-lavender-100",
      label: "Insights and Progress",
      action: "View Charts",
      onClick: () => navigate("/app/insights"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {actions.map((item, index) => {
        return (
          <button
            key={index}
            onClick={item.onClick}
            className={`card p-4 flex items-center gap-5 transition-all duration-200 cursor-pointer 
              group
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500`}
          >
            <div
              className={`w-12 h-12 rounded-full ${item.bgColor} ${item.hoverBgColor} flex items-center justify-center flex-shrink-0 transition-all duration-200`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6 md:w-7 md:h-7"
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="p4 text-subtitle">{item.label}</p>
              <h6 className=" text-primary font-semibold">{item.action}</h6>
            </div>
          </button>
        );
      })}
    </div>
  );
}
