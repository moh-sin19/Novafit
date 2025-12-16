import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../../layout/AuthLayout";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import EmailInput from "../../../components/inputs/EmailInput";
import PasswordInput from "../../../components/inputs/PasswordInput";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { postJson, setAuthToken, deriveUserId } from "../../../utils/api";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setFormError("");
    setLoading(true);
    try {
      // EXPECTED backend response:
      //   { token: "jwt...", user: { id: 1, ... } }
      // If user is not included, we’ll derive from JWT "sub"
      const data = await postJson("/api/users/login", {
        usernameOrEmail: values.email,
        password: values.password,
      });

      const token = data?.token;
      if (!token) throw new Error("No token returned from server");

      const userId = deriveUserId(token, data?.user);
      if (userId == null) {
        // We *must* have a numeric/string id to prevent "X-User-Id: undefined"
        throw new Error("Login succeeded but no user id available");
      }

      setAuthToken(token, userId);
      navigate("/app", { replace: true });
    } catch (e) {
      console.error("Login failed:", e);
      const message =
        e?.data?.message ||
        e?.message ||
        "Login failed. Please check your email and password.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      description="Sign in to continue tracking your workouts and nutrition."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full flex flex-col gap-3 md:gap-6"
      >
        {formError && <ErrorMessage message={formError} />}

        <div className="w-full flex flex-col gap-2 sm:gap-4">
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
        </div>

        <PrimaryButton type="submit" loading={loading} fullWidth>
          SIGN IN
        </PrimaryButton>

        <div className="w-full flex flex-row gap-3 items-center">
          <div className="border border-subtle flex-1" />
          <div className="flex flex-row items-center gap-1">
            <span className="p2 text-primary">Don't have an account?</span>
            <Link to="/auth/create-profile" className="b3 text-accent">
              Sign Up
            </Link>
          </div>
          <div className="border border-subtle flex-1" />
        </div>
      </form>
    </AuthLayout>
  );
}
