import { useNavigate } from "react-router-dom";

import AddButton from "../../../components/buttons/AddButton";

/**
 * LatestFoodCard - Displays the most recent food log entry
 *
 * @param {object} food - Food log data
 * @param {boolean} loading - Loading state
 */
export default function LatestFoodCard({ food, loading }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-subtle overflow-hidden">
      <div className="bg-base p-4 flex items-center justify-between border-b border-subtle">
        <h6 className="text-primary">Latest Logged Food</h6>
        <AddButton onClick={() => navigate("/app/nutrition/add")} />
      </div>

      <div className="p-4">
        {loading ? (
          <p className="p2 text-secondary">Loading...</p>
        ) : food ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="sh3 text-primary font-semibold">
                {food.name || "Food Item"}
              </p>
              <div className="flex gap-4 mt-1">
                <p className="p2 text-subtitle">{food.kcalSnapshot} kcal</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="p2 text-secondary">No food logged yet.</p>
        )}
      </div>
    </div>
  );
}
