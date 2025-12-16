//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
import DashboardLayout from "../../layout/DashboardLayout";
import CaloriesBurnedVsFoodChart from "./insights/CaloriesBurnedVsFoodChart";
import MacroBreakdownChart from "./insights/MacroBreakdownChart";
import CaloriesVsTargetChart from "./insights/CaloriesVsTargetChart";
import WeightProgressChart from "./insights/WeightProgressChart";

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CaloriesBurnedVsFoodChart />
        <MacroBreakdownChart />
        <CaloriesVsTargetChart />
        <WeightProgressChart />
      </div>
    </DashboardLayout>
  );
}
