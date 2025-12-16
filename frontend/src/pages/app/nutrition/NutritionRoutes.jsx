import { Routes, Route, Navigate } from "react-router-dom";
import Nutrition from "../Nutrition";
import AddFood from "./AddFood";
import AddFoodDetail from "./AddFoodDetail";

export default function NutritionRoutes() {
  return (
    <Routes>
      {/* Main page */}
      <Route index element={<Nutrition />} />

      {/* Add food list/search */}
      <Route path="add" element={<AddFood />} />

      {/* Add specific food */}
      <Route path="add/:foodId" element={<AddFoodDetail />} />

      {/* Fallback to main */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
