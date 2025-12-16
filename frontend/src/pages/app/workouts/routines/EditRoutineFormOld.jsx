import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useLocation} from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import EmailInput from "../../../../components/inputs/EmailInput";
import TextInput from "../../../../components/inputs/TextInput";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";

import Modal from "../../../../components/ui/Modal";
import useModal from "../../../../hooks/useModal";
import { getJson, putJson } from "../../../../utils/api";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import ExerciseFormLayout from "../exercises/ExerciseFormLayout";
import DashboardLayout from "../../../../layout/DashboardLayout";
import RoutineFormLayout from "./RoutineFormLayout";
import SelectInput from "../../../../components/inputs/SelectInput";

// ---- validation (required) ----
const schema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    notes: z.string().trim().min(1, "Enter notes"),
});
//{ id } , name, duration, calories, exercises
export default function EditOldRoutineForm() {
    const state = useLocation().state;
    console.log("state", state);
    const id = state.id;

    console.log("id", id);
    // name = state.name;
    // duration = state.duration;
    // calories = state.calories;
    // routineId = state.routineId;


    const modal = useModal();
    const [routineId, setRoutineId] = useState(id);
    const [retrievedRoutine, setRetrievedRoutine] = useState({name: "", notes: ""});

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            notes: ""
        },
        // mode: "onBlur",
    });
// }, [retrievedRoutine]);

    // useEffect(() => {
    //     console.log("retrieved", retrievedRoutine);
    // }, [retrievedRoutine]);


    // Load current routine
    useEffect(() => {
        (async () => {
            try {
                const routine = await getJson(`/api/routines/${routineId}`);
                setRetrievedRoutine(routine);
                console.log("routine: ", routine);

                form.reset({
                    name: routine?.name?? "",
                    notes: routine?.notes ?? "",
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

            const me = await getJson("/api/users/me");

            // Update routine
            await putJson(`/api/routines/${routineId}`, {
                name: values.name,
                notes: values.notes,
                userId: me.userId,
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
        <RoutineFormLayout routineId={routineId} heading={"Edit Existing Routine"} submitHandler={onSubmit}>
            <h6 className="mb-4 text-primary">User Information</h6>

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
                    isRequired={false}
                    error={form.formState.errors.notes?.message}
                />
                {/*<SelectInput*/}
                {/*    label=""*/}
                {/*    placeholder="Select Meal"*/}
                {/*    options={mealOpts}*/}
                {/*    value={field.value ?? ""}*/}
                {/*    onChange={field.onChange}*/}
                {/*/>*/}

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
