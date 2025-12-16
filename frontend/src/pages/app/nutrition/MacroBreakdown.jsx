import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const f1 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

/**
 * MacroBreakdown
 * props:
 *  - protein (g)
 *  - carbs (g)
 *  - fat (g)
 *  - goals: { protein: number, carbs: number, fat: number }
 */
export default function MacroBreakdown({
  protein = 0,
  carbs = 0,
  fat = 0,
  goals = { protein: 120, carbs: 250, fat: 70 },
}) {
  // clamp helpers
  const clamp = (v) => Math.max(0, v);

  const pie = useMemo(() => {
    const total = clamp(protein) + clamp(carbs) + clamp(fat);
    const series =
      total === 0
        ? [0, 0, 0]
        : [
            +((protein / total) * 100).toFixed(1),
            +((carbs / total) * 100).toFixed(1),
            +((fat / total) * 100).toFixed(1),
          ];

    return {
      series,
      options: {
        chart: { type: "donut", sparkline: { enabled: true } },
        labels: ["Protein", "Carbs", "Fat"],
        // match your design palette
        colors: ["#45A9B2", "#D1E04C", "#7E55A3"],
        stroke: { width: 0 },
        legend: { show: false },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Math.round(val)}%`,
          style: { fontSize: "16px", fontWeight: 700, colors: ["#0B0E13"] },
          dropShadow: { enabled: false },
        },
        states: {
          //   active: { filter: { type: "none" } },
          //   hover: { filter: { type: "none" } },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: { size: "0%" },
          },
        },
        tooltip: { enabled: true },
      },
    };
  }, [protein, carbs, fat]);

  const rows = [
    {
      label: "Carbs",
      color: "bg-[#D1E04C]",
      value: clamp(carbs),
      goal: goals.carbs,
      labelColor: "text-[#7E8D1C]",
    },
    {
      label: "Fat",
      color: "bg-[#7E55A3]",
      value: clamp(fat),
      goal: goals.fat,
      labelColor: "text-[#7E55A3]",
    },
    {
      label: "Protein",
      color: "bg-[#45A9B2]",
      value: clamp(protein),
      goal: goals.protein,
      labelColor: "text-[#2CA3B0]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-6 items-center">
      {/* Pie */}
      <div className="hidden lg:col-span-3 lg:flex justify-center">
        <ReactApexChart
          options={pie.options}
          series={pie.series}
          type="donut"
          width={220}
          height={220}
        />
      </div>

      <div className="flex col-span-1 sm:col-span-3 lg:hidden justify-center">
        <ReactApexChart
          options={pie.options}
          series={pie.series}
          type="donut"
          width={180}
          height={180}
        />
      </div>

      {/* Bars */}
      <div className="sm:col-span-4 lg:col-span-4 space-y-4">
        {rows.map((r) => {
          const pct = r.goal > 0 ? Math.min(100, (r.value / r.goal) * 100) : 0;
          const left = Math.max(0, r.goal - r.value);

          return (
            <div key={r.label}>
              {/* header line */}
              <div className="flex items-baseline justify-between mb-2 gap-3">
                <span className={`sh3 ${r.labelColor} shrink-0`}>
                  {r.label}
                </span>
                <span className="p4 text-secondary grow text-right">
                  {f1.format(left)}g left{" "}
                  <span className="text-gray-400">
                    ({f1.format(r.value)}g/{f1.format(r.goal)}g)
                  </span>
                </span>
              </div>

              {/* progress bar */}
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-3 ${r.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
