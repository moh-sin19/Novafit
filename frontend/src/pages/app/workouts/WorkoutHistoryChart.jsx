import ReactApexChart from "react-apexcharts";
import { useMemo } from "react";

export default function WorkoutHistoryChart({ workouts }) {
  const chartData = useMemo(() => {
    const last = (workouts || [])
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(-7);

    const labels = last.map((w) => w.date.slice(5));
    const volume = last.map((w) => {
      let v = 0;
      (w.exercises || []).forEach((ex) => {
        (ex.sets || []).forEach((s) => {
          if (s.weight && s.reps) v += s.weight * s.reps;
        });
      });
      return Math.round(v);
    });
    const minutes = last.map((w) => {
      let m = 0;
      (w.exercises || []).forEach((ex) => {
        (ex.sets || []).forEach((s) => {
          if (s.durationMin) m += s.durationMin;
        });
      });
      return Math.round(m);
    });

    return {
      series: [
        { name: "Volume", data: volume },
        { name: "Minutes", data: minutes },
      ],
      options: {
        chart: { type: "area", toolbar: { show: false }, height: 260 },
        stroke: { curve: "smooth", width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
          categories: labels.length
            ? labels
            : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        colors: ["#4395A3", "#743B93"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 80, 100],
          },
        },
        grid: { borderColor: "#EEF0F3" },
        legend: { position: "top", horizontalAlign: "right" },
      },
    };
  }, [workouts]);

  return (
    <div className="card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h6 className="text-primary">Workout Session History</h6>
          <p className="p3 text-subtitle">Volume Vs Minutes</p>
        </div>
        <div className="rounded-lg border border-subtle px-3 py-1 text-sm text-subtitle">
          Weekly
        </div>
      </div>
      <div className="px-2 py-4">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={260}
        />
      </div>
    </div>
  );
}
