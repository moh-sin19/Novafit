import MoreEditDelete from "./MoreEditDelete";
import {Icon} from "@iconify/react";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

export default function ListOfSets({ title, exercise, isWorkout, fromAdd, exerciseId, dateOfExercise, currentSessionId }) {
    const [exerciseVar, setExerciseVar] = useState(exercise);
    console.log("exercise, ", exercise);
    console.log("exerciseVar, ", exerciseVar);
    // const state = useLocation().state;
    // const exercise = state.exercise;

    let navRoute = "";
    // if (isWorkout) {
    //     navRoute = `sessions/${workoutId}/exercises/`;
    // }
    // else {
    //     navRoute = `exercises/`;
    // }

    if (fromAdd) {
        navRoute += `exercises/addExercise/sets/addSet`
    }
    else {
        navRoute += `exercises/${exerciseId}/sets/addSet`
    }

    const navigate = useNavigate();

    const handleAddSet = () => {
        let locations = []
        if (locations.state != null) {
            locations = location.state.from;
        }

        locations.push(location.pathname.replace("/", "")); // Remove "/"
        console.log(locations);

        navigate(navRoute, {
            state: {
                isWorkout: isWorkout,
                exerciseId: exerciseId,
                from: locations
            }
        });
    };

    if (exerciseVar == null) {
        return (
            <div className="flex flex-col items-start no-shadow-card w-[100%]">
                <h6 className="p-6 w-[100%] text-primary">{title}</h6>
                <Icon icon="ph:plus-circle-light" height="3%" onClick={() => {
                    handleAddSet();
                }}></Icon>
            </div>
        );
    }
    else {
        let startText = (isWorkout ? `exercise${exerciseVar.sessionExerciseId}` : `exercise${exerciseVar.routineExerciseId}`);

        const setExerciseVarUpdate = (updatedExercise) => {
            setExerciseVar(updatedExercise);
            console.log("intended updated session or var: ", updatedExercise);
            console.log("updated session or var: ", exerciseVar);
        };

        return (
            <div className="flex flex-col items-start no-shadow-card w-[100%]">
                <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                    <h6 className="p-6 text-primary">{title}</h6>
                    <Icon icon="ph:plus-circle-light" height="3%" onClick={() => {
                        handleAddSet();
                    }}></Icon>
                </div>
                {/*<h6 className="p-6 text-primary">{title}</h6>*/}
                <div className="py-3 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                    <div className="flex flex-col w-[100%]">
                        {exerciseVar.sets &&
                            exerciseVar.sets.map((set, index) => (
                                <div key={`${isWorkout ? "session" : "routine"}_${startText}_set${isWorkout ? set.sessionSetId: set.routineSetId}`}
                                     id={`${startText}_set${isWorkout ? set.sessionSetId: set.routineSetId}`}
                                     className="mx-6 py-3 px-3 border-subtle flex flex-row justify-between items-center">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-10">
                                            {((isWorkout && set.reps!=null) || (!isWorkout && set.targetReps!=null)) &&
                                                <div className="sh2 text-primary">{isWorkout ? set.reps : set.targetReps} Reps</div>
                                            }
                                            {((isWorkout && set.weight!=null) || (!isWorkout && set.targetWeight!=null)) &&
                                                <div className="sh2 text-primary">{isWorkout ? set.weight : set.targetWeight}kg</div>
                                            }
                                        </div>
                                        <div className="flex flex-row">
                                            {((isWorkout && set.distanceM!=null) || (!isWorkout && set.targetDistanceM!=null)) &&
                                                <div className="sh2 text-primary">{isWorkout ? set.distanceM : set.targetDistanceM}m</div>
                                            }
                                            {((isWorkout && set.durationMin!=null) || (!isWorkout && set.targetDurationMin!=null)) &&
                                                <div className="sh2 text-primary">{isWorkout ? set.durationMin : set.targetDurationMin} Minutes</div>
                                            }
                                        </div>
                                    </div>
                                    <MoreEditDelete
                                        isFromExercise={true}
                                        isWorkout={isWorkout}
                                        currentSessionId={currentSessionId}
                                        updateListHandler={(updatedExercise) => setExerciseVarUpdate(updatedExercise)}
                                        sessionOrRoutineExerciseId={isWorkout ? exerciseVar.sessionExerciseId : exerciseVar.routineExerciseId}
                                        toEditId={isWorkout ? set.sessionSetId : set.routineSetId}
                                        isCardio={exerciseVar.type == "WEIGHT" ? false : true}
                                        dateOfExercise={dateOfExercise}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}