import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, Trash2, Clock as ClockIcon } from "lucide-react";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import NumberInput from "../../../components/inputs/NumberInput";
import TextInput from "../../../components/inputs/TextInput";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, putJson, deleteJson } from "../../../utils/api";

export default function EditCardioExercise() {
  const navigate = useNavigate();
  const location = useLocation();

  const qs = new URLSearchParams(location.search);
  const sessionExerciseId = qs.get("sessionExerciseId");
  const workoutId = qs.get("workoutId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const modal = useModal();

  const [minutes, setMinutes] = useState("");
  const [calories, setCalories] = useState("");
  const [timeText, setTimeText] = useState("9:00");

  useEffect(() => {
    if (!sessionExerciseId) {
      navigate("/app/workouts");
      return;
    }

    (async () => {
      try {
        const ex = await getJson(
          `/api/workouts/exercises/${sessionExerciseId}`
        );
        setExercise(ex);

        // Set initial values from existing sets
        if (ex.sets && ex.sets.length > 0) {
          const firstSet = ex.sets[0];
          setMinutes(firstSet.durationMin ? String(firstSet.durationMin) : "");
          setCalories(
            firstSet.caloriesBurned ? String(firstSet.caloriesBurned) : ""
          );
        }
      } catch (err) {
        console.error("Failed to load exercise:", err);
        modal.showError(
          "Failed to load exercise",
          err.message ||
            "Could not load the exercise details. Please try again."
        );
        setTimeout(() => navigate("/app/workouts"), 2000);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionExerciseId, navigate]);

  const onCancel = () => navigate("/app/workouts");

  const onSave = async () => {
    if (!exercise) return;
    setSaving(true);
    try {
      const setsData = [
        {
          setOrder: 1,
          reps: null,
          weight: null,
          rpe: null,
          durationMin: minutes ? Number(minutes) : null,
          distanceM: null,
          caloriesBurned: calories ? Number(calories) : null,
        },
      ];

      await putJson(`/api/workouts/exercises/${sessionExerciseId}`, {
        notes: exercise.notes || exercise.exerciseName,
        sortOrder: exercise.sortOrder,
        sets: setsData,
      });

      modal.showSuccess(
        "Exercise Updated",
        "Your cardio exercise has been updated successfully."
      );
      setTimeout(() => navigate("/app/workouts"), 1500);
    } catch (err) {
      console.error("Failed to update cardio exercise:", err);
      modal.showError(
        "Update Failed",
        err.message || "Could not update the exercise. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!exercise) return;
    setIsDeleteConfirmation(false);
    modal.close();
    setDeleting(true);
    try {
      await deleteJson(`/api/workouts/exercises/${sessionExerciseId}`);
      modal.showSuccess(
        "Exercise Deleted",
        `"${exercise.exerciseName}" has been removed from your workout.`
      );
      setTimeout(() => navigate("/app/workouts"), 1500);
    } catch (err) {
      console.error("Failed to delete exercise:", err);
      modal.showError(
        "Delete Failed",
        err.message || "Could not delete the exercise. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsDeleteConfirmation(false);
    modal.close();
  };

  const onDelete = () => {
    if (!exercise) return;
    setIsDeleteConfirmation(true);
    modal.show({
      type: "error",
      title: "Delete Exercise?",
      description: `Are you sure you want to delete "${exercise.exerciseName}"? This action cannot be undone.`,
      confirmText: "DELETE",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Header
          title="Workout Management"
          leftSlot={<h6 className="text-primary">Loading...</h6>}
        />
      </DashboardLayout>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <DashboardLayout>
      <Header
        title="Workout Management"
        leftSlot={<h6 className="text-primary">Edit Cardio Exercise</h6>}
        rightSlot={
          <div className="flex items-center gap-3">
            <PrimaryIconButton onClick={onSave} disabled={saving}>
              <Check className="w-6 h-6 text-primary" />
            </PrimaryIconButton>
            <SecondaryIconButton onClick={onCancel}>
              <X className="w-6 h-6 text-primary" />
            </SecondaryIconButton>
          </div>
        }
      />

      <section className="w-full">
        <div className="card mt-4 space-y-8">
          <div className="flex flex-col gap-2">
            <h5 className="text-primary">{exercise.exerciseName}</h5>
            <p className="p3 text-subtitle">
              Edit your cardio session details below.
            </p>
          </div>
          <div className="space-y-3">
            <NumberInput
              label="Minutes Performed"
              value={minutes}
              onChange={setMinutes}
              min={0}
              step={1}
            />

            <NumberInput
              label="Calories Burned"
              value={calories}
              onChange={setCalories}
              min={0}
              step={1}
              isRequired={false}
            />

            <TextInput
              label="Time"
              value={timeText}
              onChange={setTimeText}
              rightIcon={<ClockIcon className="w-4 h-4 text-secondary" />}
              placeholder="e.g. 09:00"
              isRequired={false}
            />
          </div>
          <PrimaryButton onClick={onDelete} disabled={deleting}>
            Delete
          </PrimaryButton>
        </div>
      </section>
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        confirmText={modal.confirmText}
        onClose={handleModalClose}
        onConfirm={isDeleteConfirmation ? handleDeleteConfirm : modal.close}
      />
    </DashboardLayout>
  );
}
