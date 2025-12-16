//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getMacroBreakdown } from "../../../utils/insights-api";
import { getJson } from "../../../utils/api";

export default function MacroBreakdownChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [macroData, setMacroData] = useState({
    percentages: [],
    labels: [],
    totals: { carbs: 0, protein: 0, fat: 0 },
  });
  const [macroGoals, setMacroGoals] = useState({ protein: 120, carbs: 250, fat: 70 });

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
      console.error("Failed to parse macro goals:", err);
      return defaults;
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch macro breakdown and user info in parallel
        const [macroResponse, me] = await Promise.all([
          getMacroBreakdown(),
          getJson("/api/users/me"),
        ]);

        if (ignore) return;

        // Fetch user's goals
        const goals = await getJson(`/api/goals/user/${me.userId}/progress`);

        if (ignore) return;

        // Find active calorie goal
        const calorieGoal = goals.find(
          (g) => g.type === "CALORIES_KCAL" && g.status === "active"
        );

        const parsedGoals = calorieGoal
          ? parseMacroGoals(calorieGoal.notes)
          : { protein: 120, carbs: 250, fat: 70 };

        setMacroGoals(parsedGoals);
        setMacroData({
          percentages: [
            macroResponse.carbsPercentage || 0,
            macroResponse.proteinPercentage || 0,
            macroResponse.fatPercentage || 0,
          ],
          labels: ["Carbs", "Protein", "Fat"],
          totals: {
            carbs: macroResponse.totalCarbs || 0,
            protein: macroResponse.totalProtein || 0,
            fat: macroResponse.totalFat || 0,
          },
        });
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load macro data:", err);
          setError(err.message || "Failed to load macro data");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const options = {
    chart: {
      type: "pie",
      fontFamily: "Inter, sans-serif",
    },
    labels: macroData.labels,
    colors: ["#D1E04C", "#45A9B2", "#7E55A3"], // carbs (lime-yellow), protein (teal), fat (purple)
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "16px",
        fontWeight: "700",
        colors: ["#111827"],
        fontFamily: "Inter, sans-serif",
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val, { seriesIndex }) => {
          const keys = ["carbs", "protein", "fat"];
          const grams = macroData.totals[keys[seriesIndex]] || 0;
          return `${val.toFixed(1)}% (${grams.toFixed(1)}g)`;
        },
      },
    },
  };

  const macros = [
    {
      label: "Carbs",
      color: "bg-[#D1E04C]",
      value: macroData.totals.carbs || 0,
      goal: macroGoals.carbs,
      textColor: "text-[#9BA826]",
    },
    {
      label: "Protein",
      color: "bg-[#45A9B2]",
      value: macroData.totals.protein || 0,
      goal: macroGoals.protein,
      textColor: "text-[#2A7580]",
    },
    {
      label: "Fat",
      color: "bg-[#7E55A3]",
      value: macroData.totals.fat || 0,
      goal: macroGoals.fat,
      textColor: "text-[#5D3D7A]",
    },
  ];

  if (loading) {
    return (
      <div className="card h-[400px] flex items-center justify-center">
        <p className="p2 text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-[400px] flex items-center justify-center">
        <p className="p2 text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h6 className="text-primary">Macro Breakdown</h6>
        <p className="p3 text-subtitle">
          Average macros consumed this month
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Pie Chart */}
        <div className="flex justify-center">
          <Chart
            options={options}
            series={macroData.percentages}
            type="pie"
            width={220}
            height={220}
          />
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {macros.map((macro) => {
            const percentage =
              macro.goal > 0
                ? Math.min(100, (macro.value / macro.goal) * 100)
                : 0;
            const remaining = Math.max(0, macro.goal - macro.value);

            return (
              <div key={macro.label}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className={`sh3 ${macro.textColor}`}>
                    {macro.label}
                  </span>
                  <span className="p4 text-secondary">
                    {remaining.toFixed(1)}g left{" "}
                    <span className="text-gray-400">
                      ({macro.value.toFixed(1)}g/{macro.goal}g)
                    </span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-3 ${macro.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
