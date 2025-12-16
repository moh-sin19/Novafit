import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardLayout from "../../../layout/DashboardLayout";
import DashboardDateSelector from "../../../components/dashboard/DashboardDateSelector";
import Header from "../../../components/dashboard/DashboardHeader";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import { Plus } from "lucide-react";

import { getJson, postJson } from "../../../utils/api";
import WorkoutSummaryCards from "./WorkoutSummaryCards";
import LoggedSessionList from "./LoggedSessionList";
import WorkoutHistoryChart from "./WorkoutHistoryChart";

// ---- helpers ----
const getUserId = () => {
  const u = localStorage.getItem("userId");
  return u && u !== "undefined" ? Number(u) : null;
};
const toIso = (d) => d.toISOString().slice(0, 10);

async function ensureSessionForDate(userId, isoDate) {
  const all = await getJson(`/api/workouts/user/${userId}`);
  const existing = all.find((w) => w.date === isoDate);
  if (existing) return { session: existing, all };

  const created = await postJson("/api/workouts", {
    userId,
    date: isoDate,
    notes: "Auto-created for this day",
  });
  const refreshed = await getJson(`/api/workouts/user/${userId}`);
  return { session: created, all: refreshed };
}

export default function Workouts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId] = useState(() => getUserId());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const prevLocationRef = useRef(location.pathname);

  // initial load
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const isoToday = toIso(new Date());
        const { session, all } = await ensureSessionForDate(userId, isoToday);
        setAllWorkouts(all || []);
        setCurrentWorkout(session);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  // Refresh function
  const refreshWorkout = async () => {
    if (!userId) return;
    const iso = toIso(selectedDate);
    setLoading(true);
    try {
      const all = await getJson(`/api/workouts/user/${userId}`);
      setAllWorkouts(all || []);
      const existing = all.find((w) => w.date === iso);
      if (existing) {
        // Reload full workout details
        const workout = await getJson(`/api/workouts/${existing.workoutId}`);
        setCurrentWorkout(workout);
      } else {
        setCurrentWorkout(null);
      }
    } catch (err) {
      console.error("Failed to refresh workout:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh when returning from edit/delete
  useEffect(() => {
    const wasOnEditPage = prevLocationRef.current?.includes("/exercise/edit");
    const isOnWorkoutsPage = location.pathname === "/app/workouts";

    // Only refresh if we just came back from an edit page
    if (wasOnEditPage && isOnWorkoutsPage) {
      refreshWorkout();
    }

    prevLocationRef.current = location.pathname;
  }, [location.pathname, userId, selectedDate]);

  // when user picks another date
  useEffect(() => {
    if (!userId) return;
    const run = async () => {
      const iso = toIso(selectedDate);
      // try local first
      const exist = allWorkouts.find((w) => w.date === iso);
      if (exist) {
        setCurrentWorkout(exist);
        return;
      }
      setLoading(true);
      try {
        const { session, all } = await ensureSessionForDate(userId, iso);
        setCurrentWorkout(session);
        setAllWorkouts(all || []);
      } finally {
        setLoading(false);
      }
    };
    // only run after first load
    if (allWorkouts.length || !loading) run();
  }, [selectedDate, userId]);

  // metrics from current workout
  const { totalCalories, totalDuration, totalSets } = useMemo(() => {
    if (!currentWorkout || !currentWorkout.exercises)
      return { totalCalories: 0, totalDuration: 0, totalSets: 0 };

    let cal = 0,
      dur = 0,
      sets = 0;
    currentWorkout.exercises.forEach((ex) => {
      (ex.sets || []).forEach((s) => {
        sets += 1;
        if (s.caloriesBurned) cal += s.caloriesBurned;
        if (s.durationMin) dur += s.durationMin;
      });
    });
    return {
      totalCalories: Math.round(cal),
      totalDuration: Math.round(dur),
      totalSets: sets,
    };
  }, [currentWorkout]);

  const onAddExercise = () => {
    navigate("/app/workouts/exercise/new", {
      state: {
        workoutId: currentWorkout?.workoutId,
        date: toIso(selectedDate),
      },
    });
  };

  return (
    <DashboardLayout>
      <Header
        title="Workout Management"
        leftSlot={
          <DashboardDateSelector
            value={selectedDate}
            onChange={(d) => setSelectedDate(d)}
          />
        }
        rightSlot={
          <>
            <div className="hidden md:flex items-center gap-3">
              <PrimaryButton onClick={onAddExercise}>
                ADD EXERCISE
              </PrimaryButton>
            </div>
            <div className="flex md:hidden">
              <PrimaryIconButton onClick={onAddExercise}>
                <Plus className="w-6 h-6 text-primary" />
              </PrimaryIconButton>
            </div>
          </>
        }
      />

      {/* summary cards  */}
      <WorkoutSummaryCards
        loading={loading}
        calories={totalCalories}
        duration={totalDuration}
        sets={totalSets}
      />

      {/* logged session for selected day */}
      <LoggedSessionList
        loading={loading}
        workout={currentWorkout}
        onRowClick={(sessionExerciseId, workoutId) => {
          // Find the exercise to determine its type
          const exercise = currentWorkout?.exercises?.find(
            (ex) => ex.sessionExerciseId === Number(sessionExerciseId)
          );
          if (exercise) {
            const type = exercise.type === "CARDIO" ? "cardio" : "strength";
            navigate(
              `/app/workouts/exercise/edit/${type}?sessionExerciseId=${sessionExerciseId}&workoutId=${workoutId}`
            );
          }
        }}
        onMenuClick={(sessionExerciseId, workoutId) => {
          // Handle menu click (for future use, e.g., quick actions)
          const exercise = currentWorkout?.exercises?.find(
            (ex) => ex.sessionExerciseId === Number(sessionExerciseId)
          );
          if (exercise) {
            const type = exercise.type === "CARDIO" ? "cardio" : "strength";
            navigate(
              `/app/workouts/exercise/edit/${type}?sessionExerciseId=${sessionExerciseId}&workoutId=${workoutId}`
            );
          }
        }}
        onAddExercise={onAddExercise}
      />

      {/* history chart */}
      <WorkoutHistoryChart workouts={allWorkouts} />
    </DashboardLayout>
  );
}
