import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import EmailInput from "../../../../components/inputs/EmailInput";
import TextInput from "../../../../components/inputs/TextInput";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";

import Modal from "../../../../components/ui/Modal";
import useModal from "../../../../hooks/useModal";
import { getJson, putJson, postJson } from "../../../../utils/api";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import ExerciseFormLayout from "../exercises/ExerciseFormLayout";
import DashboardLayout from "../../../../layout/DashboardLayout";
import RoutineFormLayout from "./RoutineFormLayout";

// ---- validation (required) ----
const schema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    notes: z.string().trim().min(1, "Enter notes"),
});

export default function AddRoutineForm() {
    const modal = useModal();
    const [routineId, setRoutineId] = useState(null);
    // const [retrievedRoutine, setRetrievedRoutine] = useState(null);
    const [meId, setMeId] = useState(1);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            notes: ""
        },
        mode: "onBlur",
    });

    // Load current user
    useEffect(() => {
        (async () => {
            try {
                const me = await getJson("/api/users/me");
                setMeId(me.userId);
                // Expecting shape from UserResponse: { email, username, profile: { firstName, lastName, ... } }
                form.reset({
                    name: me?.name ?? "",
                    notes: me?.notes ?? "",
                });

                // const routine = await getJson(`/api/routines/${routineId}`);
                // setRetrievedRoutine(routine);
                // console.log("routine: ", routine);

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
            // Add routine
            const body = {
                name: values.name,
                notes: values.notes,
                userId: meId,
                exercises: [
                    {
                        "exerciseId": 1,
                        "type": "WEIGHT",
                        "sortOrder": 1,
                        "notes": "Focus on form",
                        "sets": [
                            {
                                "setOrder": 1,
                                "targetReps": 10,
                                "targetWeight": 135.0,
                                "targetDurationMin": null,
                                "targetDistanceM": null
                            },
                            {
                                "setOrder": 2,
                                "targetReps": 8,
                                "targetWeight": 155.0,
                                "targetDurationMin": null,
                                "targetDistanceM": null
                            }
                        ]
                    }
                ]
            };
            const routine = await postJson(`/api/routines`, body);

            setRoutineId(routine.routineId);

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
        <RoutineFormLayout routineId={routineId} heading={"Add New Routine"} submitHandler={onSubmit}>
            <h6 className="mb-4 text-primary">Routine Information</h6>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <TextInput
                    label="Name"
                    placeholder="Name"
                    {...form.register("name")}
                    error={form.formState.errors.name?.message}
                />
                <TextInput
                    label="Notes"
                    placeholder="Notes"
                    {...form.register("notes")}
                    error={form.formState.errors.notes?.message}
                />

                {/*<div className="pt-2">*/}
                {/*    <SecondaryButton type="submit">SAVE CHANGES</SecondaryButton>*/}
                {/*</div>*/}
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
        </RoutineFormLayout>
    );
}
