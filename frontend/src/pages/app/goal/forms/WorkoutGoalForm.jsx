import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import NumberInput from "../../../../components/inputs/NumberInput";
import SelectInput from "../../../../components/inputs/SelectInput";
import DateInput from "../../../../components/inputs/DateInput";
import TextInput from "../../../../components/inputs/TextInput";

const FREQ_OPTS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

const isoToday = () => new Date().toISOString().slice(0, 10);

const WorkoutGoalForm = forwardRef(function WorkoutGoalForm(
  { initial, mode = "create" },
  ref
) {
  const [sessions, setSessions] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState(isoToday());
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (initial && mode === "edit") {
      if (initial.targetValue) setSessions(String(initial.targetValue));
      if (initial.frequency) setFrequency(initial.frequency);
      if (initial.startDate) setStartDate(initial.startDate);
      if (initial.endDate) setEndDate(initial.endDate);
      if (initial.description) setDescription(initial.description);
    }
  }, [initial, mode]);

  useImperativeHandle(ref, () => ({
    validateAndBuild() {
      if (!sessions || Number(sessions) <= 0) {
        return { error: "Please enter a positive target session count." };
      }
      if (endDate && new Date(endDate) <= new Date(startDate)) {
        return { error: "End date must be after start date." };
      }
      return {
        payload: {
          type: "WORKOUTS_PER_WEEK",
          frequency,
          targetValue: Number(sessions),
          startDate,
          endDate: endDate || undefined,
          description: description || "Workout frequency goal",
        },
      };
    },
  }));

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-full">
      <NumberInput
        label="Target sessions"
        value={sessions}
        onChange={setSessions}
        min={0}
        step={1}
        placeholder="e.g., 4"
      />

      <SelectInput
        label="Frequency"
        options={FREQ_OPTS}
        value={frequency}
        onChange={setFrequency}
        placeholder="Choose frequency"
      />

      <TextInput
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description for your workout goal"
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

export default WorkoutGoalForm;
