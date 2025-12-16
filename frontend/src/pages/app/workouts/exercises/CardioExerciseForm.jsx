import {Icon, loadIcons} from "@iconify/react";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextInput from "../../../../components/inputs/TextInput";
import {getJson, putJson} from "../../../../utils/api";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z, } from "zod";
import ExerciseFormLayout from "../../../../pages/app/workouts/exercises/ExerciseFormLayout";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import useModal from "../../../../hooks/useModal";
import NumberInput from "../../../../components/inputs/NumberInput";
import DecimalInput from "../../../../components/inputs/DecimalInput";
import Modal from "../../../../components/ui/Modal";
// import updateWorkout fro

export default function CardioExerciseForm({ addingNew, isWorkout, workoutId, exerciseId, exerciseName, description, dateOfExercise, setSubmitHandler, parentClick }) {

    const modal = useModal();
    const [plusClicked, setPlusClicked] = useState(false);
    const navigate = useNavigate();

    const schema = z.object({
        minutes: z.coerce.number().positive("Enter a valid number of minutes"),
        // setsUnit: z.enum(["Minutes"]),
        calories: z.coerce.number().positive("Enter a valid number of calories").optional(),
        // repsUnit: z.enum(["Calories"]),
        metres: z.coerce.number().positive("Enter a valid number of metres").optional(),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            minutes: 0,
            calories: 0,
            metres: 0,
        }
    });

    useEffect(() => {
        loadIcons(["ph:plus-circle-light"]);
    }, []);

    // Load current routine
    useEffect(() => {
        (async () => {
            try {
                // const routine = await getJson(`/api/routines/${routineId}`);
                // setRetrievedRoutine(routine);
                // console.log("routine: ", routine);
                const meUser = await getJson("/api/users/me");
                const meId = meUser.userId;

                console.log("meId: ", meId);
                console.log("path: ", `/api/workouts/user/${meId}`);
                const workouts = await getJson(`/api/workouts/user/${meId}`);
                const exercises = await getJson(`/api/workouts/${workoutId}/exercises`);
                const exercise = exercises.find((exercise) => exercise.exerciseId == exerciseId);

                console.log("workouts: ", workouts);
                console.log("exercise: ", exercise);
                console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");
                console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");
                // const p = workouts;

                let minutes = 0;
                let calories = 0;
                let metres = 0;
                for (let index in (exercise?.sets?? "")) {
                    const exerciseSet = exercise.sets[index];
                    console.log("exerciseSet", exerciseSet);
                    minutes += parseInt(exerciseSet.durationMin);
                    calories += parseInt(exerciseSet.caloriesBurned);
                    metres += parseInt(exerciseSet.distanceM);
                }

                console.log("minutes", minutes);
                console.log("calories", calories);
                console.log("metres", metres);

                form.reset({
                    minutes: minutes,
                    calories: calories,
                    metres: metres,
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
            // Update entire workout

            console.log("onSubmit cardio");

            const workout = await getJson(`/api/workouts/${workoutId}`);
            const thisExercise = workout.exercises.find((exercise) => exercise.exerciseId == exerciseId);
            const updatedExercises = workout.exercises.filter((exercise) => exercise.exerciseId != exerciseId);



            const updatedExercise = {
                sessionExerciseId: thisExercise.sessionExerciseId, // Existing exercise
                exerciseId: thisExercise.exerciseId,
                type: thisExercise.type,
                sortOrder: thisExercise.sortOrder,
                notes: thisExercise.notes,
                sets: [
                    {
                        sessionSetId: 1,
                        setOrder: 1,
                        durationMin: values.minutes,
                        distanceM: values.metres,
                        caloriesBurned: values.calories,
                    }
                ]
            }

            // otherExercises.
            updatedExercises.push(updatedExercise);
            console.log("updatedExercises: ", updatedExercises);

            const updatedWorkout = {
                date: workout.date,
                startTime: workout.startTime,
                endTime: workout.endTime,
                notes: workout.notes,
                exercises: updatedExercises
            };

            console.log("updatedWorkout: ", updatedWorkout);

            if (addingNew) {
                const updateResult = await postJson(`/api/workouts/${workoutId}/exercises`, updatedExercise);
            }
            else {
                const updateResult = await putJson(`/api/workouts/${workoutId}`, updatedWorkout);
            }


            modal.showSuccess(
                "Changes Saved",
                "Your cardio exercise has been updated."
            );

            console.log("updatedWorkout: ", updatedWorkout);

        } catch (e) {
            modal.showError(
                "Save Failed",
                e?.message || "We couldn’t save your cardio exercise."
            );
        }
    });


    return (
        <ExerciseFormLayout isWorkout={isWorkout} fromAdd={false} isCardio={true} exerciseId={exerciseId} sessionId={workoutId} exerciseName={exerciseName} description={description} dateOfExercise={dateOfExercise} parentClick={parentClick} submitHandler={onSubmit}>
            <section>
                <form noValidate className="flex flex-col gap-4">
                    {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    <Controller
                        control={form.control}
                        name="minutes"
                        render={({ field }) => (
                            <DecimalInput
                                label="Number of Minutes"
                                placeholder="Enter the number of minutes"
                                value={field.value}
                                onChange={(val) => field.onChange(val === "" ? "" : val)}
                                ref={field.ref}
                                error={form.formState.errors.minutes?.message}
                                isRequired={true}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                            <DecimalInput
                                label="Number of Calories"
                                placeholder="Enter the number of calories"
                                value={field.value}
                                onChange={(val) => field.onChange(val === "" ? "" : val)}
                                ref={field.ref}
                                error={form.formState.errors.calories?.message}
                                isRequired={false}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="metres"
                        render={({ field }) => (
                        <DecimalInput
                            label="Number of metres"
                            placeholder="Enter the number of metres"
                            value={field.value}
                            onChange={(val) => field.onChange(val === "" ? "" : val)}
                            ref={field.ref}
                            error={form.formState.errors.metres?.message}
                            isRequired={false}
                        />
                    )}
                        />
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
            </section>
        </ExerciseFormLayout>

    );
}
