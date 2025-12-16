import React from "react";
import ReactApexChart from "react-apexcharts";

const COLORS = {
  carbs: "#D6E14F", // lime
  fat: "#7C5590", // purple-ish
  protein: "#7ECFD9", // cyan-ish
};

export default function MacroDonut({ kcal, macros, perc }) {
  // series by kcal share (must match labels order)
  const series = [perc.carbs, perc.fat, perc.protein].map((p) => +p.toFixed(2));

  const options = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: ["Carbs", "Fat", "Protein"],
    colors: [COLORS.carbs, COLORS.fat, COLORS.protein],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: true,
              label: "cal",
              fontSize: "12px",
              color: "#6B7280",
              formatter: () => Math.round(kcal).toString(),
            },
          },
        },
      },
    },
    tooltip: { enabled: false },
  };

  return (
    <div className="flex items-center gap-2 md:gap-8">
      <div className="w-24 h-24 md:w-40 md:h-40">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height="100%"
        />
      </div>

      <div className="space-y-3">
        <MacroRow
          color={COLORS.carbs}
          label="Carbs"
          value={`${Math.round(macros.carbs)}g`}
          percent={`${Math.round(perc.carbs)}%`}
        />
        <MacroRow
          color={COLORS.fat}
          label="Fat"
          value={`${Math.round(macros.fat)}g`}
          percent={`${Math.round(perc.fat)}%`}
        />
        <MacroRow
          color={COLORS.protein}
          label="Protein"
          value={`${Math.round(macros.protein)}g`}
          percent={`${Math.round(perc.protein)}%`}
        />
      </div>
    </div>
  );
}

function MacroRow({ color, label, value, percent }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-[84px] sh2" style={{ color }}>
        {label}
      </div>
      <div className="p3 text-secondary">
        {value} ({percent})
      </div>
    </div>
  );
}
