import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../../layout/AuthLayout";
import SelectInput from "../../../components/inputs/SelectInput";
import DateInput from "../../../components/inputs/DateInput";
import NumberWithUnitInput from "../../../components/inputs/NumberUnitInput";
import PrimaryButton from "../../../components/buttons/PrimaryButton";

const GENDER_OPTS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Non-binary", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

const ACTIVITY_OPTS = [
  { label: "Sedentary (little or no exercise)", value: "sedentary" },
  { label: "Lightly active (1–3 days/wk)", value: "light" },
  { label: "Moderately active (3–5 days/wk)", value: "moderate" },
  { label: "Very active (6–7 days/wk)", value: "high" },
  { label: "Extra active (physical job or training)", value: "athlete" },
];

const schema = z.object({
  gender: z.string().min(1, "Gender is required"),
  activityLevel: z.string().min(1, "Activity level is required"),
  dob: z.coerce
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Enter a valid date",
    })
    .max(new Date(), "Date of birth cannot be in the future")
    .min(new Date("1900-01-01"), "Enter a realistic date of birth"),
  weight: z.coerce.number().positive("Enter a valid weight"),
  weightUnit: z.enum(["KG", "LB"]),
  height: z.coerce.number().positive("Enter a valid height"),
  heightUnit: z.enum(["CM", "IN"]),
});

export default function CreateProfile() {
  const navigate = useNavigate();

  // Clear draft whenever this page loads
  useEffect(() => {
    localStorage.removeItem("profileDraft");
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "",
      activityLevel: "",
      dob: undefined,
      weight: "",
      weightUnit: "KG",
      height: "",
      heightUnit: "CM",
    },
  });

  const onSubmit = async (values) => {
    console.log("Form values:", values);
    localStorage.setItem("profileDraft", JSON.stringify(values));
    navigate("/auth/create-account", { replace: true });
  };

  return (
    <AuthLayout
      title="Create Profile"
      description="Provide a few basics so we can tailor your experience."
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full flex flex-col gap-3 md:gap-6"
      >
        {/* Inputs */}
        <div className="w-full flex flex-col gap-2 sm:gap-4">
          <Controller
            name="gender"
            control={control}
            defaultValue="" // important
            render={({ field }) => (
              <SelectInput
                label="Gender"
                placeholder="Select one of the choice"
                options={GENDER_OPTS} // [{label, value}]
                value={field.value ?? ""} // ensure a string
                onChange={field.onChange} // must pass the selected value string
                error={errors.gender?.message}
              />
            )}
          />
          <Controller
            name="activityLevel"
            control={control}
            defaultValue="" // important
            render={({ field }) => (
              <SelectInput
                label="Activity Level"
                placeholder="Select one of the choice"
                options={ACTIVITY_OPTS} // [{label, value}]
                value={field.value ?? ""} // ensure a string
                onChange={field.onChange} // must pass the selected value string
                error={errors.activityLevel?.message}
              />
            )}
          />
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Date of Birth"
                value={field.value}
                onChange={field.onChange}
                error={errors.dob?.message}
                max={new Date()} // disable future dates
              />
            )}
          />
          <Controller
            name="weight"
            control={control}
            render={({ field, formState, ...rest }) => (
              <Controller
                name="weightUnit"
                control={control}
                render={({ field: unitField }) => (
                  <NumberWithUnitInput
                    label="Weight"
                    value={field.value}
                    onChange={field.onChange}
                    unit={unitField.value}
                    onUnitChange={(next) => unitField.onChange(next)}
                    unitOptions={["KG", "LB"]}
                    error={errors.weight?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <Controller
                name="heightUnit"
                control={control}
                render={({ field: unitField }) => (
                  <NumberWithUnitInput
                    label="Height"
                    value={field.value}
                    onChange={field.onChange}
                    unit={unitField.value}
                    onUnitChange={unitField.onChange}
                    unitOptions={["CM", "IN"]}
                    error={errors.height?.message}
                  />
                )}
              />
            )}
          />
        </div>
        {/* CTA */}
        <PrimaryButton type="submit" loading={isSubmitting} fullWidth>
          NEXT
        </PrimaryButton>
        {/* Link */}
        <div className="w-full flex flex-row gap-3 items-center">
          <div className="border border-subtle flex-1" />
          <div className="flex flex-row items-center gap-1">
            <span className="p2 text-primary">Already have an account?</span>
            <Link to="/auth/login" className="b3 text-accent">
              Sign In
            </Link>
          </div>
          <div className="border border-subtle flex-1" />
        </div>
      </form>
    </AuthLayout>
  );
}
