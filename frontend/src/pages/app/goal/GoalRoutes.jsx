import { Routes, Route, Navigate } from "react-router-dom";
import Goals from "../Goals";
import AddGoal from "./AddGoal";
import EditGoal from "./EditGoal";

export default function GoalRoutes() {
  return (
    <Routes>
      {/* Main page */}
      <Route index element={<Goals />} />

      {/* Add goal */}
      <Route path="add" element={<AddGoal />} />

      {/* Edit goal */}
      <Route path=":goalId/edit" element={<EditGoal />} />

      {/* Fallback to main */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
