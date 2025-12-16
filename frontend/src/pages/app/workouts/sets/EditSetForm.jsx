import {Icon, loadIcons} from "@iconify/react";
import {useCallback, useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
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
import SetFormLayout from "./SetFormLayout";
import PrimaryIconButton from "../../../../components/buttons/PrimaryIconButton";
import {Check, X} from "lucide-react";
import SecondaryIconButton from "../../../../components/buttons/SecondaryIconButton";
import Header from "../../../../components/dashboard/DashboardHeader";
import DashboardLayout from "../../../../layout/DashboardLayout";

export default function EditSetForm({ exerciseName, description, dateOfExercise, setSubmitHandler, parentClick }) {

    const modal = useModal();
    const [plusClicked, setPlusClicked] = useState(false);
    const navigate = useNavigate();
    const state = useLocation().state;
    const [crossClicked, setCrossClicked] = useState(false);
    const [exercise, setExercise] = useState(null);

    const isWorkout = state.isWorkout;
    const sessionOrRoutineId = state.sessionOrRoutineId;
    const sessionOrRoutineExerciseId = state.sessionOrRoutineExerciseId;
    const sessionOrRoutineSetId = state.sessionOrRoutineSetId;

    const schema = z.object({
        reps: z.coerce.number().min(0,"Enter a valid number of reps").optional(),
        weight: z.coerce.number().min(0,"Enter a valid weight").optional(),
        rpe: z.coerce.number().min(0,"Enter a valid rpe").optional(),
        minutes: z.coerce.number().min(0,"Enter a valid number of minutes"),
        metres: z.coerce.number().min(0,"Enter a valid number of metres").optional(),
        calories: z.coerce.number().min(0,"Enter a valid number of calories").optional(),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            reps: 0,
            weight: 0,
            rpe: 0,
            minutes: 0,
            metres: 0,
            calories: 0,
        },
    });

    useEffect(() => {
        loadIcons(["ph:plus-circle-light"]);
        console.log("editsetform from:", state.from);
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
                // const workouts = await getJson(`/api/workouts/user/${meId}`);

                let set = null;
                let reps = 0;
                let weight = 0;
                let rpe = 0;
                let minutes = 0;
                let metres = 0;
                let calories = 0;


                console.log("sessionOrRoutineId: ", sessionOrRoutineId);

                if (isWorkout) {
                    const exercises = await getJson(`/api/workouts/${sessionOrRoutineId}/exercises`);
                    const exercise = exercises.find((exercise) => exercise.sessionExerciseId == sessionOrRoutineExerciseId);
                    setExercise(exercise);
                    set = exercise.sets.find((set) => set.sessionSetId == sessionOrRoutineSetId);

                    reps = set.reps;
                    weight = set.weight;
                    rpe = set.rpe;
                    minutes = set.durationMin;
                    metres = set.distanceM;
                    calories = set.calories;
                }
                else {
                    const routine = await getJson(`/api/routines/${sessionOrRoutineId}`);
                    const exercises = routine.exercises;
                    const exercise = exercises.find((exercise) => exercise.routineExerciseId == sessionOrRoutineExerciseId);
                    setExercise(exercise);
                    set = exercise.sets.find((set) => set.routineSetId == sessionOrRoutineSetId);


                    reps = set.targetReps;
                    weight = set.targetWeight;
                    minutes = set.targetDurationMin;
                    metres = set.targetDistanceM;
                }


                // console.log("workouts: ", workouts);
                // console.log("exercise: ", exercise);
                // console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");
                // console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");
                // const p = workouts;

                console.log("minutes", minutes);
                console.log("calories", calories);
                console.log("metres", metres);

                form.reset({
                    reps: reps,
                    weight: weight,
                    rpe: rpe,
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

    const onSubmit = async (values) => {
        console.log("Form submission 135");
        console.log("1. EditSetForm onSubmit starting with values:", values);

        try {
            // Update entire workout

            console.log("onSubmit edit set");


            // const exercises = await getJson(`/api/workouts/${sessionOrRoutineId}/exercises`);
            //
            // const exercise = exercises.find((exercise) => exercise.exerciseId == sessionOrRoutineExerciseId);
            // const updatedExercises = exercises.find((exercise) => exercise.exerciseId != sessionOrRoutineExerciseId);
            //
            // const set = exercise.sets.find((set) => set.sessionSetId == sessionSetId);
            // const updatedSets = exercise.sets.filter((set) => set.sessionSetId != sessionSetId);

            let updatedExercises = null;
            let updatedSets = null;

            if (isWorkout) {
                const exercises = await getJson(`/api/workouts/${sessionOrRoutineId}/exercises`);
                const exercise = exercises.find((exercise) => exercise.sessionExerciseId == sessionOrRoutineExerciseId);
                updatedExercises = exercises.filter((exercise) => exercise.sessionExerciseId != sessionOrRoutineExerciseId);
                const set = exercise.sets.find((set) => set.sessionSetId == sessionOrRoutineSetId);
                updatedSets = exercise.sets.filter((set) => set.sessionSetId != sessionOrRoutineSetId);

                const updatedSet = {
                    sessionSetId: set.sessionSetId,
                    setOrder: set.setOrder,
                    reps: values.reps,
                    weight: values.weight,
                    rpe: set.rpe,
                    durationMin: values.minutes,
                    distanceM: values.metres,
                    caloriesBurned: set.caloriesBurned,
                }

                updatedSets.push(updatedSet);


                console.log("updatedSets: ", updatedSets);

                const updatedExercise = {
                    sessionExerciseId: exercise.sessionExerciseId, // Existing exercise
                    exerciseId: exercise.exerciseId,
                    type: exercise.type,
                    sortOrder: exercise.sortOrder,
                    notes: exercise.notes,
                    sets: updatedSets
                }

                // otherExercises.
                updatedExercises.push(updatedExercise);

            }
            else {
                console.log("searching for exercise with routine id: ", sessionOrRoutineExerciseId);
                const routine = await getJson(`/api/routines/${sessionOrRoutineId}`);
                const exercises = routine.exercises;
                const exercise = exercises.find((exercise) => exercise.routineExerciseId == sessionOrRoutineExerciseId);
                updatedExercises = exercises.filter((exercise) => exercise.routineExerciseId != sessionOrRoutineExerciseId);
                const set = exercise.sets.find((set) => set.routineSetId == sessionOrRoutineSetId);
                updatedSets = exercise.sets.filter((set) => set.routineSetId != sessionOrRoutineSetId);

                const updatedSet = {
                    setOrder: set.setOrder,
                    targetReps: values.reps,
                    targetWeight: values.weight,
                    targetDurationMin: values.minutes,
                    targetDistanceM: values.metres,
                }

                updatedSets.push(updatedSet);


                console.log("updatedSets: ", updatedSets);
                console.log("found exercise.routineExerciseId:", exercise.routineExerciseId);

                const updatedExercise = {
                    routineExerciseId: exercise.routineExerciseId, // Existing exercise
                    exerciseId: exercise.exerciseId,
                    type: exercise.type,
                    sortOrder: exercise.sortOrder,
                    notes: exercise.notes,
                    sets: updatedSets
                }

                // otherExercises.
                updatedExercises.push(updatedExercise);
            }


            // const updatedSet = {
            //     sessionSetId: set.sessionSetId,
            //     setOrder: set.setOrder,
            //     reps: set.reps,
            //     weight: set.weight,
            //     rpe: set.rpe,
            //     durationMin: set.minutes,
            //     distanceM: set.metres,
            //     caloriesBurned: set.calories,
            // }
            //
            // updatedSets.push(updatedSet);
            console.log("updatedExercises: ", updatedExercises);

            if (isWorkout) {

                const workout = await getJson(`/api/workouts/${sessionOrRoutineId}`);

                const updatedWorkout = {
                    name: workout.name,
                    date: workout.date,
                    startTime: workout.startTime,
                    endTime: workout.endTime,
                    notes: workout.notes,
                    exercises: updatedExercises
                };

                const updateResult = await putJson(`/api/workouts/${sessionOrRoutineId}`, updatedWorkout);

            }
            else {

                const routine = await getJson(`/api/routines/${sessionOrRoutineId}`);

                const updatedRoutine = {
                    name: routine.name,
                    date: routine.date,
                    startTime: routine.startTime,
                    endTime: routine.endTime,
                    notes: routine.notes,
                    exercises: updatedExercises
                };

                const updateResult = await putJson(`/api/routines/${sessionOrRoutineId}`, updatedRoutine);

            }


            // console.log("updatedWorkout: ", updatedWorkout);
            //
            // const updateResult = await putJson(`/api/workouts/${sessionOrRoutineId}`, updatedWorkout);

            modal.showSuccess(
                "Changes Saved",
                "Your set has been updated."
            );

            setCrossClicked(true);

            return true;

            // console.log("updatedWorkout: ", updatedWorkout);

        } catch (e) {
            modal.showError(
                "Save Failed",
                e?.message || "We couldn’t save your set."
            );
            throw e;
        }
    };

    const submitHandler = form.handleSubmit(onSubmit);

    // const wrappedSubmitHandler = form.handleSubmit((values) => {
    //     console.log("2. Form handleSubmit wrapper called");
    //     return onSubmit(values);
    // });

    // console.log("3. Creating wrapped submit handler:", wrappedSubmitHandler);


    useEffect(() => {
        if (crossClicked) {
            // navigate(-1);
            console.log("exercise, ", exercise);
            console.log("edit set form  state.from", state.from);
            setCrossClicked(!crossClicked);
            const navTo = "/" + state.from.at(-1).toString();
            navigate(navTo, {
                state: {
                    isCardio: (exercise.type == "WEIGHT") ? false : true,
                    workoutId: sessionOrRoutineId,
                    exerciseSortOrder: exercise.sortOrder,
                    exerciseId: null,
                    // exerciseId: (isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId),
                    exerciseName: exercise.exerciseName,
                    description: exercise.description,
                    dateOfExercise: dateOfExercise,
                    parentClick: navigate("/"),
                    isWorkout: isWorkout,
                    optionId: exercise.exerciseId,

                    from: state.from.slice(0, -1) // Take all except last
                }
            });
        }
    }, [crossClicked, navigate]);



    return (
        <DashboardLayout>
            <section>
                <Header
                    title="Edit Set"
                    leftSlot={
                        <h6 className="mb-4 text-primary">Edit Set</h6>
                    }
                    rightSlot={
                        <div className="flex flex-row justify-between pt-4 pb-3 gap-1">
                            <PrimaryIconButton type="submit" form="edit_set_form">
                                <Check className="w-6 h-6 text-primary" />
                            </PrimaryIconButton>
                            <SecondaryIconButton onClick={() => setCrossClicked(true)}>
                                <X className="w-6 h-6 text-primary" />
                            </SecondaryIconButton>
                        </div>
                    }
                />

                {/*sessionOrRoutineSetId: set.sessionOrRoutineSetId,*/}
                {/*setOrder: set.setOrder,*/}

                {/*reps: set.reps,*/}
                {/*weight: set.weight,*/}
                {/*rpe: set.rpe,*/}
                {/*durationMin: set.minutes,*/}
                {/*distanceM: set.metres,*/}
                {/*caloriesBurned: set.calories,*/}

                <form id="edit_set_form"
                      // onSubmit={form.handleSubmit(onSubmit)}
                      onSubmit={form.handleSubmit(
                          (values) => {
                              console.log("✅ RHF validated — calling onSubmit", values);
                              return onSubmit(values);
                          },
                          (errors) => {
                              console.log("❌ RHF validation errors:", errors);
                          }
                      )}
                      noValidate className="flex flex-col gap-4">
                    {/*<SetFormLayout*/}
                    {/*    isWorkout={state.isWorkout}*/}
                    {/*    setId={sessionOrRoutineSetId}*/}
                    {/*    exerciseId={sessionOrRoutineExerciseId}*/}
                    {/*    sessionId={sessionOrRoutineId}*/}
                    {/*    dateOfExercise={dateOfExercise}*/}
                    {/*    submitHandler={submitHandler}*/}
                    {/*>*/}
                    {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    <Controller
                        control={form.control}
                        name="reps"
                        render={({ field }) => (
                            <DecimalInput
                                label="Number of Reps"
                                placeholder="Enter the number of reps"
                                value={field.value ?? 0}
                                onChange={(val) => field.onChange(val === "" ? "" : val)}
                                ref={field.ref}
                                error={form.formState.errors.reps?.message}
                                isRequired={false}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <DecimalInput
                                label="Weight"
                                placeholder="Enter the weight"
                                value={field.value ?? 0}
                                onChange={(val) => field.onChange(val === "" ? "" : val)}
                                ref={field.ref}
                                error={form.formState.errors.weight?.message}
                                isRequired={false}
                            />
                        )}
                    />
                    {isWorkout &&
                        <Controller
                            control={form.control}
                            name="rpe"
                            render={({ field }) => (
                                <DecimalInput
                                    label="RPE"
                                    placeholder="Enter the rpe"
                                    value={field.value ?? 0}
                                    onChange={(val) => field.onChange(val === "" ? "" : val)}
                                    ref={field.ref}
                                    error={form.formState.errors.rpe?.message}
                                    isRequired={false}
                                />
                            )}
                        />
                    }
                    <Controller
                        control={form.control}
                        name="minutes"
                        render={({ field }) => (
                            <DecimalInput
                                label="Number of Minutes"
                                placeholder="Enter the number of minutes"
                                value={field.value ?? 0}
                                onChange={(val) => field.onChange(val === "" ? "" : val)}
                                ref={field.ref}
                                error={form.formState.errors.minutes?.message}
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
                            value={field.value ?? 0}
                            onChange={(val) => field.onChange(val === "" ? "" : val)}
                            ref={field.ref}
                            error={form.formState.errors.metres?.message}
                            isRequired={false}
                        />
                        )}
                    />
                    {isWorkout &&
                        <Controller
                            control={form.control}
                            name="calories"
                            render={({ field }) => (
                                <DecimalInput
                                    label="Number of Calories"
                                    placeholder="Enter the number of calories"
                                    value={field.value ?? 0}
                                    onChange={(val) => field.onChange(val === "" ? "" : val)}
                                    ref={field.ref}
                                    error={form.formState.errors.calories?.message}
                                    isRequired={false}
                                />
                            )}
                        />
                    }
                    {/*</div>*/}

                    {/*</SetFormLayout>*/}
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
        </DashboardLayout>
    );
}
