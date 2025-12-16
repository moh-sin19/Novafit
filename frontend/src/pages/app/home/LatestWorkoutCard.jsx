import { useNavigate } from "react-router-dom";
import AddButton from "../../../components/buttons/AddButton";

/**
 * LatestWorkoutCard - Displays the most recent exercise
 *
 * @param {object} exercise - Exercise data
 * @param {boolean} loading - Loading state
 */
export default function LatestWorkoutCard({ exercise, loading }) {
  const navigate = useNavigate();

  // Calculate exercise stats
  const getExerciseStats = (exercise) => {
    if (!exercise || !exercise.sets || exercise.sets.length === 0) {
      return null;
    }

    const stats = {
      sets: exercise.sets.length,
      calories: 0,
      duration: 0,
      reps: null,
      weight: null,
    };

    exercise.sets.forEach((set) => {
      if (set.caloriesBurned) stats.calories += set.caloriesBurned;
      if (set.durationMin) stats.duration += set.durationMin;
      if (set.reps && !stats.reps) stats.reps = set.reps;
      if (set.weight && !stats.weight) stats.weight = set.weight;
    });

    stats.calories = Math.round(stats.calories);
    stats.duration = Math.round(stats.duration);

    return stats;
  };

  const stats = getExerciseStats(exercise);
  const exerciseType = exercise?.type || "";

  const handleClick = () => {
    if (exercise?.sessionExerciseId && exercise?.workoutDate) {
      const type = exerciseType === "CARDIO" ? "cardio" : "strength";
      navigate(
        `/app/workouts/exercise/edit/${type}?sessionExerciseId=${
          exercise.sessionExerciseId
        }&workoutId=${exercise.workoutId || ""}`
      );
    }
  };

  return (
    <div className="rounded-2xl border border-subtle overflow-hidden">
      <div className="bg-base p-4 flex items-center justify-between border-b border-subtle">
        <h6 className="text-primary">Latest Logged Exercise</h6>
        <AddButton onClick={() => navigate("/app/workouts/exercise/new")} />
      </div>
      <div className="p-4">
        {loading ? (
          <p className="p2 text-secondary">Loading...</p>
        ) : exercise ? (
          <div
            className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between">
              <p className="sh3 text-primary font-semibold">
                {exercise.exerciseName || "Exercise"}
              </p>
              <span className="p2 text-subtitle uppercase">
                {exerciseType === "CARDIO" ? "Cardio" : "Strength"}
              </span>
            </div>
          </div>
        ) : (
          <p className="p2 text-secondary">No exercises logged yet.</p>
        )}
      </div>
    </div>
  );
}
