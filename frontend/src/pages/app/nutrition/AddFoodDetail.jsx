import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../../layout/DashboardLayout";
import Header from "../../../components/dashboard/DashboardHeader";

import { Check, X } from "lucide-react";

import NumberInput from "../../../components/inputs/NumberInput";
import SelectInput from "../../../components/inputs/SelectInput";
import Toggle from "../../../components/inputs/Toggle";
import PrimaryIconButton from "../../../components/buttons/PrimaryIconButton";
import SecondaryIconButton from "../../../components/buttons/SecondaryIconButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, postJson } from "../../../utils/api";
import MacroDonut from "./MacroDetails";

// kcal factors
const KCAL = { carbs: 4, protein: 4, fat: 9 };

export default function AddFoodDetail() {
  const navigate = useNavigate();
  const { foodId } = useParams();
  const [params] = useSearchParams();
  const mealFromQS = params.get("meal");

  // ----- food + form state -----
  const [food, setFood] = useState(null);
  const [mealOpts, setMealOpts] = useState([]);
  const [servingId, setServingId] = useState(null); // selected serving from backend
  const [servings, setServings] = useState(1); // quantity multiplier (x1, x2, ...)
  const [servingMacros, setServingMacros] = useState(null);
  const [meal, setMeal] = useState(mealFromQS || "");
  const [favorite, setFavorite] = useState(false);

  // modal hook + an optional confirm action
  const modal = useModal();
  const [confirmAction, setConfirmAction] = useState(null);

  // -------------------------------------------------------------------
  // Fetch meal types dynamically from backend
  // -------------------------------------------------------------------
  useEffect(() => {
    getJson("/api/nutrition/meal-types")
      .then((data) => {
        const opts = (data || []).map((v) => ({
          value: v.toLowerCase(),
          label: v.charAt(0) + v.slice(1).toLowerCase(),
        }));
        setMealOpts(opts);
        // prefill if query param present
        if (mealFromQS && opts.some((o) => o.value === mealFromQS)) {
          setMeal(mealFromQS);
        }
      })
      .catch((err) => console.error("Failed to load meal types", err));
  }, [mealFromQS]);

  // -------------------------------------------------------------------
  // Fetch food details (always from our DB by local id)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!foodId) return;
    getJson(`/api/nutrition/foods/${foodId}`)
      .then((data) => {
        console.log(data);
        setFood(data);
      })
      .catch((err) => console.error("Failed to load food", err));
  }, [foodId]);

  // Pick a default serving once food details are loaded
  useEffect(() => {
    if (food?.servings?.length) {
      setServingId(food.servings[0].servingId);
    }
  }, [food]);

  useEffect(() => {
    if (!food || !food.servings?.length || !servingId) return;

    const selectedServing = food.servings.find(
      (s) => Number(s.servingId) === Number(servingId)
    );

    if (selectedServing) {
      setServingMacros({
        carbsG: selectedServing.carbsG ?? 0,
        proteinG: selectedServing.proteinG ?? 0,
        fatG: selectedServing.fatG ?? 0,
        kcal: selectedServing.kcal ?? 0,
      });
    }
  }, [food, servingId]);

  // --- Cancel (X) => confirm modal ---
  const onCancel = () => {
    setConfirmAction(() => () => navigate("/app/nutrition"));
    modal.showInfo("Discard changes?", "Your changes will be lost.", "DISCARD");
  };

  // --- Save => POST /api/nutrition/food-logs ---
  const onSave = async () => {
    try {
      if (!food) throw new Error("Food details not loaded yet");
      if (!meal) throw new Error("Please select a meal");
      if (!servingId) throw new Error("Please choose a serving");

      const payload = {
        foodId: Number(food.foodId ?? food.id ?? foodId),
        servingId: Number(servingId),
        servingQty: Number(servings || 1),
        mealType: meal.toUpperCase(),
        logDate: new Date().toISOString().split("T")[0],
        note: "",
      };

      const res = await postJson("/api/nutrition/food-logs", payload);
      const localFoodId = Number(food.foodId ?? res.foodId);

      if (favorite) {
        await postJson(`/api/nutrition/favourites/${localFoodId}`, {});
      }

      setConfirmAction(() => () => navigate("/app/nutrition"));
      modal.showSuccess("Food added", "Your food has been logged.", "DONE");
    } catch (e) {
      console.error("Save error", e);
      setConfirmAction(() => modal.close);
      modal.showError(
        "Couldn’t save",
        e?.message || "Please try again.",
        "OKAY"
      );
    }
  };
  // helper to derive scaled macros/kcal for current inputs
  const macro = (() => {
    if (!food || !servingMacros) return null;

    const qty = Number(servings || 1);

    const macros = {
      carbs: servingMacros.carbsG * qty,
      fat: servingMacros.fatG * qty,
      protein: servingMacros.proteinG * qty,
    };

    const kcal =
      (servingMacros.kcal ?? 0) * qty ||
      macros.carbs * KCAL.carbs +
        macros.protein * KCAL.protein +
        macros.fat * KCAL.fat;

    const kcalParts = {
      carbs: macros.carbs * KCAL.carbs,
      fat: macros.fat * KCAL.fat,
      protein: macros.protein * KCAL.protein,
    };

    const total = Math.max(
      kcalParts.carbs + kcalParts.fat + kcalParts.protein,
      1e-6
    );
    const perc = {
      carbs: (kcalParts.carbs / total) * 100,
      fat: (kcalParts.fat / total) * 100,
      protein: (kcalParts.protein / total) * 100,
    };

    return { macros, kcal, perc };
  })();

  return (
    <DashboardLayout>
      <Header
        title="Add Food"
        leftSlot={<h6 className="text-primary">Add Food</h6>}
        rightSlot={
          <div className="flex items-center gap-3">
            <PrimaryIconButton onClick={onSave}>
              <Check className="w-6 h-6 text-primary" />
            </PrimaryIconButton>
            <SecondaryIconButton onClick={onCancel}>
              <X className="w-6 h-6 text-primary" />
            </SecondaryIconButton>
          </div>
        }
      />

      {/* Content */}
      <div className="card space-y-6">
        {food ? (
          <>
            <div>
              <h4 className="text-primary">{food.name || "Food"}</h4>
              <p className="p2 text-secondary">{food.brand || ""}</p>
            </div>

            {/* Serving selector from backend-provided servings */}
            {food?.servings?.length > 0 && (
              <SelectInput
                label="Serving"
                options={food.servings.map((s) => ({
                  value: s.servingId,
                  label: s.label || `Serving ${s.servingId}`,
                }))}
                value={servingId}
                onChange={(val) => setServingId(val)}
                placeholder="Select a serving"
              />
            )}

            <NumberInput
              label="Number of Servings"
              value={servings}
              onChange={setServings}
              placeholder="1"
              min={0}
              step={1}
            />

            <SelectInput
              label="Meal"
              options={mealOpts}
              value={meal}
              onChange={setMeal}
              placeholder="Select a meal"
            />

            {/* === Macro donut + labels === */}
            {macro && (
              <div className="pt-2">
                <MacroDonut
                  kcal={macro.kcal}
                  macros={macro.macros}
                  perc={macro.perc}
                />
              </div>
            )}

            <Toggle
              label="Add food to favorites"
              checked={favorite}
              onChange={setFavorite}
            />
          </>
        ) : (
          <p className="text-secondary">Loading food details...</p>
        )}
      </div>

      {/* Modal (reuse for confirm, success, error) */}
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
