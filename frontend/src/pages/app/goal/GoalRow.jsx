import { useNavigate, useParams } from "react-router-dom";

import {
  Gauge,
  HeartPulse,
  Flame,
  MoreVertical,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";

const TYPE_META = {
  WEIGHT_KG: {
    color: "text-lime-700",
    track: "bg-lime-500",
    bg: "bg-lime-200",
    icon: Gauge,
    unit: "kg",
    title: (t, frequency) => `Weight Target (${t}kg)`,
  },
  WORKOUTS_PER_WEEK: {
    color: "text-aqua-800",
    track: "bg-aqua-500",
    bg: "bg-aqua-200",
    icon: HeartPulse,
    unit: "session",
    title: (t, frequency) => {
      const sessionText = Number(t) === 1 ? "session" : "sessions";
      const frequencyText = frequency === "daily" ? "Daily" : "Weekly";
      return `${frequencyText} Workout Session (${t} ${sessionText})`;
    },
  },
  CALORIES_KCAL: {
    color: "text-lavender-600",
    track: "bg-lavender-500",
    bg: "bg-lavender-100",
    icon: Flame,
    unit: "kcal",
    title: (t, frequency) => {
      const frequencyText = frequency === "daily" ? "Daily" : "Weekly";
      return `${frequencyText} Calorie Intake Goal (${t}kcal)`;
    },
  },
};

function clampPercent(p) {
  if (!p || isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p));
}

function getStatusInfo(goal) {
  if (goal.status === "done" || goal.achieved) {
    return {
      status: "completed",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: CheckCircle,
      label: "Completed",
    };
  }

  if (goal.status === "active") {
    return {
      status: "active",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: Clock,
      label: "Active",
    };
  }

  return {
    status: "unknown",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    icon: AlertCircle,
    label: "Unknown",
  };
}

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export default function GoalRow({ goal }) {
  const navigate = useNavigate();

  const meta = TYPE_META[goal.type] || TYPE_META.CALORIES_KCAL;
  const Icon = meta.icon;
  const pct = clampPercent(goal.progressPercentage);
  const leftNumber = Number(goal.currentValue ?? 0);
  const left =
    goal.type === "CALORIES_KCAL"
      ? `${leftNumber.toFixed(0)} ${meta.unit} avg/day`
      : goal.type === "WORKOUTS_PER_WEEK"
      ? `${leftNumber.toFixed(1)} ${meta.unit} ${goal.frequency === "daily" ? "per day" : "per week"}`
      : `${leftNumber} ${meta.unit}`;
  const right =
    goal.type === "CALORIES_KCAL"
      ? `${goal.targetValue} ${meta.unit} avg/day`
      : goal.type === "WORKOUTS_PER_WEEK"
      ? `${goal.targetValue} ${meta.unit} ${goal.frequency === "daily" ? "per day" : "per week"}`
      : `${goal.targetValue} ${meta.unit}`;


  const statusInfo = getStatusInfo(goal);
  const StatusIcon = statusInfo.icon;

  const startDate = formatDate(goal.startDate);
  const endDate = formatDate(goal.endDate);
  const daysRemaining = goal.daysRemaining;

  return (
    <div className="card rounded-2xl border border-subtle bg-base px-4 py-4 md:px-6 md:py-6 transition-all">
      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Goal Type Icon */}
          <div
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center ${meta.bg} flex-shrink-0`}
          >
            <Icon className={`${meta.color} w-5 h-5 md:w-6 md:h-6`} />
          </div>

          {/* Goal Title and Description */}
          <div className="min-w-0 flex-1">
            <h3 className="sh3 md:sh2 text-primary font-semibold truncate">
              {meta.title(goal.targetValue, goal.frequency)}
            </h3>
            {goal.description && (
              <p className="p4 md:p3 text-secondary mt-1 line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge and Progress Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}
          >
            <StatusIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span className="p5 md:p4 font-medium">{statusInfo.label}</span>
          </div>

          {/* Progress Status */}
          {goal.progressStatus && (
            <div
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full ${
                goal.progressStatus === "on_track"
                  ? "bg-green-50 text-green-700"
                  : goal.progressStatus === "behind"
                  ? "bg-red-50 text-red-700"
                  : goal.progressStatus === "ahead"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                  goal.progressStatus === "on_track"
                    ? "bg-green-500"
                    : goal.progressStatus === "behind"
                    ? "bg-red-500"
                    : goal.progressStatus === "ahead"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="p5 md:p4 font-medium capitalize">
                {goal.progressStatus.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Goal Details */}
      <div className="mb-3 md:mb-4 bg-gray p-3 md:p-4 rounded-xl">
        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-secondary">
          <span>Started: {startDate || "Not set"}</span>
          {endDate && <span>Target: {endDate}</span>}
          {daysRemaining !== null && daysRemaining !== undefined && (
            <span>
              {daysRemaining < 0 ? "Overdue" : `${daysRemaining} days left`}
            </span>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-3 md:mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="p4 md:p3 text-secondary">Progress</span>
          <span className="p4 md:p3 font-semibold text-primary">
            {pct.toFixed(1)}%
          </span>
        </div>

        <div className="relative h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${meta.track} rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="p5 md:p4 text-secondary">{left}</span>
          <span className="p5 md:p4 text-secondary">{right}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Edit Button */}
        <PrimaryButton
          onClick={() => navigate(`/app/goals/${goal.goalId}/edit`)}
          className="w-full sm:w-auto"
        >
          Edit
        </PrimaryButton>

        {/* Goal Type Badge */}
        <div className="hidden sm:block px-2 md:px-3 py-1 bg-gray rounded-full self-center sm:self-auto">
          <span className="p5 md:p4 text-secondary font-medium">
            {goal.type.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
