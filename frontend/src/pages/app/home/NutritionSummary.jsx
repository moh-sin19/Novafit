import CaloriesDonut from "../nutrition/CaloriesDonut";
import MacroBreakdown from "../nutrition/MacroBreakdown";

/**
 * NutritionSummary - Displays calories and macro breakdown
 *
 * @param {object} calorieGoal - Active calorie goal
 * @param {object} nutritionSummary - Daily nutrition summary
 * @param {object} macroGoals - Macro goals (protein, carbs, fat)
 * @param {boolean} loading - Loading state
 */
export default function NutritionSummary({
  calorieGoal,
  nutritionSummary,
  macroGoals,
  loading,
}) {
  // Don't render if no calorie goal or still loading
  if (loading || !calorieGoal) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Calories */}
      <div className="card lg:col-span-1">
        <h6 className="text-primary mb-1">Calories</h6>
        <p className="p3 text-subtitle mb-4">Remaining = Goal - Food</p>
        <div className="flex items-center justify-center">
          <CaloriesDonut
            total={nutritionSummary?.kcal ?? 0}
            goal={calorieGoal.targetValue ?? 2000}
          />
        </div>
      </div>

      {/* Macro */}
      <div className="card lg:col-span-2">
        <h6 className="text-primary mb-1">Macro</h6>
        <p className="p3 text-subtitle mb-4">Macro breakdown</p>
        <MacroBreakdown
          protein={nutritionSummary?.protein_g ?? 0}
          carbs={nutritionSummary?.carbs_g ?? 0}
          fat={nutritionSummary?.fat_g ?? 0}
          goals={macroGoals}
        />
      </div>
    </div>
  );
}
