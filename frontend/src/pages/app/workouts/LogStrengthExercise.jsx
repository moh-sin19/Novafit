import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import NumberInput from "../../../components/inputs/NumberInput";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, postJson } from "../../../utils/api";

const isoToday = () => new Date().toISOString().slice(0, 10);
const getUserId = () => {
  const u = localStorage.getItem("userId");
  return u && u !== "undefined" ? Number(u) : null;
};

async function ensureWorkout(userId, workoutIdFromQS) {
  if (workoutIdFromQS) {
    return await getJson(`/api/workouts/${workoutIdFromQS}`);
  }
  const all = await getJson(`/api/workouts/user/${userId}`);
  const today = isoToday();
  const existing = all.find((w) => w.date === today);
  if (existing) return existing;

  return await postJson("/api/workouts", {
    userId,
    date: today,
    notes: "Auto-created for strength",
  });
}

export default function LogStrengthExercise() {
  const navigate = useNavigate();
  const location = useLocation();

  const qs = new URLSearchParams(location.search);
  const initialExerciseId = qs.get("exerciseId");
  const exerciseName = qs.get("name") || "Strength Exercise";
  const workoutIdQS = qs.get("workoutId");

  const [userId] = useState(() => getUserId());
  const [workout, setWorkout] = useState(null);
  const [exerciseId, setExerciseId] = useState(initialExerciseId);
  const [exerciseLookup, setExerciseLookup] = useState({});
  const [loadingLookup, setLoadingLookup] = useState(true);
  const [saving, setSaving] = useState(false);
  const modal = useModal();

  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("4.5");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const w = await ensureWorkout(userId, workoutIdQS);
      setWorkout(w);
    })();
  }, [userId, workoutIdQS]);

  useEffect(() => {
    (async () => {
      try {
        const allExercises = await getJson("/api/exercises/all");
        const byName = {};
        allExercises.forEach((ex) => {
          if (ex?.name && ex?.exerciseId != null) {
            byName[ex.name.toLowerCase()] = ex.exerciseId;
          }
        });
        setExerciseLookup(byName);
        if (!initialExerciseId && exerciseName) {
          const found = byName[exerciseName.toLowerCase()];
          if (found) setExerciseId(String(found));
        }
      } catch (err) {
        console.error("Failed to fetch exercise list", err);
      } finally {
        setLoadingLookup(false);
      }
    })();
  }, [initialExerciseId, exerciseName]);

  const onCancel = () => navigate("/app/workouts");

  const workoutSortOrder = useMemo(
    () => (workout?.exercises?.length || 0) + 1,
    [workout]
  );

  const ensureExerciseId = async () => {
    if (exerciseId) {
      const parsed = Number(exerciseId);
      if (!Number.isNaN(parsed)) return parsed;
    }
    if (loadingLookup) throw new Error("Still loading exercise catalogue");
    const key = exerciseName.toLowerCase();
    if (exerciseLookup[key]) {
      setExerciseId(String(exerciseLookup[key]));
      return exerciseLookup[key];
    }
    if (!userId) {
      throw new Error("You must be signed in to create an exercise.");
    }
    const created = await postJson("/api/exercises", {
      name: exerciseName,
      description: exerciseName,
      userId,
    });
    setExerciseLookup((prev) => ({
      ...prev,
      [key]: created.exerciseId,
    }));
    setExerciseId(String(created.exerciseId));
    return created.exerciseId;
  };

  const onSave = async () => {
    if (!workout) return;
    setSaving(true);
    try {
      const resolvedExerciseId = await ensureExerciseId();

      // 1) create session-exercise
      const ex = await postJson(
        `/api/workouts/${workout.workoutId}/exercises`,
        {
          exerciseId: resolvedExerciseId,
          type: "WEIGHT",
          sortOrder: workoutSortOrder,
          notes: exerciseName,
        }
      );

      // 2) create sets
      const totalSets = Number(sets) || 1;
      for (let i = 1; i <= totalSets; i++) {
        await postJson(
          `/api/workouts/${workout.workoutId}/exercises/${ex.sessionExerciseId}/sets`,
          {
            setOrder: i,
            reps: reps ? Number(reps) : null,
            weight: weight ? Number(weight) : null,
          }
        );
      }

      modal.showSuccess(
        "Exercise Logged",
        "Your strength exercise has been logged successfully."
      );
      setTimeout(() => navigate("/app/workouts"), 1500);
    } catch (err) {
      console.error("Failed to log strength:", err);
      modal.showError(
        "Log Failed",
        err.message || "Could not log the exercise. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Header
        title="Workout Management"
        leftSlot={<h6 className="text-primary">Add Strength Exercise</h6>}
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
            <h5 className="text-primary">{exerciseName}</h5>
            <p className="p3 text-subtitle">
              Log your strength exercise details below.
            </p>
          </div>
          <div className="space-y-3">
            <NumberInput
              label="Number of Sets"
              value={sets}
              onChange={setSets}
              min={1}
              step={1}
            />

            <NumberInput
              label="Repetitions / Set"
              value={reps}
              onChange={setReps}
              min={1}
              step={1}
              isRequired={false}
            />

            <NumberInput
              label="Weight per Set (kg)"
              value={weight}
              onChange={setWeight}
              min={0}
              step={0.5}
              isRequired={false}
            />
          </div>
        </div>
      </section>
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        confirmText={modal.confirmText}
        onClose={modal.close}
        onConfirm={modal.close}
      />
    </DashboardLayout>
  );
}
