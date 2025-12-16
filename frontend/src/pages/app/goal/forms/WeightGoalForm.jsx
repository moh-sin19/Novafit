import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import NumberInput from "../../../../components/inputs/NumberInput";
import DateInput from "../../../../components/inputs/DateInput";
import TextInput from "../../../../components/inputs/TextInput";

const isoToday = () => new Date().toISOString().slice(0, 10);

const WeightGoalForm = forwardRef(function WeightGoalForm(
  { initial, mode = "create" },
  ref
) {
  const [targetKg, setTargetKg] = useState("");
  const [startDate, setStartDate] = useState(isoToday());
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (initial && mode === "edit") {
      if (initial.targetValue) setTargetKg(String(initial.targetValue));
      if (initial.startDate) setStartDate(initial.startDate);
      if (initial.endDate) setEndDate(initial.endDate);
      if (initial.description) setDescription(initial.description);
    }
  }, [initial, mode]);

  useImperativeHandle(ref, () => ({
    validateAndBuild() {
      if (!targetKg || Number(targetKg) <= 0) {
        return { error: "Please enter a positive target weight." };
      }
      if (endDate && new Date(endDate) <= new Date(startDate)) {
        return { error: "End date must be after start date." };
      }
      return {
        payload: {
          type: "WEIGHT_KG",
          frequency: "weekly",
          targetValue: Number(targetKg),
          startDate,
          endDate: endDate || undefined,
          description: description || "Body weight goal",
        },
      };
    },
  }));

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-full">
      <NumberInput
        label="Target Weight (kg)"
        value={targetKg}
        onChange={setTargetKg}
        min={0}
        step={0.1}
        placeholder="e.g., 68.5"
      />

      <TextInput
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description for your weight goal"
        isRequired={false}
      />

      <DateInput
        label="Start Date"
        min={new Date()}
        value={startDate}
        onChange={setStartDate}
      />

      <DateInput
        label="End Date"
        value={endDate}
        min={startDate}
        onChange={setEndDate}
        isRequired={false}
      />
    </div>
  );
});

export default WeightGoalForm;
