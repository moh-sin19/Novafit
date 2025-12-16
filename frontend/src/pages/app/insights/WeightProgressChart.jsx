//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import SelectInput from "../../../components/inputs/SelectInput";
import { getWeightProgress } from "../../../utils/insights-api";
import { format, parseISO } from "date-fns";
import { getJson } from "../../../utils/api";

const PERIOD_OPTIONS = [
  { value: "weekly", label: "Last 12 Weeks" },
  { value: "monthly", label: "Last 12 Months" },
];

export default function WeightProgressChart() {
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [response, me] = await Promise.all([
          getWeightProgress(period),
          getJson("/api/users/me")
        ]);
        
        // Get user's weight unit preference
        const userWeightUnit = me.unitWeight || "kg";
        setWeightUnit(userWeightUnit);
        
        // Sort by timestamp ascending
        const sortedData = [...response.data].sort(
          (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
        );

        // Create categories with date and time
        const categories = sortedData.map((d) => {
          const dt = parseISO(d.recordedAt);
          return format(dt, "MMM dd, HH:mm");
        });

        // Convert weights to user's preferred unit
        const convertWeight = (kg) => {
          if (userWeightUnit === "lb") {
            return (kg * 2.20462).toFixed(1);
          }
          return kg?.toFixed(1);
        };

        // Actual weights
        const actualWeights = sortedData.map((d) => convertWeight(d.actualWeight) || null);
        
        const series = [
          { 
            name: "Actual Weight", 
            data: actualWeights,
            type: "line"
          },
        ];

        const convertedTargetWeight = response.targetWeight 
          ? (userWeightUnit === "lb" ? response.targetWeight * 2.20462 : response.targetWeight)
          : null;

        setChartData({ 
          categories, 
          series, 
          sortedData, 
          targetWeight: convertedTargetWeight,
          actualWeights: actualWeights.map(w => parseFloat(w)).filter(w => !isNaN(w))
        });
      } catch (err) {
        setError(err.message || "Failed to load weight data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Calculate y-axis range with 50kg buffer
  const getYAxisRange = () => {
    const weights = [...(chartData.actualWeights || [])];
    if (chartData.targetWeight) {
      weights.push(chartData.targetWeight);
    }
    
    if (weights.length === 0) return { min: 0, max: 100 };
    
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    
    return {
      min: Math.max(0, minWeight - 50),
      max: maxWeight + 50
    };
  };

  const yAxisRange = getYAxisRange();

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      zoom: { enabled: true },
    },
    colors: ["#3b82f6"], // blue-500 for actual
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 5,
      hover: { size: 7 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: -45,
        style: { colors: "#6b7280", fontSize: "11px" },
      },
      tickAmount: Math.min(10, chartData.categories?.length || 0),
    },
    yaxis: {
      min: yAxisRange.min,
      max: yAxisRange.max,
      title: { text: `Weight (${weightUnit})`, style: { color: "#6b7280" } },
      labels: { 
        style: { colors: "#6b7280" },
        formatter: (val) => val?.toFixed(0) || ""
      },
      forceNiceScale: true,
    },
    annotations: chartData.targetWeight ? {
      yaxis: [
        {
          y: chartData.targetWeight,
          borderColor: "#ef4444",
          strokeDashArray: 5,
          borderWidth: 2,
          label: {
            text: "",  // Remove label from annotation
          }
        }
      ]
    } : {},
    tooltip: {
      theme: "light",
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = chartData.sortedData?.[dataPointIndex];
        if (!data) return "";
        
        const dt = parseISO(data.recordedAt);
        const dateStr = format(dt, "MMM dd, yyyy");
        const timeStr = format(dt, "HH:mm");
        const weight = series[seriesIndex][dataPointIndex];
        
        return `
          <div class="p-3">
            <div class="font-semibold text-gray-900">Actual Weight</div>
            <div class="text-gray-700 mt-1">${weight} ${weightUnit}</div>
            <div class="text-gray-500 text-sm mt-1">${dateStr}</div>
            <div class="text-gray-500 text-sm">${timeStr}</div>
          </div>
        `;
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#374151" },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 2,
      }
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        right: 40  // Add padding on the right for the target label
      }
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
          <h6 className="text-primary">Weight Progress</h6>
          <p className="p3 text-subtitle">
            Track your weight changes over time
          </p>
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
      
      <div className="relative">
        <Chart options={options} series={chartData.series} type="line" height={320} />
        
        {/* Target label positioned outside chart */}
        {chartData.targetWeight && (
          <div 
            className="absolute right-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm"
            style={{ 
              top: '50%',
              transform: 'translateY(-50%)',
              right: '8px'
            }}
          >
            Target: {chartData.targetWeight.toFixed(1)} {weightUnit}
          </div>
        )}
      </div>
    </div>
  );
}
