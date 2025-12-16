import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import EmailInput from "../../../components/inputs/EmailInput";
import TextInput from "../../../components/inputs/TextInput";
import SecondaryButton from "../../../components/buttons/SecondaryButton";

import Modal from "../../../components/ui/Modal";
import useModal from "../../../hooks/useModal";
import { getJson, putJson } from "../../../utils/api";

// ---- validation (required) ----
const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});

export default function UserInfoForm() {
  const modal = useModal();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "" },
    mode: "onBlur",
  });

  // Load current user + profile
  useEffect(() => {
    (async () => {
      try {
        const me = await getJson("/api/users/me");
        // Expecting shape from UserResponse: { email, username, profile: { firstName, lastName, ... } }
        form.reset({
          email: me?.email ?? "",
          firstName: me?.firstName ?? "",
          lastName: me?.lastName ?? "",
        });
      } catch (e) {
        modal.showError(
          "Couldn’t load your info",
          e?.message || "Please try again or re-login."
        );
      }
    })();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // Update first/last name (profile table)
      await putJson("/api/users/me/profile", {
        firstName: values.firstName,
        lastName: values.lastName,
      });

      modal.showSuccess(
        "Changes Saved",
        "Your user information has been updated."
      );
    } catch (e) {
      modal.showError(
        "Save Failed",
        e?.message || "We couldn’t save your details."
      );
    }
  });

  return (
    <section>
      <h6 className="mb-4 text-primary">User Information</h6>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <EmailInput
          label="Email Address"
          placeholder="you@example.com"
          disabled
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <TextInput
          label="First Name"
          placeholder="First name"
          {...form.register("firstName")}
          error={form.formState.errors.firstName?.message}
        />
        <TextInput
          label="Last Name"
          placeholder="Last name"
          {...form.register("lastName")}
          error={form.formState.errors.lastName?.message}
        />

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
