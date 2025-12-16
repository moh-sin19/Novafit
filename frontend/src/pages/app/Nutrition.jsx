//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import DashboardLayout from "../../layout/DashboardLayout";

import BreakfastIcon from "../../assets/icons/breakfast.svg";
import LunchIcon from "../../assets/icons/lunch.svg";
import DinnerIcon from "../../assets/icons/dinner.svg";
import SnackIcon from "../../assets/icons/snack.svg";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/dashboard/DashboardHeader";
import DashboardDateSelector from "../../components/dashboard/DashboardDateSelector";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import PrimaryIconButton from "../../components/buttons/PrimaryIconButton";
import AddButton from "../../components/buttons/AddButton";
import CaloriesDonut from "./nutrition/CaloriesDonut";
import MacroBreakdown from "./nutrition/MacroBreakdown";
import ErrorCard from "../../components/ui/ErrorCard";
import { getJson } from "../../utils/api";

// map icons to backend enum values
const ICON_MAP = {
  BREAKFAST: BreakfastIcon,
  LUNCH: LunchIcon,
  DINNER: DinnerIcon,
  SNACK: SnackIcon,
};

export default function Nutrition() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calorieGoal, setCalorieGoal] = useState(null); // Active calorie goal from backend
  const [loading, setLoading] = useState(true);

  const [mealTypes, setMealTypes] = useState([]); // from backend
  const [summary, setSummary] = useState(null);
  const [mealLogs, setMealLogs] = useState({}); // { breakfast: [...], lunch: [...], ... }

  // ----------------------------------------------------------------------
  // Load user's active calorie goal
  // ----------------------------------------------------------------------
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const me = await getJson("/api/users/me");
        const goals = await getJson(`/api/goals/user/${me.userId}/progress`);

        // Find all active calorie goals
        const activeCalorieGoals = goals.filter(
          (g) => g.type === "CALORIES_KCAL" && g.status === "active"
        );

        // If there are multiple active calorie goals (shouldn't happen with new validation),
        // use the most recent one (highest goalId)
        let selectedGoal = null;
        if (activeCalorieGoals.length > 0) {
          selectedGoal = activeCalorieGoals.reduce((latest, current) =>
            current.goalId > latest.goalId ? current : latest
          );

          // Log warning if multiple active goals exist
          if (activeCalorieGoals.length > 1) {
            console.warn(
              "Multiple active calorie goals found. Using the most recent one.",
              activeCalorieGoals
            );
          }
        }

        if (!ignore) {
          setCalorieGoal(selectedGoal);
        }
      } catch (err) {
        console.error("Failed to fetch calorie goal:", err);
        if (!ignore) setCalorieGoal(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  // ----------------------------------------------------------------------
  // Load meal types once from backend
  // ----------------------------------------------------------------------
  useEffect(() => {
    getJson("/api/nutrition/meal-types")
      .then((data) => setMealTypes(data || []))
      .catch((err) => {
        console.error("Failed to load meal types:", err);
        setMealTypes(["BREAKFAST", "LUNCH", "DINNER"]);
      });
  }, []);

  // ----------------------------------------------------------------------
  // Fetch summary + logs for the selected date
  // ----------------------------------------------------------------------
  const fetchDetailsForDate = async (day) => {
    function formatLocalYYYYMMDD(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    const dateStr = formatLocalYYYYMMDD(day);
    try {
      const [sum, logs] = await Promise.all([
        getJson(`/api/nutrition/summary/day?date=${dateStr}`),
        getJson(`/api/nutrition/food-logs?date=${dateStr}`),
      ]);

      setSummary(sum);

      // Group logs by meal type (case-insensitive)
      const grouped = {};
      mealTypes.forEach((t) => (grouped[t.toLowerCase()] = []));
      logs.forEach((l) => {
        const mealKey = (l.mealType || "").toLowerCase();
        if (grouped[mealKey]) grouped[mealKey].push(l);
      });
      setMealLogs(grouped);
    } catch (err) {
      console.error("Failed to fetch nutrition data:", err);
      setSummary(null);
      setMealLogs({});
    }
  };

  // Initial + on-date-change fetch (once meal types are loaded)
  useEffect(() => {
    if (mealTypes.length > 0) fetchDetailsForDate(selectedDate);
  }, [selectedDate, mealTypes]);

  const handleAddFood = (mealKey) => {
    navigate(`/app/nutrition/add?meal=${encodeURIComponent(mealKey)}`);
  };

  const handleTarget = () => {
    if (calorieGoal) {
      // Navigate to edit the existing goal
      navigate(`/app/goals/${calorieGoal.goalId}/edit`);
    } else {
      // Navigate to create a new goal
      navigate("/app/goals/add");
    }
  };

  // Parse macro goals from the notes field (format: "Carb: 250g | Protein: 120g | Fat: 70g")
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
      console.error("Failed to parse macro goals:", err);
      return defaults;
    }
  };

  const macroGoals = calorieGoal
    ? parseMacroGoals(calorieGoal.notes)
    : { protein: 120, carbs: 250, fat: 70 };

  return (
    <DashboardLayout>
      <Header
        title="Macro Tracking"
        leftSlot={
          <DashboardDateSelector
            value={selectedDate}
            onChange={(day) => setSelectedDate(day)}
          />
        }
        rightSlot={
          <>
            <div className="hidden lg:flex items-center gap-3">
              <PrimaryButton onClick={() => handleAddFood("")}>
                ADD FOOD
              </PrimaryButton>
              <SecondaryButton onClick={handleTarget}>
                {calorieGoal ? "EDIT TARGET" : "SET TARGET"}
              </SecondaryButton>
            </div>
            <div className="flex lg:hidden">
              <PrimaryIconButton onClick={() => handleAddFood("")}>
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </PrimaryIconButton>
            </div>
          </>
        }
      />

      {/* --- Summary Section --- */}
      {loading ? (
        <div className="card mb-6">
          <p className="p2 text-secondary">Loading nutrition data...</p>
        </div>
      ) : !calorieGoal ? (
        <div className="mb-6">
          <ErrorCard
            title="No Calorie Goal Set"
            message="You haven't set a daily calorie goal yet. Set a goal to track your progress and see detailed macro breakdowns."
            variant="warning"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Calories */}
          <div className="card lg:col-span-1">
            <h6 className="text-primary mb-1">Calories</h6>
            <p className="p3 text-subtitle">Remaining = Goal - Food</p>
            <div className="mt-3 flex items-center justify-center">
              <CaloriesDonut
                total={summary?.kcal ?? 0}
                goal={calorieGoal.targetValue ?? 2000}
              />
            </div>
          </div>

          {/* Macro */}
          <div className="card lg:col-span-2">
            <h6 className="text-primary mb-1">Macro</h6>
            <p className="p3 text-subtitle">Macro breakdown</p>

            <div className="mt-4">
              <MacroBreakdown
                protein={summary?.protein_g ?? 0}
                carbs={summary?.carbs_g ?? 0}
                fat={summary?.fat_g ?? 0}
                goals={macroGoals}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Meals Section --- */}
      <div className="space-y-3">
        {mealTypes.map((type) => {
          const key = type.toLowerCase();
          const label = type.charAt(0) + type.slice(1).toLowerCase();
          const icon = ICON_MAP[type] || BreakfastIcon;

          const logs = mealLogs[key] || [];
          const mealTotal = logs.reduce(
            (acc, l) => acc + (l.kcalSnapshot || 0),
            0
          );

          return (
            <div
              key={key}
              className="rounded-2xl border border-subtle overflow-hidden"
            >
              <div className="bg-base px-4 py-3 flex items-center justify-between border-b border-subtle">
                <div className="flex flex-row gap-4 items-center">
                  <img src={icon} alt={label} className="w-9 h-9" />
                  <div className="flex flex-col gap-0">
                    <p className="b1 text-primary">{label}</p>
                    <p className="p3 text-subtitle">{mealTotal} kcal</p>
                  </div>
                </div>

                <AddButton onClick={() => handleAddFood(key)} />
              </div>

              {/* Meal items from backend */}
              <div className="px-2 md:px-4 py-2 gap-3 space-y-1">
                {logs.length > 0 ? (
                  logs.map((f) => (
                    <div
                      key={f.log_id}
                      className="flex justify-between items-center"
                    >
                      <span className="p3 text-primary">
                        {f.name || "Unnamed Food"}
                      </span>
                      <span className="p3 text-subtitle">
                        {f.kcalSnapshot} kcal
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p3 text-primary">No foods logged yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
