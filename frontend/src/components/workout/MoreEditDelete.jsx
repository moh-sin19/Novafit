import {Icon, loadIcons} from "@iconify/react";
import {use, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getJson, putJson} from "../../utils/api";
import useModal from "../../hooks/useModal";
import Modal from "../ui/Modal";


export default function MoreEditDelete({ isFromExercise, isWorkout, currentSessionId, sessionOrRoutineExerciseId, toEditId, isCardio, dateOfExercise, updateListHandler }) {
    // loadIcons(["lucide:pencil", "lucide:trash", "lucide:more-vertical"]);
    const [more1Clicked, setMore1Clicked] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [binClicked, setBinClicked] = useState(false);
    const [exercisesOrSets, setExercisesOrSets] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const modal = useModal();

    console.log("currsessid:", currentSessionId);

    useEffect(() => {
        console.log("22 exercisesOrSets: ", exercisesOrSets);
    }, [exercisesOrSets]);

    useEffect(() => {
        (async () => {
            try {
                if (!isFromExercise && isWorkout) {
                    //Workout
                    const sessionExercises = await getJson(`/api/workouts/${currentSessionId}/exercises`);
                    // console.log("session: ", session);
                    // const sessionExercises = session.exercises;
                    console.log("workouts: ", sessionExercises);
                    console.log("workouts[0]: ", sessionExercises[0]);
                    setExercisesOrSets(sessionExercises);
                }
                else if (!isFromExercise && !isWorkout) {
                    //Routine
                    const session = await getJson(`/api/routines/${currentSessionId}`);
                    console.log("session: ", session);
                    const sessionExercises = session.exercises;
                    console.log("workouts: ", sessionExercises);
                    console.log("workouts[0]: ", sessionExercises[0]);
                    setExercisesOrSets(sessionExercises);
                }
                else if (isFromExercise && isWorkout) {
                    //Exercise from Workout
                    const exercises = await getJson(`/api/workouts/${currentSessionId}/exercises`);
                    const exercise = exercises.find((exercise) => (exercise.sessionExerciseId == sessionOrRoutineExerciseId));
                    // const sessionExercises = session.exercises;
                    // console.log("workouts: ", sessionExercises);
                    // console.log("workouts[0]: ", sessionExercises[0]);
                    const sets = exercise.sets;
                    // console.log("workouts: ", sessionExercises);
                    // console.log("workouts[0]: ", sessionExercises[0]);
                    setExercisesOrSets(sets);
                }
                else if (isFromExercise && !isWorkout) {
                    //Exercise from Routine
                    const session = await getJson(`/api/routines/${currentSessionId}`);
                    console.log("!!\t\tcurrentSessionId: ", currentSessionId);
                    console.log("!!\t\tsession: ", session);
                    const exercises = session.exercises;
                    console.log("!!\t\texercises: ", exercises);
                    console.log("sessionOrRoutineExerciseId: ", sessionOrRoutineExerciseId);
                    const exercise = exercises.find((exercise) => (exercise.routineExerciseId == sessionOrRoutineExerciseId));
                    console.log("exercise: ", exercise);
                    // const sessionExercises = session.exercises;
                    // console.log("workouts: ", sessionExercises);
                    // console.log("workouts[0]: ", sessionExercises[0]);
                    const sets = exercise.sets;
                    console.log("!!\t\tsets: ", sets);
                    // console.log("workouts[0]: ", sessionExercises[0]);
                    setExercisesOrSets(sets);
                }


                // console.log("session: ", session);
                // const sessionExercises = session.exercises;
                // console.log("workouts: ", sessionExercises);
                // console.log("workouts[0]: ", sessionExercises[0]);
                // setExercisesOrSets(sessionExercises);
                // setCurrentSession(workouts[0]);

                // console.log("workouts: ", workouts);

            } catch (e) {
                console.log("Couldn’t load exercise form (MoreEditDelete):", e);
            }
        })();
    }, [setExercisesOrSets]);

    useEffect(() => {
        if (editClicked) {
            console.log("location", location);
            let locations = []
            if (location.state != null) {
                locations = [...location.state.from];
            }
            console.log("locations", locations);

            locations.push(location.pathname.replace("/", "")); // Remove "/"
            console.log(locations);
            console.log("exercisesOrSets", exercisesOrSets);
            if (exercisesOrSets != null) {
                if (isFromExercise) {
                    console.log("toEditId: ", toEditId);
                    let set = {};
                    let start = '/app/workouts/';
                    if (isWorkout) {
                        start += 'sessions/';
                        set = exercisesOrSets.find((set) => set.sessionSetId == toEditId);
                        console.log(set);
                    }
                    else {
                        start += 'routines/';
                        set = exercisesOrSets.find((set) => set.routineSetId == toEditId);
                        console.log(set);
                    }
                    navigate(`${start}${currentSessionId}/exercises/${sessionOrRoutineExerciseId}/sets/${toEditId}`, {
                        state: {
                            isWorkout: isWorkout,
                            sessionOrRoutineId: currentSessionId,
                            sessionOrRoutineExerciseId: sessionOrRoutineExerciseId,
                            sessionOrRoutineSetId: toEditId,

                            from: locations, // List ("stack") of previous location
                        }
                    });
                }
                else {
                    let sessionExercise = {};
                    // const sessionExercise = exercisesOrSets.find((ex) => ex.exerciseId == toEditId);
                    console.log("exercises or sets: ", exercisesOrSets);
                    console.log(sessionExercise);
                    let start = '/app/workouts/';
                    if (isWorkout) {
                        start += 'sessions/';
                        sessionExercise = exercisesOrSets.find((ex) => ex.sessionExerciseId == toEditId);
                    }
                    else {
                        start += 'routines/';
                        sessionExercise = exercisesOrSets.find((ex) => ex.routineExerciseId == toEditId);
                    }

                    console.log("more edit delete isworkout: ", isWorkout);
                    navigate(`${start}${currentSessionId}/exercises/${sessionOrRoutineExerciseId}`, {
                        state: {
                            isCardio: (sessionExercise.type == "WEIGHT") ? false : true,
                            workoutId: currentSessionId,
                            exerciseId: (isWorkout ? sessionExercise.sessionExerciseId : sessionExercise.routineExerciseId),
                            exerciseName: sessionExercise.exerciseName,
                            description: sessionExercise.description,
                            dateOfExercise: dateOfExercise,
                            parentClick: navigate("/"),
                            isWorkout: isWorkout,

                            from: locations, // List ("stack") of previous location
                        }});
                }
            }
        }
    }, [exercisesOrSets, editClicked, navigate]);


    useEffect(() => {
        if (binClicked) {
            (async () => {
                try {
                    console.log("Bin clicked, sessionOrRoutineExerciseId = ", sessionOrRoutineExerciseId);
                    if (sessionOrRoutineExerciseId != null) {
                        if (isFromExercise) {
                            if (isWorkout) {
                                // const session = await putJson(`/api/workouts/${currentSessionId}`);
                                // const exercises = await putJson(`/api/workouts/${currentSessionId}`);
                                // const exercise = exercises.find((exercise) => exercise.sessionExerciseId == sessionOrRoutineExerciseId);
                                // console.log("exercise: ", exercise);
                                // setExercise(exercise);

                                const session = await getJson(`/api/workouts/${currentSessionId}`);
                                console.log(" session : ",  session );
                                const exercise = session.exercises.find((exercise) => exercise.sessionExerciseId == sessionOrRoutineExerciseId);
                                const exercisesWithRemoval = session.exercises.filter((exercise) => exercise.sessionExerciseId != sessionOrRoutineExerciseId);

                                const setsWithRemoval = exercise.sets.filter((set) => set.sessionSetId != toEditId);
                                // const updatedSets = exercise.sets;

                                const exerciseWithRemoval = {
                                    sessionExerciseId: exercise.sessionExerciseId,
                                    exerciseId: exercise.exerciseId,
                                    type: exercise.type,
                                    sortOrder: exercise.sortOrder,
                                    notes: exercise.notes,
                                    sets: setsWithRemoval
                                }

                                exercisesWithRemoval.push(exerciseWithRemoval);

                                const body = {
                                    date: session.date,
                                    startTime: session.startTime,
                                    endTime: session.endTime,
                                    notes: session.notes,
                                    exercises: exercisesWithRemoval
                                }

                                const sessionResponse = await putJson(`/api/workouts/${currentSessionId}`, body);
                                console.log("sessionResponse : ",  sessionResponse);

                                updateListHandler(sessionResponse);

                                modal.showSuccess(
                                    "Deleted",
                                    "Your workout session has been updated."
                                );
                            }
                            else {

                                const routine = await getJson(`/api/routines/${currentSessionId}`);
                                console.log(" routine : ",  routine );
                                const exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == sessionOrRoutineExerciseId);
                                const exercisesWithRemoval = routine.exercises.filter((exercise) => exercise.routineExerciseId != sessionOrRoutineExerciseId);

                                const setsWithRemoval = exercise.sets.filter((set) => set.routineSetId != toEditId);
                                // const updatedSets = exercise.sets;

                                const exerciseWithRemoval = {
                                    routineExerciseId: exercise.routineExerciseId,
                                    exerciseId: exercise.exerciseId,
                                    type: exercise.type,
                                    sortOrder: exercise.sortOrder,
                                    notes: exercise.notes,
                                    sets: setsWithRemoval
                                }

                                exercisesWithRemoval.push(exerciseWithRemoval);

                                const body = {
                                    name: routine.name,
                                    date: routine.date,
                                    startTime: routine.startTime,
                                    endTime: routine.endTime,
                                    notes: routine.notes,
                                    exercises: exercisesWithRemoval
                                }

                                const routineResponse = await putJson(`/api/routines/${currentSessionId}`, body);
                                console.log("routineResponse : ",  routineResponse);
                                // const exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == exerciseId);
                                // console.log("exercise: ", exercise);
                                // setExercise(exercise);

                                updateListHandler(routineResponse);

                                modal.showSuccess(
                                    "Deleted",
                                    "Your routine has been updated."
                                );
                            }
                        }
                        else {
                            if (isWorkout) {
                                const session = await getJson(`/api/workouts/${currentSessionId}`);
                                console.log(" session : ",  session );
                                // const exercise = session.exercises.find((exercise) => exercise.sessionExerciseId == sessionOrRoutineExerciseId);
                                const exercisesWithRemoval = session.exercises.filter((exercise) => exercise.sessionExerciseId != sessionOrRoutineExerciseId);

                                const body = {
                                    date: session.date,
                                    startTime: session.startTime,
                                    endTime: session.endTime,
                                    notes: session.notes,
                                    exercises: exercisesWithRemoval
                                }

                                const sessionResponse = await putJson(`/api/workouts/${currentSessionId}`, body);
                                console.log("sessionResponse : ",  sessionResponse);

                                updateListHandler(sessionResponse);

                                modal.showSuccess(
                                    "Deleted",
                                    "Your workout session has been updated."
                                );
                            }
                            else {
                                const routine = await getJson(`/api/routines/${currentSessionId}`);
                                console.log(" routine : ",  routine );
                                const exercisesWithRemoval = routine.exercises.filter((exercise) => exercise.routineExerciseId != sessionOrRoutineExerciseId);
                                console.log("exercises with removal", exercisesWithRemoval);
                                const body = {
                                    name: routine.name,
                                    date: routine.date,
                                    startTime: routine.startTime,
                                    endTime: routine.endTime,
                                    notes: routine.notes,
                                    exercises: exercisesWithRemoval
                                }

                                const routineResponse = await putJson(`/api/routines/${currentSessionId}`, body);
                                console.log("routineResponse : ",  routineResponse);

                                updateListHandler(routineResponse);

                                modal.showSuccess(
                                    "Deleted",
                                    "Your routine has been updated."
                                );

                                // const routine = await getJson(`/api/routines/${currentSessionId}`);
                                // console.log(" routine : ",  routine );
                                // const exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == sessionOrRoutineExerciseId);
                                // const exercisesWithRemoval = routine.exercises.filter((exercise) => exercise.routineExerciseId == sessionOrRoutineExerciseId);
                                //
                                // const setsWithRemoval = exercise.sets.filter((set) => set.routineSetId != toEditId);
                                // // const updatedSets = exercise.sets;
                                //
                                // const exerciseWithRemoval = {
                                //     routineExerciseId: exercise.routineExerciseId,
                                //     exerciseId: exercise.exerciseId,
                                //     type: exercise.type,
                                //     sortOrder: exercise.sortOrder,
                                //     notes: exercise.notes,
                                //     sets: setsWithRemoval
                                // }
                                //
                                // exercisesWithRemoval.push(exerciseWithRemoval);
                                //
                                // const body = {
                                //     date: routine.date,
                                //     startTime: routine.startTime,
                                //     endTime: routine.endTime,
                                //     notes: routine.notes,
                                //     exercises: exercisesWithRemoval
                                // }
                                //
                                // const routineResponse = await putJson(`/api/routines/${currentSessionId}`, body);
                                // console.log("routineResponse : ",  routineResponse);
                                // const exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == exerciseId);
                                // console.log("exercise: ", exercise);
                                // setExercise(exercise);
                            }
                        }

                    }

                } catch (e) {
                    modal.showError(
                        "Couldn’t load your information",
                        e?.message || "Please try again or re-login."
                    );
                }
            })();
        }
    }, [exercisesOrSets, binClicked, navigate]);

    return (
        <div className="flex flex-row justify-end items-center gap-2 h-[100%]">
            {more1Clicked && (
                <div className="h-[40px] w-[90px] card flex flex-row justify-evenly items-center">
                    <Icon icon="lucide:pencil" className="text-primary h-8" onClick={() => setEditClicked(!editClicked)}></Icon>
                    <Icon icon="lucide:trash" className="text-red-600 h-8" onClick={() => setBinClicked(!binClicked)}></Icon>
                </div>
            )}
            <Icon icon="lucide:more-vertical" height="25px" className="text-primary" onClick={() => setMore1Clicked(!more1Clicked)}></Icon>
            <Modal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                description={modal.description}
                confirmText={modal.confirmText}
                onClose={modal.close}
                onConfirm={modal.close}
            />
        </div>
    );
}