import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

export default function CaloriesDonut({ total = 0, goal = 3000 }) {
  const consumed = Math.max(0, Math.min(total, goal));
  const remaining = Math.max(0, goal - consumed);

  const { series, options } = useMemo(() => {
    return {
      series: [consumed, remaining],
      options: {
        chart: { type: "donut", sparkline: { enabled: true } },
        labels: ["Consumed", "Remaining"],
        colors: ["#030712", "#D1D5DB"], // dark = consumed, light = remaining
        stroke: { width: 0 },
        legend: { show: false },
        dataLabels: { enabled: false },
        tooltip: { enabled: true }, // disable hover tooltip color changes
        states: {
          hover: { filter: { type: "none" } }, // prevent hover dimming
          active: { filter: { type: "none" } },
        },
        plotOptions: {
          pie: {
            expandOnClick: false, // prevent slice popout
            donut: { size: "70%" },
          },
        },
      },
    };
  }, [consumed, remaining]);

  return (
    <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] grid place-items-center">
      <div className="hidden lg:flex">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width={220}
          height={220}
        />
      </div>

      <div className="flex lg:hidden">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width={180}
          height={180}
        />
      </div>

      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h3 className="text-primary leading-none mt-2">{remaining}</h3>
        <p className="p2 text-secondary mt-1">remaining</p>
      </div>
    </div>
  );
}
