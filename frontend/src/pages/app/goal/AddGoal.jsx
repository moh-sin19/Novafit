import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gauge, HeartPulse, Flame, Check, X } from "lucide-react";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import NavTab from "../../../components/ui/NavTab";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { postJson, getJson } from "../../../utils/api";

import WeightGoalForm from "./forms/WeightGoalForm";
import WorkoutGoalForm from "./forms/WorkoutGoalForm";
import CalorieGoalForm from "./forms/CalorieGoalForm";

const TABS = [
  { key: "weight", label: "Body Weight Goal", icon: Gauge },
  { key: "workouts", label: "Workout Frequency Goal", icon: HeartPulse },
  { key: "calories", label: "Calorie Intake Goal", icon: Flame },
];

// Map tab keys to goal types
const TAB_TO_GOAL_TYPE = {
  weight: "WEIGHT_KG",
  workouts: "WORKOUTS_PER_WEEK",
  calories: "CALORIES_KCAL",
};

export default function AddGoal() {
  const navigate = useNavigate();
  const modal = useModal();

  // single source of truth for the active tab
  const [tab, setTab] = useState("weight");
  const [confirmAction, setConfirmAction] = useState(null);
  const [existingGoals, setExistingGoals] = useState([]);

  // refs to call child.validateAndBuild()
  const weightRef = useRef(null);
  const workoutRef = useRef(null);
  const calorieRef = useRef(null);

  // Load existing active goals
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        const goals = await getJson(`/api/goals/user/${me.userId}/progress`);

        // Filter only active goals
        const activeGoals = goals.filter((g) => g.status === "active");

        if (!ignore) {
          setExistingGoals(activeGoals);
        }
      } catch (err) {
        console.error("Failed to fetch existing goals:", err);
        if (!ignore) setExistingGoals([]);
      }
    })();
    return () => (ignore = true);
  }, []);

  const onCancel = () => {
    setConfirmAction(() => () => navigate("/app/goals"));
    modal.showInfo("Discard changes?", "Your changes will be lost.", "DISCARD");
  };

  const onSave = async () => {
    try {
      let built;
      if (tab === "weight") built = await weightRef.current?.validateAndBuild();
      if (tab === "workouts")
        built = await workoutRef.current?.validateAndBuild();
      if (tab === "calories")
        built = await calorieRef.current?.validateAndBuild();

      if (!built || built.error)
        throw new Error(built?.error || "Invalid form");

      // Check if there's already an active goal of this type
      const goalType = TAB_TO_GOAL_TYPE[tab];
      const existingActiveGoal = existingGoals.find((g) => g.type === goalType);

      if (existingActiveGoal) {
        setConfirmAction(() => modal.close);
        modal.showError(
          "Active Goal Already Exists",
          `You already have an active ${tab} goal. Please complete or delete your existing goal before creating a new one, or edit the existing goal instead.`,
          "OKAY"
        );
        return;
      }

      await postJson("/api/goals", built.payload);

      setConfirmAction(() => () => navigate("/app/goals"));
      modal.showSuccess("Goal added", "Your goal has been saved.", "DONE");
    } catch (e) {
      setConfirmAction(() => modal.close);
      modal.showError(
        "Couldn't save goal",
        e?.message || "Please try again.",
        "OKAY"
      );
    }
  };

  return (
    <DashboardLayout>
      <Header
        title="Add Goal"
        leftSlot={<h6 className="text-primary">Add Goal</h6>}
        rightSlot={
          <div className="flex items-center gap-2 md:gap-3">
            <PrimaryIconButton onClick={onSave}>
              <Check className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </PrimaryIconButton>
            <SecondaryIconButton onClick={onCancel}>
              <X className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </SecondaryIconButton>
          </div>
        }
      />

      <section className="card max-w-full w-full space-y-4 md:space-y-6 overflow-hidden">
        {/* Tabs */}
        <div className="-mx-4 md:-mx-6 px-4 md:px-6">
          <NavTab tabs={TABS} active={tab} onChange={setTab} />
        </div>

        {/* Forms */}
        {tab === "weight" && <WeightGoalForm ref={weightRef} />}
        {tab === "workouts" && <WorkoutGoalForm ref={workoutRef} />}
        {tab === "calories" && <CalorieGoalForm ref={calorieRef} />}
      </section>

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        confirmText={modal.confirmText}
        onClose={modal.close}
        onConfirm={confirmAction || modal.close}
      />
    </DashboardLayout>
  );
}
