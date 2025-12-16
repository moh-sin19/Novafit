import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import SelectInput from "../../../components/inputs/SelectInput";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, putJson } from "../../../utils/api";

// Options
const UNIT_WEIGHT_OPTS = [
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Pounds (lb)", value: "lb" },
];

const UNIT_ENERGY_OPTS = [
  { label: "Kilocalories (kcal)", value: "kcal" },
  { label: "Kilojoules (kJ)", value: "kj" },
];

const TIMEZONE_OPTS = [
  { label: "(GMT-08:00) Pacific Time", value: "America/Los_Angeles" },
  { label: "(GMT-05:00) Eastern Time", value: "America/New_York" },
  { label: "(GMT-06:00) Central Time", value: "America/Chicago" },
  { label: "(GMT-07:00) Mountain Time", value: "America/Denver" },
  { label: "(GMT+00:00) London", value: "Europe/London" },
  { label: "(GMT+01:00) Berlin / Paris", value: "Europe/Berlin" },
  { label: "(GMT+05:30) India Standard Time", value: "Asia/Kolkata" },
  { label: "(GMT+08:00) Singapore / Beijing", value: "Asia/Singapore" },
  { label: "(GMT+09:00) Tokyo", value: "Asia/Tokyo" },
  { label: "(GMT+10:00) Sydney", value: "Australia/Sydney" },
  { label: "(GMT+12:00) Auckland", value: "Pacific/Auckland" },
];

const schema = z.object({
  timezone: z.string().min(1, "Select a timezone"),
  unitWeight: z.enum(["kg", "lb"]),
  unitEnergy: z.enum(["kcal", "kj"]),
  locale: z.string().min(1, "Select a locale"),
});

export default function PreferencesForm() {
  const modal = useModal();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      timezone: "Australia/Sydney",
      unitWeight: "kg",
      unitEnergy: "kcal",
      locale: "en-AU",
    },
  });

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        const p = me;
        form.reset({
          timezone: p.timezone || "Australia/Sydney",
          unitWeight: p.unitWeight || "kg",
          unitEnergy: p.unitEnergy || "kcal",
          locale: p.locale || "en-AU",
        });
      } catch (e) {
        modal.showError(
          "Couldn’t load preferences",
          e?.message || "Please try again or re-login."
        );
      }
    })();
  }, []);

  // Save handler
  const onSubmit = form.handleSubmit(async (v) => {
    try {
      await putJson("/api/users/me/profile", {
        timezone: v.timezone,
        unitWeight: v.unitWeight,
        unitEnergy: v.unitEnergy,
        locale: v.locale,
      });
      modal.showSuccess("Preferences Saved", "Your preferences were updated.");
    } catch (e) {
      modal.showError(
        "Save Failed",
        e?.message || "Could not save preferences."
      );
    }
  });

  return (
    <section className="mt-12">
      <h6 className="mb-4 text-primary">Preferences</h6>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <Controller
          control={form.control}
          name="unitWeight"
          render={({ field }) => (
            <SelectInput
              label="Weight Unit"
              options={UNIT_WEIGHT_OPTS}
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.unitWeight?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="unitEnergy"
          render={({ field }) => (
            <SelectInput
              label="Energy Unit"
              options={UNIT_ENERGY_OPTS}
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.unitEnergy?.message}
            />
          )}
        />
        <div className="col-span-2">
          <Controller
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <SelectInput
                label="Timezone"
                options={TIMEZONE_OPTS}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.timezone?.message}
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
