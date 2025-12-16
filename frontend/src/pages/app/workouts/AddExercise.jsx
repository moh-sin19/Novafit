import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, postJson } from "../../../utils/api";

// Display order + labels; actual IDs are resolved (or created) via the API
const STRENGTH_EXERCISES = [
  { id: 1, name: "Bench Press" },
  { id: 2, name: "Squat" },
  { id: 3, name: "Deadlift" },
  { id: 4, name: "Pull Ups" },
  { id: 5, name: "Shoulder Press" },
  { id: 6, name: "Barbell Row" },
];

const CARDIO_EXERCISES = [
  { id: 10, name: "Running" },
  { id: 11, name: "Jogging" },
  { id: 12, name: "Cycling" },
  { id: 13, name: "Swimming" },
  { id: 14, name: "Rowing" },
];

function getCurrentUserId() {
  const u = localStorage.getItem("userId");
  return u && u !== "undefined" ? Number(u) : null;
}
const isoToday = () => new Date().toISOString().slice(0, 10);

async function ensureTodayWorkout(userId) {
  const all = await getJson(`/api/workouts/user/${userId}`);
  const today = isoToday();
  const existing = all.find((w) => w.date === today);
  if (existing) return existing;

  return await postJson("/api/workouts", {
    userId,
    date: today,
    notes: "Auto-created for today",
  });
}

export default function AddExercise() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId] = useState(() => getCurrentUserId());
  const passedWorkoutId = location.state?.workoutId || null;

  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exerciseLookup, setExerciseLookup] = useState({});
  const [selectingId, setSelectingId] = useState(null);
  const modal = useModal();

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        if (passedWorkoutId) {
          const w = await getJson(`/api/workouts/${passedWorkoutId}`);
          setTodayWorkout(w);
        } else {
          const w = await ensureTodayWorkout(userId);
          setTodayWorkout(w);
        }
        const allExercises = await getJson("/api/exercises/all");
        const lookup = allExercises.reduce((acc, ex) => {
          if (ex?.name && ex?.exerciseId != null) {
            acc[ex.name.toLowerCase()] = ex.exerciseId;
          }
          return acc;
        }, {});
        setExerciseLookup(lookup);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, passedWorkoutId]);

  const goBack = () => navigate("/app/workouts");

  const ensureExerciseId = async (exercise) => {
    const key = exercise.name.toLowerCase();
    if (exerciseLookup[key]) {
      return exerciseLookup[key];
    }
    if (!userId) {
      throw new Error("You need to be signed in to create exercises.");
    }
    const created = await postJson("/api/exercises", {
      name: exercise.name,
      description: exercise.name,
      userId,
    });
    setExerciseLookup((prev) => ({
      ...prev,
      [key]: created.exerciseId,
    }));
    return created.exerciseId;
  };

  // 👉 pass id + name + workoutId to the correct form
  const goLogPage = (exercise, type) => {
    (async () => {
      try {
        setSelectingId(exercise.id);
        const exerciseId = await ensureExerciseId(exercise);
        const qs = new URLSearchParams();
        qs.set("exerciseId", exerciseId);
        qs.set("name", exercise.name);
        if (todayWorkout?.workoutId)
          qs.set("workoutId", todayWorkout.workoutId);

        if (type === "WEIGHT") {
          navigate(`/app/workouts/exercise/strength?${qs.toString()}`);
        } else {
          navigate(`/app/workouts/exercise/cardio?${qs.toString()}`);
        }
      } catch (err) {
        console.error("Failed to prepare exercise", err);
        modal.showError(
          "Failed to Prepare Exercise",
          err.message || "Could not prepare the exercise. Please try again."
        );
      } finally {
        setSelectingId(null);
      }
    })();
  };

  return (
    <DashboardLayout>
      <Header
        title="Workout Management"
        leftSlot={<h6 className="text-primary">Add Exercise</h6>}
        rightSlot={
          <SecondaryIconButton onClick={goBack}>
            <X className="w-5 h-5 text-primary" />
          </SecondaryIconButton>
        }
      />

      <div className="py-4 space-y-6">
        {/* Strength */}
        <h5 className="text-primary">Strength</h5>
        <div className="rounded-xl border border-subtle overflow-hidden bg-base">
          <div className="hidden md:grid grid-cols-[1.5fr_auto] px-5 py-3 border-b border-subtle bg-gray">
            <p className="p4 text-primary uppercase">Name</p>
            <p className="p4 text-primary uppercase text-right">Action</p>
          </div>
          <div>
            {loading ? (
              <p className="p3 text-subtitle px-4 py-3">Loading…</p>
            ) : (
              STRENGTH_EXERCISES.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`flex items-center justify-between px-5 py-3 ${
                    idx < STRENGTH_EXERCISES.length - 1
                      ? "border-b border-subtle"
                      : ""
                  }`}
                >
                  <p className="p3 text-secondary">{ex.name}</p>
                  <button
                    onClick={() => goLogPage(ex, "WEIGHT")}
                    disabled={selectingId === ex.id}
                    className="p3 text-lavender-500 font-semibold hover:text-lavender-600 hover:underline"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cardio */}
        <h5 className="text-primary">Cardio</h5>
        <div className="rounded-xl border border-subtle overflow-hidden bg-base mb-10">
          <div className="hidden md:grid grid-cols-[1.5fr_auto] px-5 py-3 border-b border-subtle bg-gray">
            <p className="p4 text-primary uppercase">Name</p>
            <p className="p4 text-primary uppercase text-right">Action</p>
          </div>
          <div>
            {loading ? (
              <p className="p3 text-subtitle px-4 py-3">Loading…</p>
            ) : (
              CARDIO_EXERCISES.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`flex items-center justify-between px-5 py-3 ${
                    idx < CARDIO_EXERCISES.length - 1
                      ? "border-b border-subtle"
                      : ""
                  }`}
                >
                  <p className="p3 text-secondary">{ex.name}</p>
                  <button
                    onClick={() => goLogPage(ex, "CARDIO")}
                    disabled={selectingId === ex.id}
                    className="p3 text-lavender-500 font-semibold hover:text-lavender-600 hover:underline"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
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
