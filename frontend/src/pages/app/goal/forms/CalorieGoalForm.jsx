import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import NumberUnitInput from "../../../../components/inputs/NumberUnitInput";
import NumberInput from "../../../../components/inputs/NumberInput";
import DateInput from "../../../../components/inputs/DateInput";
import TextInput from "../../../../components/inputs/TextInput";

const UNIT_ENERGY_OPTS = [
  { label: "kcal", value: "kcal" },
  { label: "kJ", value: "kj" },
];

// 50/30/20 defaults (Carb/Protein/Fat) as % of calories
const DEFAULT_SPLIT = { carb: 0.5, protein: 0.3, fat: 0.2 };

const isoToday = () => new Date().toISOString().slice(0, 10);
const kjToKcal = (kj) => (kj === "" || kj == null ? "" : +kj / 4.184);
const kcalToKj = (kcal) => (kcal === "" || kcal == null ? "" : +kcal * 4.184);

export default forwardRef(function CalorieGoalForm(
  { initial, mode = "create" },
  ref
) {
  // energy target + unit
  const [energy, setEnergy] = useState(""); // numeric string
  const [energyUnit, setEnergyUnit] = useState("kcal"); // "kcal" | "kj"

  // macros (grams) – allow user override
  const [carb, setCarb] = useState(""); // g
  const [protein, setProtein] = useState(""); // g
  const [fat, setFat] = useState(""); // g

  // track if user touched macro fields (so we don't overwrite)
  const touchedRef = useRef({ carb: false, protein: false, fat: false });

  const [startDate, setStartDate] = useState(isoToday());
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (initial && mode === "edit") {
      // Set energy value (convert from kcal to display unit)
      if (initial.targetValue) {
        setEnergy(String(initial.targetValue));
        setEnergyUnit("kcal");
      }

      // Set dates
      if (initial.startDate) setStartDate(initial.startDate);
      if (initial.endDate) setEndDate(initial.endDate);

      // Set description
      if (initial.description) setDescription(initial.description);

      // Parse notes for macro values if they exist
      if (initial.notes) {
        const notes = initial.notes;
        const carbMatch = notes.match(/Carb: (\d+)g/);
        const proteinMatch = notes.match(/Protein: (\d+)g/);
        const fatMatch = notes.match(/Fat: (\d+)g/);

        if (carbMatch) {
          setCarb(carbMatch[1]);
          touchedRef.current.carb = true;
        }
        if (proteinMatch) {
          setProtein(proteinMatch[1]);
          touchedRef.current.protein = true;
        }
        if (fatMatch) {
          setFat(fatMatch[1]);
          touchedRef.current.fat = true;
        }
      }
    }
  }, [initial, mode]);

  // kcal value computed from current energy + unit (for calc + payload)
  const kcalValue = useMemo(() => {
    if (energy === "" || isNaN(Number(energy))) return 0;
    return energyUnit === "kj" ? Number(energy) / 4.184 : Number(energy);
  }, [energy, energyUnit]);

  // Auto-fill macros on energy change IF user hasn't manually edited macros
  useEffect(() => {
    if (!kcalValue || kcalValue <= 0) return;

    const notTouched =
      !touchedRef.current.carb &&
      !touchedRef.current.protein &&
      !touchedRef.current.fat;

    if (!notTouched) return;

    // grams = (percent * kcal) / kcal_per_gram
    const nextCarb = Math.round((DEFAULT_SPLIT.carb * kcalValue) / 4);
    const nextProtein = Math.round((DEFAULT_SPLIT.protein * kcalValue) / 4);
    const nextFat = Math.round((DEFAULT_SPLIT.fat * kcalValue) / 9);

    setCarb(String(nextCarb));
    setProtein(String(nextProtein));
    setFat(String(nextFat));
  }, [kcalValue]);

  // Unit conversion handler so the *same energy* is preserved when unit toggles
  const convertOnUnitChange = (val, from, to) => {
    if (val === "" || val == null) return "";
    const num = Number(val);
    if (isNaN(num)) return "";
    if (from === to) return num;
    return from === "kcal" && to === "kj" ? kcalToKj(num) : kjToKcal(num);
  };

  useImperativeHandle(ref, () => ({
    validateAndBuild() {
      if (!energy || Number(energy) <= 0) {
        return { error: "Please enter a positive calorie target." };
      }
      if (endDate && new Date(endDate) <= new Date(startDate)) {
        return { error: "End date must be after start date." };
      }

      const kcalForPayload =
        energyUnit === "kj"
          ? Math.round(Number(energy) / 4.184)
          : Number(energy);

      const notes = [
        carb && `Carb: ${carb}g`,
        protein && `Protein: ${protein}g`,
        fat && `Fat: ${fat}g`,
        energyUnit === "kj" && `Entered as ${Number(energy).toFixed(0)} kJ`,
      ]
        .filter(Boolean)
        .join(" | ");

      return {
        payload: {
          type: "CALORIES_KCAL",
          frequency: "daily",
          targetValue: kcalForPayload,
          startDate,
          endDate: endDate || undefined,
          description: description || "Calorie intake goal",
          notes: notes || undefined,
        },
      };
    },
  }));

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-full">
      {/* Target calories with unit switch */}
      <NumberUnitInput
        label="Target Calories"
        value={energy}
        onChange={setEnergy}
        unit={energyUnit}
        onUnitChange={(nextUnit) => {
          const converted = convertOnUnitChange(energy, energyUnit, nextUnit);
          setEnergy(converted === "" ? "" : String(Math.round(converted)));
          setEnergyUnit(nextUnit);
        }}
        unitOptions={UNIT_ENERGY_OPTS.map((o) => o.value.toUpperCase())} // if your component expects ["KCAL","KJ"] use .toUpperCase()
        min={0}
        step={1}
        placeholder="e.g., 2000"
      />

      {/* Optional macro guidance (user can modify) */}
      <NumberInput
        label="Carb (grams)"
        value={carb}
        onChange={(v) => {
          touchedRef.current.carb = true;
          setCarb(v);
        }}
        min={0}
        step={1}
        placeholder="Recommended: 50%"
      />
      <NumberInput
        label="Protein (grams)"
        value={protein}
        onChange={(v) => {
          touchedRef.current.protein = true;
          setProtein(v);
        }}
        min={0}
        step={1}
        placeholder="Recommended: 30%"
      />
      <NumberInput
        label="Fat (grams)"
        value={fat}
        onChange={(v) => {
          touchedRef.current.fat = true;
          setFat(v);
        }}
        min={0}
        step={1}
        placeholder="Recommended: 20%"
      />

      <TextInput
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description for your calorie goal"
        isRequired={false}
      />

      <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
      <DateInput
        label="End Date"
        value={endDate}
        onChange={setEndDate}
        isRequired={false}
      />
    </div>
  );
});
