import {Icon, loadIcons} from "@iconify/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextInput from "../inputs/TextInput";
import {getJson, putJson} from "../../utils/api";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import ExerciseFormLayout from "../../pages/app/workouts/exercises/ExerciseFormLayout";
import NumberWithUnitInput from "../inputs/NumberUnitInput";
import useModal from "../../hooks/useModal";

export default function ExerciseFormCard({ isCardio, exerciseName, description, parentClick }) {
    loadIcons(["ph:plus-circle-light"]);

    const modal = useModal();
    const [plusClicked, setPlusClicked] = useState(false);
    const navigate = useNavigate();

    const schema = z.object({
        // sets: z.string().trim().min(1, "Required"),
        // reps: z.string().trim().min(1, "Required"),
        sets: z.coerce.number().positive("Enter a valid number of sets"),
        setsUnit: z.enum(["Sets"]),
        reps: z.coerce.number().positive("Enter a valid number of repetitions"),
        repsUnit: z.enum(["Reps"]),
        weight: z.coerce.number().positive("Enter a valid weight"),
        weightUnit: z.enum(["KG", "LB"]),
    });

    // const cardioSchema = z.object({
    //     minutes: z.string().trim().min(1, "Required"),
    //     calories: z.string().trim().min(1, "Required"),
    //     time: z.string().trim().min(1, "Not required"),
    // });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            sets: "",
            setsUnit: "Sets",
            reps: "",
            repsUnit: "Reps",
            weight: "",
            weightUnit: "KG",
        },
    });

    // const cardioForm = useForm({
    //     resolver: zodResolver(cardioSchema),
    //     defaultValues: { minutes: "", calories: "", time: "" },
    //     mode: "onBlur",
    // });

    useEffect(() => {
        (async () => {
            try {
                // const me = await getJson("/api/users/me");
                // const p = me;

                const unitWeight = (p.unitWeight || "kg").toUpperCase(); // "KG" | "LB"
                const weightUnit = unitWeight === "LB" ? "LB" : "KG";

                form.reset({
                    gender: p.sex || "",
                    activityLevel: p.activityLevel || "",
                    sets: p.sets,
                    setsUnit: "Sets",
                    reps: p.reps,
                    repsUnit: "Reps",
                    weightUnit,
                    // convert for UI display according to units
                    weight: weightUnit === "LB" ? kgToLb(p.weightKg) : p.weightKg ?? "",
                });
            } catch (e) {
                modal.showError(
                    "Couldn’t load exercise form",
                    e?.message || "Please try again or re-login."
                );
            }
        })();
    }, []);

    const onSubmit = form.handleSubmit(async (values) => {
        try {

            await putJson("/api/users/me/profile", {
                sets: values.sets,
                reps: values.reps,
                weight: values.weight
            });

            modal.showSuccess(
                "Changes Saved",
                "Your strength exercise has been updated."
            );
        } catch (e) {
            modal.showError(
                "Save Failed",
                e?.message || "We couldn’t save your strength exercise."
            );
        }
    });

    // const onCardioSubmit = cardioForm.handleSubmit(async (values) => {
    //     try {
    //
    //         await putJson("/api/users/me/profile", {
    //             minutes: values.minutes,
    //             calories: values.calories,
    //             time: values.time
    //         });
    //
    //         modal.showSuccess(
    //             "Changes Saved",
    //             "Your cardio exercise has been updated."
    //         );
    //     } catch (e) {
    //         modal.showError(
    //             "Save Failed",
    //             e?.message || "We couldn’t save your cardio exercise."
    //         );
    //     }
    // });


    return (
        // isWorkout, fromAdd, isCardio, exerciseId, sessionId, exerciseName, description, dateOfExercise, parentClick, submitHandler, children }) {
        <ExerciseFormLayout isCardio={isCardio} exerciseName={exerciseName} description={description} parentClick={parentClick}>
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                <Controller
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                        <Controller
                            control={form.control}
                            name="setsUnit"
                            render={({ field: unitField }) => (
                                <NumberWithUnitInput
                                    label="Number of Sets"
                                    placeholder="Enter the number of sets"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onUnitChange={unitField.onChange}
                                    unitOptions={["Sets"]}
                                    {...form.register("sets")}
                                    error={form.formState.errors.sets?.message}
                                    isRequired={true}
                                />
                            )}
                        />
                    )}
                />
            {/*</div>*/}
            {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                <Controller
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                        <Controller
                            control={form.control}
                            name="setsUnit"
                            render={({ field: unitField }) => (
                                <NumberWithUnitInput
                                    label="Repetitions per Set"
                                    placeholder="Enter the number of repetitions per set"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onUnitChange={unitField.onChange}
                                    unitOptions={["Reps"]}
                                    {...form.register("reps")}
                                    error={form.formState.errors.reps?.message}
                                    isRequired={true}
                                />
                            )}
                        />
                    )}
                />
            {/*</div>*/}
            {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                <Controller
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                        <Controller
                            control={form.control}
                            name="setsUnit"
                            render={({ field: unitField }) => (
                                <NumberWithUnitInput
                                    label="Weight per Set"
                                    placeholder="Enter the weight per set"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onUnitChange={unitField.onChange}
                                    unitOptions={["KG", "LBS"]}
                                    {...form.register("weight")}
                                    error={form.formState.errors.weight?.message}
                                    isRequired={false}
                                />
                            )}
                        />
                    )}
                />
            {/*</div>*/}
            </form>
        </ExerciseFormLayout>

        // <div className="flex flex-col items-start no-shadow-card">
        //     <div className="flex flex-row justify-between pt-4 pb-3 gap-1 w-[100%]">
        //         {!isCardio &&
        //             <div className="b1 text-primary">Add Strength Exercise</div>
        //         }
        //         {isCardio &&
        //         <div className="b1 text-primary">Add Cardio Exercise</div>
        //         }
        //         Tick
        //         Cross
        //     </div>
        //
        //     <div className="flex flex-row justify-between items-center px-6 w-[100%]">
        //         <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">
        //             <div className="b1 text-primary">{exerciseName}</div>
        //             <div className="p3 text-secondary">{description}</div>
        //         </div>
        //         <Icon icon="ph:plus-circle-light" height="3%" onClick={parentClick}></Icon>
        //     </div>
        //
        //     {!isCardio &&
        //         <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
        //     </div>
        // }
        //
        // {isCardio &&
        //     // <form onSubmit={onSubmit} noValidate className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
        //     <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
        //         <form onSubmit={onCardioSubmit} noValidate className="flex flex-col gap-4">
        //         {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
        //             <TextInput
        //                 label="Minutes performed"
        //                 placeholder="Enter the number of minutes performed"
        //                 {...cardioForm.register("minutes")}
        //                 // error={errors.minutes?.message}
        //                 error={cardioForm.formState.errors.minutes?.message}
        //                 isRequired={true}
        //             />
        //         {/*</div>*/}
        //         {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
        //             <TextInput
        //                 label="Calories burned"
        //                 placeholder="Enter the number of calories burned"
        //                 {...cardioForm.register("calories")}
        //                 // error={errors.calories?.message}
        //                 error={cardioForm.formState.errors.calories?.message}
        //                 isRequired={false}
        //             />
        //         {/*</div>*/}
        //         {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
        //             <TextInput
        //                 label="Time"
        //                 placeholder="Enter the time the activity took"
        //                 {...cardioForm.register("time")}
        //                 // error={errors.time?.message}
        //                 error={cardioForm.formState.errors.time?.message}
        //                 isRequired={false}
        //             />
        //         {/*</div>*/}
        //         </form>
        //     </div>
        // }
        // </div>

    );
}