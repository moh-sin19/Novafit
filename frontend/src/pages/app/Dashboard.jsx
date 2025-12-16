import { useEffect, useState } from "react";

import DashboardLayout from "../../layout/DashboardLayout";
import QuickActions from "./home/QuickActions";
import HeroBanner from "./home/HeroBanner";
import LatestWorkoutCard from "./home/LatestWorkoutCard";
import LatestFoodCard from "./home/LatestFoodCard";
import NutritionSummary from "./home/NutritionSummary";
import { getJson } from "../../utils/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date());

  // Data states
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [latestExercise, setLatestExercise] = useState(null);
  const [latestFood, setLatestFood] = useState(null);

  // Format date helper
  const formatLocalYYYYMMDD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Parse macro goals from notes
  const parseMacroGoals = (notes) => {
    const defaults = { protein: 120, carbs: 250, fat: 70 };
    if (!notes) return defaults;

    try {
      const carbMatch = notes.match(/Carb:\s*(\d+)g/i);
      const proteinMatch = notes.match(/Protein:\s*(\d+)g/i);
      const fatMatch = notes.match(/Fat:\s*(\d+)g/i);

      return {
        carbs: carbMatch ? parseInt(carbMatch[1]) : defaults.carbs,
        protein: proteinMatch ? parseInt(proteinMatch[1]) : defaults.protein,
        fat: fatMatch ? parseInt(fatMatch[1]) : defaults.fat,
      };
    } catch (err) {
      return defaults;
    }
  };

  // Load dashboard data
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const me = await getJson("/api/users/me");
        const dateStr = formatLocalYYYYMMDD(currentDate);

        // Fetch all data in parallel
        const [goals, nutritionData, workouts, foodLogs] = await Promise.all([
          getJson(`/api/goals/user/${me.userId}/progress`).catch(() => []),
          getJson(`/api/nutrition/summary/day?date=${dateStr}`).catch(
            () => null
          ),
          getJson(`/api/workouts/user/${me.userId}`).catch(() => []),
          getJson(`/api/nutrition/food-logs?date=${dateStr}`).catch(() => []),
        ]);

        if (ignore) return;

        // Find active calorie goal
        const activeCalorieGoal = goals.find(
          (g) => g.type === "CALORIES_KCAL" && g.status === "active"
        );

        // Get latest exercise (from most recent workout)
        // Find the most recent workout with exercises, then get the last exercise (highest sortOrder)
        let foundExercise = null;
        if (workouts && workouts.length > 0) {
          // Workouts are already sorted by date descending
          for (const workout of workouts) {
            if (workout.exercises && workout.exercises.length > 0) {
              // Get the exercise with highest sortOrder (most recently added)
              const sortedExercises = [...workout.exercises].sort(
                (a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)
              );
              foundExercise = {
                ...sortedExercises[0],
                workoutId: workout.workoutId || workout.sessionId,
                workoutDate: workout.date,
                workoutNotes: workout.notes,
              };
              break;
            }
          }
        }

        // Get latest food log (most recent)
        const latestFoodLog =
          foodLogs && foodLogs.length > 0
            ? foodLogs[foodLogs.length - 1]
            : null;

        console.log(foodLogs);

        setCalorieGoal(activeCalorieGoal || null);
        setNutritionSummary(nutritionData);
        setLatestExercise(foundExercise);
        setLatestFood(latestFoodLog);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => (ignore = true);
  }, [currentDate]);

  const macroGoals = calorieGoal
    ? parseMacroGoals(calorieGoal.notes)
    : { protein: 120, carbs: 250, fat: 70 };

  return (
    <DashboardLayout>
      {/* Quick Actions */}
      <QuickActions />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Latest Logged Exercise and Food */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LatestWorkoutCard exercise={latestExercise} loading={loading} />
        <LatestFoodCard food={latestFood} loading={loading} />
      </div>

      {/* Calories and Macro */}
      <NutritionSummary
        calorieGoal={calorieGoal}
        nutritionSummary={nutritionSummary}
        macroGoals={macroGoals}
        loading={loading}
      />
    </DashboardLayout>
  );
}
