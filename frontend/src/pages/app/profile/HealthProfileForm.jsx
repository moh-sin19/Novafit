import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import SelectInput from "../../../components/inputs/SelectInput";
import NumberWithUnitInput from "../../../components/inputs/NumberUnitInput";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, putJson } from "../../../utils/api";

export const GENDER_OPTS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-binary", value: "nonbinary" },
  { label: "Prefer not to say", value: "na" },
];

const ACTIVITY_OPTS = [
  { label: "Sedentary (little or no exercise)", value: "sedentary" },
  { label: "Lightly active (1–3 days/wk)", value: "light" },
  { label: "Moderately active (3–5 days/wk)", value: "moderate" },
  { label: "Very active (6–7 days/wk)", value: "high" },
  { label: "Extra active (physical job or training)", value: "athlete" },
];

// ---- unit helpers ----
const cmToIn = (cm) => (cm == null ? "" : +(cm / 2.54).toFixed(2));
const inToCm = (inch) => (inch === "" ? undefined : Number(inch) * 2.54);
const kgToLb = (kg) => (kg == null ? "" : +(kg * 2.2046226218).toFixed(2));
const lbToKg = (lb) => (lb === "" ? undefined : Number(lb) * 0.45359237);

// UI schema (always validates number fields)
const schema = z.object({
  gender: z.string().min(1, "Required"),
  activityLevel: z.string().min(1, "Required"),
  height: z.coerce.number().positive("Enter a valid height"),
  heightUnit: z.enum(["CM", "IN"]),
  weight: z.coerce.number().positive("Enter a valid weight"),
  weightUnit: z.enum(["KG", "LB"]),
});

export default function HealthProfileForm() {
  const modal = useModal();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "",
      activityLevel: "",
      height: "",
      heightUnit: "CM",
      weight: "",
      weightUnit: "KG",
    },
  });

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        const p = me;

        const unitWeight = (p.unitWeight || "kg").toUpperCase(); // "KG" | "LB"
        const heightUnit = "CM"; // backend stores cm
        const weightUnit = unitWeight === "LB" ? "LB" : "KG";

        form.reset({
          gender: p.sex || "",
          activityLevel: p.activityLevel || "",
          heightUnit,
          weightUnit,
          // convert for UI display according to units
          height: heightUnit === "IN" ? cmToIn(p.heightCm) : p.heightCm ?? "",
          weight: weightUnit === "LB" ? kgToLb(p.weightKg) : p.weightKg ?? "",
        });
      } catch (e) {
        modal.showError(
          "Couldn’t load health profile",
          e?.message || "Please try again or re-login."
        );
      }
    })();
  }, []);

  // Save handler
  const onSubmit = form.handleSubmit(async (v) => {
    try {
      // Map UI -> backend
      const heightCm =
        v.heightUnit === "IN" ? inToCm(v.height) : Number(v.height);
      const weightKg =
        v.weightUnit === "LB" ? lbToKg(v.weight) : Number(v.weight);

      await putJson("/api/users/me/profile", {
        sex: v.gender,
        activityLevel: v.activityLevel,
        heightCm,
        weightKg,
        unitWeight: v.weightUnit.toLowerCase(), // "kg" | "lb"
      });

      modal.showSuccess(
        "Health Profile Saved",
        "Your health details were updated."
      );
    } catch (e) {
      modal.showError(
        "Save Failed",
        e?.message || "Could not save health profile."
      );
    }
  });

  return (
    <section className="mt-12">
      <h6 className="mb-4 text-primary">Health Profile</h6>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Controller
          control={form.control}
          name="gender"
          defaultValue=""
          render={({ field }) => (
            <SelectInput
              label="Gender"
              placeholder="Select one of the choice"
              options={GENDER_OPTS}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={form.formState.errors.gender?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="activityLevel"
          defaultValue=""
          render={({ field }) => (
            <SelectInput
              label="Activity Level"
              placeholder="Select one of the choice"
              options={ACTIVITY_OPTS}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={form.formState.errors.activityLevel?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <Controller
            control={form.control}
            name="height"
            render={({ field }) => (
              <Controller
                control={form.control}
                name="heightUnit"
                render={({ field: unitField }) => (
                  <NumberWithUnitInput
                    label="Height"
                    value={field.value}
                    onChange={field.onChange}
                    unit={unitField.value}
                    onUnitChange={unitField.onChange}
                    unitOptions={["CM", "IN"]}
                    error={form.formState.errors.height?.message}
                  />
                )}
              />
            )}
          />

          {/* Weight */}
          <Controller
            control={form.control}
            name="weight"
            render={({ field }) => (
              <Controller
                control={form.control}
                name="weightUnit"
                render={({ field: unitField }) => (
                  <NumberWithUnitInput
                    label="Weight"
                    value={field.value}
                    onChange={field.onChange}
                    unit={unitField.value}
                    onUnitChange={unitField.onChange}
                    unitOptions={["KG", "LB"]}
                    error={form.formState.errors.weight?.message}
                  />
                )}
              />
            )}
          />
        </div>

        <div className="pt-2">
          <SecondaryButton type="submit">SAVE CHANGES</SecondaryButton>
        </div>
      </form>

      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        confirmText={modal.confirmText}
        onClose={modal.close}
        onConfirm={modal.close}
      />
    </section>
  );
}
