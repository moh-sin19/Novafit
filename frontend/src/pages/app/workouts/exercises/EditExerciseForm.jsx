import CardioExerciseForm from "./CardioExerciseForm";
import StrengthExerciseForm from "./StrengthExerciseForm";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ExerciseFormLayout from "./ExerciseFormLayout";
// { isCardio, exerciseName, description, parentClick }
export default function EditExerciseForm() {
    const location = useLocation();
    const state  = location.state || {};
    const isCardio = state.isCardio || false;
    const workoutId = state.workoutId || "";
    const exerciseId = state.exerciseId || "";
    const exerciseName = state.exerciseName || "";
    const description = state.description || "";
    const dateOfExercise = state.dateOfExercise || "";
    const parentClick = state.parentClick || null;
    const isWorkout = state.isWorkout || false;

    const [submitHandler, setSubmitHandler] = useState(null);

    return (
        <div>
            {isCardio &&
                // <ExerciseFormLayout isCardio={true} exerciseName={exerciseName} description={description} submitHandler={submitHandler ?? (() => {})} parentClick={submitHandler ?? (() => {})}>
                    <CardioExerciseForm addingNew={false} isWorkout={isWorkout} workoutId={workoutId} exerciseId={exerciseId} exerciseName={exerciseName}
                                        description={description} dateOfExercise={dateOfExercise}
                                        setSubmitHandler={setSubmitHandler ?? (() => {})}
                                        parentClick={submitHandler ?? (() => {})}>
                        {/*{children}*/}
                    </CardioExerciseForm>
                // </ExerciseFormLayout>
            }
            {!state.isCardio &&
                // <ExerciseFormLayout isCardio={false} exerciseName={exerciseName} description={description} submitHandler={submitHandler ?? (() => {})} parentClick={submitHandler ?? (() => {})}>
                    <StrengthExerciseForm addingNew={false} isWorkout={isWorkout} workoutId={workoutId} exerciseId={exerciseId} exerciseName={exerciseName}
                                          description={description} dateOfExercise={dateOfExercise}
                                          setSubmitHandler={setSubmitHandler ?? (() => {})}
                                          parentClick={submitHandler ?? (() => {})}>
                    {/*{children}*/}
                    </StrengthExerciseForm>
                // </ExerciseFormLayout>
            }
        </div>
    );
}