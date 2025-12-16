// src/pages/auth/create/CreateAccount.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../../layout/AuthLayout";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import EmailInput from "../../../components/inputs/EmailInput";
import PasswordInput from "../../../components/inputs/PasswordInput";
import TextInput from "../../../components/inputs/TextInput";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import Modal from "../../../components/ui/Modal";
import { postJson } from "../../../utils/api";

// ---------- validation ----------
const schema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .nonempty("Email is required")
      .email("Enter a valid email"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Minimum is 8 characters")
      .max(100, "Maximum is 100 characters"),
    confirmPassword: z.string().nonempty("Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// ---------- helpers ----------
function formatDateYYYYMMDD(value) {
  const d = value instanceof Date ? value : value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return undefined;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function toKg(weight, unit) {
  if (weight === "" || weight == null) return undefined;
  return unit === "LB" ? Number(weight) * 0.45359237 : Number(weight);
}

function toCm(height, unit) {
  if (height === "" || height == null) return undefined;
  return unit === "IN" ? Number(height) * 2.54 : Number(height);
}

function mapSex(gender) {
  const g = (gender || "").toLowerCase();
  if (g.startsWith("male")) return "male";
  if (g.startsWith("female")) return "female";
  if (g.startsWith("non")) return "nonbinary";
  return "na";
}

function mapWeightUnit(u) {
  return (u || "").toLowerCase();
}

function guessUsernameFromEmail(email) {
  if (!email) return undefined;
  return email.split("@")[0];
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setFormError("");
    setLoading(true);

    try {
      const draft = JSON.parse(localStorage.getItem("profileDraft") || "{}");

      const payload = {
        email: values.email,
        username: guessUsernameFromEmail(values.email),
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,

        dateOfBirth: formatDateYYYYMMDD(draft.dob),
        sex: mapSex(draft.gender),
        heightCm: toCm(draft.height, draft.heightUnit),
        weightKg: toKg(draft.weight, draft.weightUnit),
        activityLevel: draft.activityLevel || "none",

        timezone: "Australia/Sydney",
        unitWeight: mapWeightUnit(draft.weightUnit || "KG"),
        unitEnergy: "kcal",
        locale: "en-AU",
      };

      await postJson("/api/users/register", payload);
      localStorage.removeItem("profileDraft");

      setModalType("success");
      setModalTitle("Account Created");
      setModalDesc("Your account has been created. You can now sign in.");
      setModalOpen(true);
    } catch (e) {
      console.error("Register failed:", e);
      setModalType("error");
      setModalTitle("Cannot Create Account");
      console.log(e?.message);
      setModalDesc(e?.message || "There was an error creating your account.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => setModalOpen(false);
  const handleModalConfirm = () => {
    setModalOpen(false);
    if (modalType === "success") navigate("/auth/login", { replace: true });
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Set your login credentials to get started."
    >
      <Modal
        open={modalOpen}
        type={modalType}
        title={modalTitle}
        description={modalDesc}
        confirmText="OKAY"
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full flex flex-col gap-3 md:gap-6"
      >
        {formError && <ErrorMessage message={formError} />}

        <div className="w-full flex flex-col gap-2 sm:gap-4">
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            {...register("firstName")}
            error={errors.firstName?.message}
          />

          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            {...register("lastName")}
            error={errors.lastName?.message}
          />

          <EmailInput
            label="Email Address"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password?.message}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <PrimaryButton type="submit" loading={loading} fullWidth>
          SIGN UP
        </PrimaryButton>

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
