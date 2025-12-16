import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordInput from "../../../components/inputs/PasswordInput";
import SecondaryButton from "../../../components/buttons/SecondaryButton";

import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, putJson } from "../../../utils/api";

const schema = z
  .object({
    oldPassword: z.string().min(8, "Min 8 characters"),
    newPassword: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Min 8 characters"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ChangePasswordForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const modal = useModal();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch current user's email (requires auth token to call /api/users/me)
  useEffect(() => {
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        console.log(me.email);
        setEmail(me?.email || "");
      } catch (e) {
        // Still allow manual attempt; backend reset endpoint only needs email+newPassword
        modal.showError(
          "Couldn’t load profile",
          e?.message || "Please try again or re-login."
        );
      }
    })();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      if (!email) {
        throw new Error("No email found for the current user.");
      }

      await putJson("/api/users/me/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      form.reset({ oldPassword: "", newPassword: "", confirmPassword: "" });
      modal.showSuccess("Password Updated", "Your password has been changed.");
    } catch (e) {
      modal.showError(
        "Update Failed",
        e?.message || "Could not update password."
      );
    } finally {
      form.reset({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setSubmitting(false);
    }
  });

  return (
    <section>
      <h6 className="mb-4 text-primary">Change Password</h6>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PasswordInput
          label="Old Password"
          placeholder="Enter old password"
          {...form.register("oldPassword")}
          error={form.formState.errors.oldPassword?.message}
        />
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          {...form.register("newPassword")}
          error={form.formState.errors.newPassword?.message}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter new password"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />
        <div className="pt-2">
          <SecondaryButton type="submit" loading={submitting}>
            SAVE CHANGES
          </SecondaryButton>
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
