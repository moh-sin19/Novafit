import AddButton from "../../../components/buttons/AddButton";
import { MoreVertical } from "lucide-react";

export default function LoggedExerciseList({
  loading = false,
  workout,
  onRowClick,
  onMenuClick,
  onAddExercise,
}) {
  // if no workout or no exercises
  const exercises = workout?.exercises || [];

  return (
    <div className="rounded-2xl border border-subtle overflow-hidden mb-6">
      <div className="bg-base p-5 flex items-center justify-between border-b border-subtle">
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-col">
            <h6 className="text-primary">
              {workout ? "Logged Session" : "No session"}
            </h6>
          </div>
        </div>

        <AddButton onClick={onAddExercise} />
      </div>

      {loading ? (
        <p className="p3 text-subtitle px-4 py-4">Loading…</p>
      ) : exercises.length === 0 ? (
        <p className="p3 text-subtitle px-4 py-4">
          No exercises logged yet. Add one!
        </p>
      ) : (
        <div>
          {exercises.map((ex, idx) => {
            // build subtitle like: "3 sets, 10 reps, 45kg" or "30 minutes, 114 kcal"
            let subtitle = "No sets yet";
            const firstSet = ex.sets && ex.sets[0];

            if (ex.type === "WEIGHT" && ex.sets?.length) {
              subtitle = `${ex.sets.length} sets`;
              if (firstSet?.reps) subtitle += `, ${firstSet.reps} reps`;
              if (firstSet?.weight) subtitle += `, ${firstSet.weight}kg`;
            } else if (ex.type === "CARDIO" && ex.sets?.length) {
              subtitle = "";
              if (firstSet?.durationMin)
                subtitle += `${firstSet.durationMin} minutes`;
              if (firstSet?.caloriesBurned)
                subtitle += `${subtitle ? ", " : ""}${
                  firstSet.caloriesBurned
                } kcal`;
              if (firstSet?.distanceM)
                subtitle += `${subtitle ? ", " : ""}${(
                  firstSet.distanceM / 1000
                ).toFixed(1)} km`;
            }

            return (
              <div
                key={ex.sessionExerciseId || idx}
                className={`flex items-center justify-between px-4 py-4 ${
                  idx < exercises.length - 1 ? "border-b border-subtle" : ""
                }`}
              >
                <button
                  className="text-left"
                  onClick={() =>
                    onRowClick?.(ex.sessionExerciseId, workout?.workoutId)
                  }
                >
                  <p className="sh3 text-primary">{ex.exerciseName}</p>
                  <p className="p4 text-subtitle">{subtitle}</p>
                </button>

                <button
                  onClick={() =>
                    onMenuClick?.(ex.sessionExerciseId, workout?.workoutId)
                  }
                  className="p-2 rounded-full hover:bg-base/60"
                >
                  <MoreVertical className="w-4 h-4 text-primary" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
