import MoreEditDelete from "./MoreEditDelete";
import {Icon} from "@iconify/react";
import {useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function ListOfExercises({ title, sessionOrRoutine, updateSessionOrRoutineHandler, isWorkout, workoutId, dateOfExercise }) {
    const [sessionOrRoutineVar, setSessionOrRoutineVar] = useState(sessionOrRoutine);
    console.log("session or routine, ", sessionOrRoutineVar);
    const state = useLocation().state;

    let navRoute = "";
    if (isWorkout) {
        navRoute = `sessions/${workoutId}/exercises/addExercise`;
    }
    else {
        navRoute = `exercises/addExercise`;
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (isWorkout) {
            updateSessionOrRoutineHandler(sessionOrRoutineVar);
        }
        else {
            updateSessionOrRoutineHandler(sessionOrRoutineVar);
        }
    }, [sessionOrRoutineVar]);

    const handleAddExercise = () => {
        console.log("handle add exercise, nav to navRoute:", navRoute, " with isWorkout: ", isWorkout, "and workoutId: ", workoutId);
        console.log("location", location);
        let locations = []
        if (locations.state != null) {
            locations = location.state.from;
        }

        locations.push(location.pathname.replace("/", "")); // Remove "/"
        console.log(locations);

        navigate(navRoute, {
            state: {
                isWorkout: isWorkout,
                workoutId: workoutId,
                from: locations
            }
        });
        // navigate("exercises/addExercise");
    };

    if (sessionOrRoutineVar == null) {
        return (
            <div className="flex flex-col items-start no-shadow-card w-[100%]">
                <h6 className="p-6 w-[100%] text-primary">{title}</h6>
                <Icon icon="ph:plus-circle-light" height="3%" onClick={() => {
                    handleAddExercise();
                }}></Icon>
            </div>
        );
    }
    else {
        let startText = "";
        if (isWorkout) {
            startText = `session${sessionOrRoutineVar.workoutId}`;
            // start at workouts page
        }
        else {
            startText = `routine${sessionOrRoutineVar.routineId}`;
            // start at routine page
        }

        const sessionOrRoutineVarUpdate = (updatedSessionOrRoutine) => {
            setSessionOrRoutineVar(updatedSessionOrRoutine);
            console.log("intended updated session or var: ", updatedSessionOrRoutine);
            console.log("updated session or var: ", sessionOrRoutineVar);
        };

        return (
            <div className="flex flex-col items-start no-shadow-card w-[100%]">
                <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                    <h6 className="p-6 text-primary">{title}</h6>
                    <Icon icon="ph:plus-circle-light" height="3%" onClick={() => {
                        handleAddExercise();
                    }}></Icon>
                </div>
                {/*<h6 className="p-6 text-primary">{title}</h6>*/}
                <div className="py-3 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                    <div className="flex flex-col w-[100%]">
                        {sessionOrRoutineVar.exercises &&
                            sessionOrRoutineVar?.exercises.map((exercise, index) => (
                                <div key={`${startText}_exercise${isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId}`}
                                     id={`${startText}_exercise${isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId}`}
                                     className="mx-6 py-3 px-3 border-subtle flex flex-row justify-between items-center">
                                    <div>
                                        <div className="sh2 text-primary">{exercise.exerciseName}</div>
                                        <div className="p3 text-secondary">{exercise.notes}</div>
                                    </div>
                                    <MoreEditDelete
                                        isFromExercise={false}
                                        isWorkout={isWorkout}
                                        currentSessionId={isWorkout ? sessionOrRoutineVar.workoutId : sessionOrRoutineVar.routineId}
                                        updateListHandler={(updatedSession) => sessionOrRoutineVarUpdate(updatedSession)}
                                        sessionOrRoutineExerciseId={isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId}
                                        toEditId={isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId}
                                        isCardio={exercise.type == "WEIGHT" ? false : true}
                                        dateOfExercise={dateOfExercise}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}