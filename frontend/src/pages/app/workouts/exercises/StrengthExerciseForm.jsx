import {Icon, loadIcons} from "@iconify/react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import TextInput from "../../../../components/inputs/TextInput";
import NumberInput from "../../../../components/inputs/NumberInput";
import DecimalInput from "../../../../components/inputs/DecimalInput";
import {getJson, postJson, putJson} from "../../../../utils/api";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import ExerciseFormLayout from "../../../../pages/app/workouts/exercises/ExerciseFormLayout";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import useModal from "../../../../hooks/useModal";
import Modal from "../../../../components/ui/Modal";
import SelectInput from "../../../../components/inputs/SelectInput";

export default function StrengthExerciseForm({ addingNew, isWorkout, workoutId, exerciseId, selectedOption, exerciseName, description, dateOfExercise, setSubmitHandler, parentClick }) {
    // loadIcons(["ph:plus-circle-light"]);
    const [type, setType] = useState("CARDIO");
    const [name, setName] = useState(exerciseName);
    const [notes, setNotes] = useState("");
    const [exercise, setExercise] = useState(selectedOption);
    const state = useLocation().state;
    const [exerciseIdState, setExerciseIdState] = useState(() => {
        return exerciseId ?? state?.exerciseId ?? null;
    });
    const exerciseSortOrder = state?.exerciseSortOrder ?? null;

    if (isWorkout == null) {
        isWorkout = state.isWorkout;
    }
    if (workoutId == null) {
        workoutId = state.workoutId;
    }
    // if (optionId == null) {
    //     optionId = state.optionId;
    // }
    if (exerciseName == null) {
        exerciseName = state.exerciseName;
    }
    if (description == null) {
        description = state.description;
    }
    if (dateOfExercise == null) {
        dateOfExercise = state.dateOfExercise;
    }

    const kgToLb = (kg) => (kg == null ? "" : +(kg * 2.2046226218).toFixed(2));
    const lbToKg = (lb) => (lb === "" ? undefined : Number(lb) * 0.45359237);

    const modal = useModal();
    const [plusClicked, setPlusClicked] = useState(false);
    const navigate = useNavigate();

    const schema = z.object({
        name: z.string().trim().min(1, "Required"),
        notes: z.string().trim().min(1, "Enter your notes").optional(),
        type: z.string().trim().min(4, "Enter activity type")
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            notes: "",
            type: "CARDIO",
        },
    });

    useEffect(() => {
        loadIcons(["ph:plus-circle-light"]);
        console.log("from location strengthexform:", state.from);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const meUser = await getJson("/api/users/me");
                const meId = meUser.userId;

                console.log("meId: ", meId);

                let exercise = {};

                if (exerciseIdState != null) {
                    if (isWorkout) {
                        console.log("path: ", `/api/workouts/user/${meId}`);
                        const workouts = await getJson(`/api/workouts/user/${meId}`);

                        console.log("workoutId: ", workoutId);
                        const exercises = await getJson(`/api/workouts/${workoutId}/exercises`);
                        console.log("exercises: ", exercises);
                        console.log("looking for exercise with id: ", exerciseIdState);
                        exercise = exercises.find((exercise) => exercise.sessionExerciseId == exerciseIdState);

                    } else {
                        const routines = await getJson(`/api/routines/user/${meId}`);

                        console.log("routineId: ", workoutId);
                        const routine = await getJson(`/api/routines/${workoutId}`);
                        console.log("routine: ", routine);
                        console.log("looking for exercise with id: ", exerciseIdState);
                        exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == exerciseIdState);

                    }


                    // console.log("workouts: ", workouts);
                    console.log("exercise: ", exercise);
                    console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");
                    console.log("exercise?.sets?? \"\": ", exercise?.sets?? "");

                    if (exercise) {
                        const firstSet = exercise.sets?.[0] ?? null;

                        const name = exercise.exerciseName;
                        const notes = exercise.notes;
                        const type = exercise.type;
                        setName(name);
                        setNotes(notes);
                        setType(type);

                        form.reset({
                            name: name,
                            notes: notes,
                            type: type,
                        });
                    }
                    // else {
                    //     console.log("no exercise found, going with exerciseName prop");
                    //     form.reset({
                    //         name: exerciseName,
                    //         notes: "",
                    //         type: "",
                    //     });
                    // }
                }

                if (!exercise && exerciseSortOrder != null && exerciseName != null) {
                    console.log("trying with sort order and name");
                    if (isWorkout) {
                        console.log("path: ", `/api/workouts/user/${meId}`);
                        // const workouts = await getJson(`/api/workouts/user/${meId}`);

                        console.log("workoutId: ", workoutId);
                        const exercises = await getJson(`/api/workouts/${workoutId}/exercises`);
                        console.log("exercises: ", exercises);
                        console.log("looking for exercise with SortOrder: ", exerciseSortOrder);
                        exercise = exercises.find((exercise) => (exercise.sortOrder == exerciseSortOrder && exercise.exerciseName == exerciseName));

                        if (exercise) {
                            setExerciseIdState(exercise.sessionExerciseId);
                        }

                    } else {
                        const routines = await getJson(`/api/routines/user/${meId}`);

                        console.log("routineId: ", workoutId);
                        const routine = await getJson(`/api/routines/${workoutId}`);
                        console.log("routine: ", routine);
                        console.log("looking for exercise with SortOrder: ", exerciseSortOrder);
                        exercise = routine.exercises.find((exercise) => (exercise.sortOrder == exerciseSortOrder && exercise.exerciseName == exerciseName));

                        if (exercise) {
                            setExerciseIdState(exercise.routineExerciseId);
                        }
                    }
                    console.log("exercise: ", exercise);

                    if (exercise) {
                        const firstSet = exercise.sets?.[0] ?? null;

                        const name = exercise.exerciseName;
                        const notes = exercise.notes;
                        const type = exercise.type;
                        setName(name);
                        setNotes(notes);
                        setType(type);

                        form.reset({
                            name: name,
                            notes: notes,
                            type: type,
                        });
                    }
                    else {
                        form.reset({
                            name: exerciseName,
                            notes: "",
                            type: "",
                        });
                    }

                }
                else {
                    // const options = await getJson(`/api/exercises/all`);
                    // const chosenOption = options.find((opt) => opt.exerciseId == optionId);

                    form.reset({
                        name: exerciseName,
                        notes: "",
                        type: "",
                    });
                }



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
            console.log("form submit strength exercise");

            if (exerciseIdState == null || addingNew) {
                if (isWorkout) {
                    await postJson(`/api/workouts/${workoutId}/exercises/`, {
                        exerciseId: selectedOption.exerciseId,
                        exerciseName: values.name,
                        type: values.type,
                        notes: values.notes,
                        sets: []
                    })
                }
                else {
                    const routine = await getJson(`/api/routines/${workoutId}`);
                    console.log(" routine : ",  routine );
                    const updatedExercises = [...(routine.exercises ?? [])];

                    const newExercises = {
                        exerciseId: selectedOption.exerciseId,
                        exerciseName: values.name,
                        type: values.type,
                        notes: values.notes,
                        sets: [],
                        sortOrder: updatedExercises.length + 1,
                    }

                    updatedExercises.push(newExercises);

                    const routineResponse = await putJson(`/api/routines/${workoutId}`, {
                        name: routine.name,
                        notes: routine.notes,
                        userId: routine.userId,
                        exercises: updatedExercises
                    });


                }

                modal.showSuccess(
                    "Changes Saved",
                    "Your exercise has been created."
                );
            }
            else {
                // Update entire workout

                console.log("onSubmit strength");
                let path = "";
                if (isWorkout) {
                    path = `/api/workouts/${workoutId}`;
                }
                else {
                    path = `/api/routines/${workoutId}`;
                }
                const workout = await getJson(path);

                console.log("workout", workout, "isWorkout", isWorkout);
                const thisExercise = workout.exercises.find((exercise) => (isWorkout ? exercise.sessionExerciseId == exerciseIdState : exercise.routineExerciseId == exerciseIdState));
                const updatedExercises = workout.exercises.filter((exercise) => (isWorkout ? exercise.sessionExerciseId == exerciseIdState : exercise.routineExerciseId != exerciseIdState));

                console.log("values", values);
                // const weightKg =
                //     values.weightUnit === "LB" ? lbToKg(values.weight) : Number(values.weight);
                console.log("180 strengthexerciseform thisExercise", thisExercise);
                const updatedExercise = {
                    // sessionExerciseId: thisExercise.sessionExerciseId, // Existing exercise
                    // exerciseId: (isWorkout ? thisExercise.sessionExerciseId : thisExercise.routineExerciseId),
                    [isWorkout ? "sessionExerciseId" : "routineExerciseId"]: (isWorkout ? thisExercise.sessionExerciseId : thisExercise.routineExerciseId),
                    exerciseId: thisExercise.exerciseId,
                    exerciseName: values.name,
                    type: values.type,
                    sortOrder: thisExercise.sortOrder,
                    notes: values.notes,
                    sets: thisExercise.sets
                }

                // otherExercises
                updatedExercises.push(updatedExercise);
                console.log("updatedExercises: ", updatedExercises);

                if (isWorkout) {
                    const updatedWorkout = {
                        date: workout.date,
                        startTime: workout.startTime,
                        endTime: workout.endTime,
                        notes: workout.notes,
                        exercises: updatedExercises
                    };

                    console.log("updatedWorkout: ", updatedWorkout);

                    const updateResult = await putJson(`/api/workouts/${workout.workoutId}`, updatedWorkout);

                }
                else {
                    const updatedRoutine = {
                        name: workout.name,
                        notes: workout.notes,
                        exercises: updatedExercises
                    };

                    console.log("updatedRoutine: ", updatedRoutine);
                    // console.log("thisExercise.routineId: ", thisExercise.routineId);
                    console.log("workoutId: ", workoutId);
                    const updateResult = await putJson(`/api/routines/${workout.routineId}`, updatedRoutine);
                }

                modal.showSuccess(
                    "Changes Saved",
                    "Your exercise has been updated."
                );
            }
        } catch (e) {
            modal.showError(
                "Save Failed",
                e?.message || "We couldn’t save your strength exercise."
            );
        }
    });

    useEffect(() => {
        setSubmitHandler(onSubmit);
    }, []);

    return (

        <ExerciseFormLayout isWorkout={isWorkout} fromAdd={addingNew} isCardio={false} exerciseObject={exercise} exerciseId={exerciseIdState} sessionId={workoutId} exerciseName={exerciseName} description={description} dateOfExercise={dateOfExercise} parentClick={parentClick} submitHandler={onSubmit}>
            <section>
                <form noValidate className="flex flex-col gap-4">
                    {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            // <DecimalInput
                            //     label="Number of Sets"
                            //     placeholder="Enter the number of sets"
                            //     value={field.value}
                            //     // onChange={field.onChange}
                            //     // {...form.register("sets")}
                            //     onChange={(val) => field.onChange(val === "" ? "" : val)}
                            //     ref={field.ref}
                            //     error={form.formState.errors.sets?.message}
                            //     isRequired={true}
                            // />
                            <TextInput
                                label="Name"
                                placeholder="Name"
                                value={name}
                                onChange={(val) => setName(val)}
                                error={form.formState.errors.name?.message}
                            />
                    )}
                    />
                    {/*</div>*/}
                    {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    <Controller
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            // <DecimalInput
                            //     label="Repetitions per Set"
                            //     placeholder="Enter the number of repetitions per set"
                            //     value={field.value}
                            //     onChange={(val) => field.onChange(val === "" ? "" : val)}
                            //     ref={field.ref}
                            //     error={form.formState.errors.reps?.message}
                            //     isRequired={true}
                            // />

                            <TextInput
                                label="Notes"
                                placeholder="Notes"
                                value={notes}
                                onChange={(val) => setNotes(val)}
                                error={form.formState.errors.notes?.message}
                            />
                        )}
                    />
                    <SelectInput
                        label="type"
                        options={["CARDIO", "WEIGHT"].map((s) => ({
                            value: s,
                            label: s,
                        }))}
                        value={type}
                        onChange={(val) => setType(val)}
                        placeholder="Select a type"
                    />
                    {/*</div>*/}
                    {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    {/*<Controller*/}
                    {/*    control={form.control}*/}
                    {/*    name="weight"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <Controller*/}
                    {/*            control={form.control}*/}
                    {/*            name="weightUnit"*/}
                    {/*            render={({ field: unitField }) => (*/}
                    {/*            <NumberWithUnitInput*/}
                    {/*                label="Weight per Set"*/}
                    {/*                placeholder="Enter the weight per set"*/}
                    {/*                value={field.value}*/}
                    {/*                // onChange={field.onChange}*/}
                    {/*                onChange={(val) => field.onChange(val === "" ? "" : val)}*/}
                    {/*                ref={field.ref}*/}
                    {/*                // onUnitChange={unitField.onChange}*/}
                    {/*                onUnitChange={(val) => unitField.onChange(val === "" ? "" : val)}*/}
                    {/*                ref={unitField.ref}*/}
                    {/*                unitOptions={["KG", "LB"]}*/}
                    {/*                error={form.formState.errors.weight?.message}*/}
                    {/*                isRequired={false}*/}
                    {/*            />*/}
                    {/*            )}*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*/>*/}
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
