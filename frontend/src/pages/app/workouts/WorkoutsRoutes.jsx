import { Routes, Route, Navigate } from "react-router-dom";
import Workouts from "./Workouts";
import AddExercise from "./AddExercise";
import LogCardioExercise from "./LogCardioExercise";
import LogStrengthExercise from "./LogStrengthExercise";
import EditCardioExercise from "./EditCardioExercise";
import EditStrengthExercise from "./EditStrengthExercise";

export default function WorkoutsRoutes() {
  return (
    <Routes>
      {/* main dashboard */}
      <Route index element={<Workouts />} />
      {/* add exercise to today's session */}
      <Route path="exercise/new" element={<AddExercise />} />
      {/* log / edit a specific session-exercise */}
      <Route path="exercise/strength" element={<LogStrengthExercise />} />
      <Route path="exercise/cardio" element={<LogCardioExercise />} />
      <Route path="exercise/edit/strength" element={<EditStrengthExercise />} />
      <Route path="exercise/edit/cardio" element={<EditCardioExercise />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
