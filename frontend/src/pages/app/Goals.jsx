import { useEffect, useState } from "react";
import { Plus, Target, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";
import Header from "../../components/dashboard/DashboardHeader";
import DashboardDateSelector from "../../components/dashboard/DashboardDateSelector";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import PrimaryIconButton from "../../components/buttons/PrimaryIconButton";
import NavTab from "../../components/ui/NavTab";
import ErrorCard from "../../components/ui/ErrorCard";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { getJson } from "../../utils/api";
import GoalRow from "./goal/GoalRow";

export default function Goals() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"

  // Load user's goals and progress
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const me = await getJson("/api/users/me");
        const progress = await getJson(`/api/goals/user/${me.userId}/progress`);
        console.log(progress);
        if (!ignore) setGoals(progress || []);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
        if (!ignore) setGoals([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  const handleAddGoal = () => navigate("/app/goals/add");

  // Filter goals based on selected filter
  const filteredGoals = goals.filter((goal) => {
    switch (filter) {
      case "active":
        return goal.status === "active";
      case "completed":
        return goal.status === "done" || goal.achieved;
      default:
        return true;
    }
  });

  // Get goal statistics
  const goalStats = {
    total: goals.length,
    active: goals.filter((g) => g.status === "active").length,
    completed: goals.filter((g) => g.status === "done" || g.achieved).length,
  };

  // Filter tabs for NavTab
  const filterTabs = [
    { key: "all", label: `All Goals (${goalStats.total})`, icon: Target },
    {
      key: "active",
      label: `Active Goals (${goalStats.active})`,
      icon: CheckCircle,
    },
    {
      key: "completed",
      label: `Completed Goals (${goalStats.completed})`,
      icon: CheckCircle,
    },
  ];

  return (
    <DashboardLayout>
      <Header
        title="Goal Tracking"
        leftSlot={
          <DashboardDateSelector
            value={selectedDate}
            onChange={(day) => setSelectedDate(day)}
          />
        }
        rightSlot={
          <>
            <div className="hidden lg:flex items-center gap-3">
              <PrimaryButton onClick={handleAddGoal}>
                ADD NEW GOAL
              </PrimaryButton>
            </div>
            <div className="flex lg:hidden">
              <PrimaryIconButton onClick={handleAddGoal}>
                <Plus className="w-6 h-6 text-primary" />
              </PrimaryIconButton>
            </div>
          </>
        }
      />
      {/* Filter Tabs */}
      {!loading && goals.length > 0 && (
        <div className="max-w-[360px] md:max-w-full mb-4 md:mb-6 -mx-4 md:mx-0 px-4 md:px-0 overflow-hidden">
          <NavTab tabs={filterTabs} active={filter} onChange={setFilter} />
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-3 md:space-y-4">
        {loading && <p className="p2 text-secondary">Loading goals…</p>}

        {!loading && goals.length === 0 && (
          <ErrorMessage
            message={"You don't have any goals yet. Create your first one!"}
          />
        )}

        {!loading && goals.length > 0 && filteredGoals.length === 0 && (
          <ErrorCard
            title="No Goals Found"
            message="No goals match the selected filter. Try changing the filter or create a new goal."
            variant="info"
          />
        )}

        {filteredGoals.map((goal) => (
          <GoalRow key={goal.goalId} goal={goal} />
        ))}
      </div>
    </DashboardLayout>
  );
}
