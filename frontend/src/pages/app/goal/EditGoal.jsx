import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";

import WeightGoalForm from "./forms/WeightGoalForm";
import WorkoutGoalForm from "./forms/WorkoutGoalForm";
import CalorieGoalForm from "./forms/CalorieGoalForm";

import { getJson, putJson, deleteJson, postJson } from "../../../utils/api";

// Helper function to determine which form to show based on goal type
const getFormComponent = (type) => {
  switch (type) {
    case "WEIGHT_KG":
      return "weight";
    case "WORKOUTS_PER_WEEK":
      return "workouts";
    case "CALORIES_KCAL":
      return "calories";
    default:
      return "weight";
  }
};

export default function EditGoal() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const modal = useModal();

  // current goal from backend
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUserGoals, setAllUserGoals] = useState([]);

  const [confirmAction, setConfirmAction] = useState(null);

  // ref to the current form
  const formRef = useRef(null);

  // --- Load goal and all user goals on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        const [g, allGoals] = await Promise.all([
          getJson(`/api/goals/${goalId}/progress`),
          getJson(`/api/goals/user/${me.userId}/progress`),
        ]);

        console.log("Current goal:", g);
        console.log("All user goals:", allGoals);

        if (ignore) return;
        setGoal(g);
        setAllUserGoals(allGoals);
      } catch (e) {
        modal.showError("Couldn't load goal", "Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => (ignore = true);
  }, [goalId]); // eslint-disable-line

  // ----- Actions
  const onCancel = () => {
    setConfirmAction(() => () => navigate("/app/goals"));
    modal.showInfo("Discard changes?", "Your changes will be lost.", "DISCARD");
  };

  const onSave = async () => {
    try {
      const built = await formRef.current?.validateAndBuild();

      if (!built || built.error)
        throw new Error(built?.error || "Invalid form");

      // Check if there's another active goal of the same type
      // (excluding the current goal being edited)
      const otherActiveGoalOfSameType = allUserGoals.find(
        (g) =>
          g.type === goal.type &&
          g.status === "active" &&
          g.goalId !== parseInt(goalId)
      );

      if (otherActiveGoalOfSameType && goal.status === "active") {
        modal.showError(
          "Duplicate Active Goal",
          `You already have another active ${goal.type
            .replace(/_/g, " ")
            .toLowerCase()} goal. Please complete or delete the other goal first.`,
          "OKAY"
        );
        return;
      }

      // According to API doc, PUT /api/goals/{goalId} accepts all fields as optional
      // Merge the form payload with the existing goal data to ensure all fields are present
      const payload = {
        type: goal.type,
        frequency: built.payload.frequency || goal.frequency,
        targetValue: built.payload.targetValue,
        startDate: built.payload.startDate,
        endDate: built.payload.endDate || null,
        status: goal.status, // Keep existing status
        description: built.payload.description || null,
        notes: built.payload.notes || null,
      };

      console.log("Updating goal with payload:", payload);

      await putJson(`/api/goals/${goalId}`, payload);

      modal.showSuccess(
        "Goal updated",
        "Your changes have been saved.",
        "DONE"
      );

      // Reload the goal data after successful update
      const updatedGoal = await getJson(`/api/goals/${goalId}/progress`);
      setGoal(updatedGoal);
      setTimeout(() => navigate("/app/goals"), 1000);
    } catch (e) {
      console.error("Error updating goal:", e);
      modal.showError("Couldn't save goal", e?.message || "Please try again.");
    }
  };

  const onDelete = async () => {
    try {
      await deleteJson(`/api/goals/${goalId}`);
      modal.showSuccess("Goal deleted", "The goal has been removed.", "DONE");
      // Navigate back to goals list after successful deletion
      setTimeout(() => navigate("/app/goals"), 1000);
    } catch (e) {
      modal.showError(
        "Couldn't delete goal",
        e?.message || "Please try again."
      );
    }
  };

  const onComplete = async () => {
    try {
      await postJson(`/api/goals/${goalId}/complete`, {});
      modal.showSuccess(
        "Goal completed",
        "Congratulations! You've achieved your goal.",
        "DONE"
      );
      // Navigate back to goals list after successful completion
      setTimeout(() => navigate("/app/goals"), 1000);
    } catch (e) {
      modal.showError(
        "Couldn't complete goal",
        e?.message || "Please try again."
      );
    }
  };

  const handleCompleteConfirm = () => {
    setConfirmAction(() => onComplete);
    modal.show({
      type: "info",
      title: "Complete this goal?",
      description: "Mark this goal as achieved.",
      confirmText: "COMPLETE",
    });
  };

  const handleDeleteConfirm = () => {
    setConfirmAction(() => onDelete);
    modal.show({
      type: "error",
      title: "Delete this goal?",
      description: "This action cannot be undone.",
      confirmText: "DELETE",
    });
  };

  return (
    <DashboardLayout>
      <Header
        title="Edit Goal"
        leftSlot={<h6 className="text-primary">Edit Goal</h6>}
        rightSlot={
          <div className="flex items-center gap-2 md:gap-3">
            <PrimaryIconButton onClick={onSave} aria-label="Save goal">
              <Check className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </PrimaryIconButton>
            <SecondaryIconButton onClick={onCancel} aria-label="Cancel">
              <X className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </SecondaryIconButton>
          </div>
        }
      />

      <section className="card max-w-full overflow-hidden w-full space-y-4 md:space-y-6">
        {/* Show the appropriate form based on goal type */}
        {loading ? (
          <p className="p2 text-secondary">Loading…</p>
        ) : goal ? (
          <>
            {getFormComponent(goal.type) === "weight" && (
              <WeightGoalForm ref={formRef} initial={goal} mode="edit" />
            )}
            {getFormComponent(goal.type) === "workouts" && (
              <WorkoutGoalForm ref={formRef} initial={goal} mode="edit" />
            )}
            {getFormComponent(goal.type) === "calories" && (
              <CalorieGoalForm ref={formRef} initial={goal} mode="edit" />
            )}
          </>
        ) : (
          <p className="p2 text-secondary">Goal not found</p>
        )}

        {/* Action buttons */}
        {!loading && goal && (
          <div className="flex flex-col sm:flex-row gap-3">
            {goal.status === "active" && (
              <PrimaryButton
                onClick={handleCompleteConfirm}
                className="w-full sm:w-auto"
              >
                COMPLETE GOAL
              </PrimaryButton>
            )}
            <SecondaryButton
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto"
            >
              DELETE
            </SecondaryButton>
          </div>
        )}
      </section>

      {/* Modal */}
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
