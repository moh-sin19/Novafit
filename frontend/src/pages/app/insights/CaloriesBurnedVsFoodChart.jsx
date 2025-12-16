//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import SelectInput from "../../../components/inputs/SelectInput";
import { getCaloriesBurnedVsFood } from "../../../utils/insights-api";

const PERIOD_OPTIONS = [
  { value: "weekly", label: "Weekly Average" },
  { value: "monthly", label: "Monthly Average" },
];

export default function CaloriesBurnedVsFoodChart() {
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const getSubtitle = () => {
    if (period === "weekly") {
      return `Daily average for each of the last 5 weeks`;
    }
    return "Daily average for the last 6 months";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCaloriesBurnedVsFood(period);
        const categories = response.data.map((d) => d.period);
        const burnedData = response.data.map((d) => d.caloriesBurned?.toFixed(0) || 0);
        const consumedData = response.data.map((d) => d.caloriesConsumed?.toFixed(0) || 0);

        setChartData({
          categories,
          series: [
            { name: "Calories Burned", data: burnedData },
            { name: "Calories Consumed", data: consumedData },
          ],
        });
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#a3e635", "#c084fc"], // lime-400, purple-400
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Calories (kcal)", style: { color: "#6b7280" } },
      labels: { style: { colors: "#6b7280" } },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `${val} kcal` },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#374151" },
    },
  };

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h6 className="text-primary">Calories Burned vs Food</h6>
          <p className="p3 text-subtitle">{getSubtitle()}</p>
        </div>
        <div className="w-48">
          <SelectInput
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
            label=""
          />
        </div>
      </div>
      <Chart options={options} series={chartData.series} type="bar" height={320} />
    </div>
  );
}
