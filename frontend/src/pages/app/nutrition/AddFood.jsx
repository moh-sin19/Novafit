import { useEffect, useMemo, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";
import { X } from "lucide-react";

import SelectInput from "../../../components/inputs/SelectInput";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import SearchBar from "../../../components/inputs/SearchBar";
import FoodItem from "./FoodItem";
import { getJson, postJson } from "../../../utils/api";

export default function AddFood() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // --- Meal type dropdown (dynamic from backend)
  const [mealOpts, setMealOpts] = useState([]);

  useEffect(() => {
    getJson("/api/nutrition/meal-types")
      .then((data) => {
        const opts = (data || []).map((v) => ({
          value: v.toLowerCase(),
          label: v.charAt(0) + v.slice(1).toLowerCase(),
        }));
        setMealOpts(opts);
      })
      .catch((err) => console.error("Failed to load meal types", err));
  }, []);

  // --- Prefill meal from query
  const mealFromQS = params.get("meal");
  const initialMeal = mealFromQS || "";

  const { control, watch } = useForm({
    defaultValues: { meal: initialMeal },
  });

  const selectedMeal = watch("meal");
  const headerTitle = useMemo(() => {
    const match = mealOpts.find((o) => o.value === selectedMeal);
    return match ? match.label : "Select Meal";
  }, [selectedMeal, mealOpts]);

  // When user changes the meal, reflect it in the URL (?meal=…)
  useEffect(() => {
    const next = selectedMeal ? { meal: selectedMeal } : {};
    setParams(createSearchParams(next), { replace: true });
  }, [selectedMeal, setParams]);

  // ------------------------------------------------------------------
  // Favourites + search results from backend
  // ------------------------------------------------------------------
  const [favorites, setFavorites] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favourites once on mount
  useEffect(() => {
    getJson("/api/nutrition/favourites")
      .then(setFavorites)
      .catch((err) => console.error("Failed to load favourites", err));
  }, []);

  // Handle search
  const handleSearch = async (val) => {
    if (!val?.trim()) return;
    setLoading(true);
    try {
      const res = await getJson(
        `/api/nutrition/search?q=${encodeURIComponent(val)}`
      );
      setResults(res.items || []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  // CLICK: find-or-create -> navigate
  const openFoodDetail = async (food) => {
    try {
      // Prefer local id if present (favourites return foodId; local search items may return id)
      const localId = food.foodId ?? food.id;

      let body;
      if (localId != null) {
        body = { id: Number(localId) };
      } else if (food.externalId) {
        body = { externalId: String(food.externalId) };
      } else {
        throw new Error("Item has neither id/foodId nor externalId");
      }

      const dto = await postJson("/api/nutrition/foods/find-or-create", body);
      const resolvedId = dto?.foodId ?? dto?.id ?? body.id;
      if (!resolvedId) throw new Error("Backend did not return a foodId");

      navigate(`/app/nutrition/add/${resolvedId}?meal=${selectedMeal || ""}`);
    } catch (e) {
      console.error("Open detail failed", e);
      // Optional: toast/alert
    }
  };

  return (
    <DashboardLayout>
      <Header
        title={headerTitle}
        leftSlot={
          <div className="min-w-[220px]">
            <Controller
              control={control}
              name="meal"
              render={({ field }) => (
                <SelectInput
                  label=""
                  placeholder="Select Meal"
                  options={mealOpts}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        }
        rightSlot={
          <SecondaryIconButton onClick={() => navigate(`/app/nutrition`)}>
            <X className="w-6 h-6 text-primary" />
          </SecondaryIconButton>
        }
      />

      <div className="flex flex-col gap-6 mb-6">
        {/* Search bar */}
        <SearchBar
          placeholder="Search food"
          onSubmit={handleSearch}
          loading={loading}
        />

        {/* Favorites */}
        {favorites?.length > 0 && (
          <div className="space-y-4">
            <h6 className="text-primary">Favorites</h6>
            <div className="space-y-2">
              {favorites.map((f) => (
                <FoodItem
                  key={f.foodId} // favorites DTO uses foodId
                  name={f.name}
                  description={f.description || f.detailsUrl || f.brand || ""}
                  onClick={() => openFoodDetail(f)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h6 className="text-primary">Search Results</h6>
            <div className="space-y-2">
              {results.map((f) => (
                <FoodItem
                  key={f.externalId || f.id}
                  name={f.name}
                  description={f.description || f.brand || ""}
                  onClick={() => openFoodDetail(f)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
