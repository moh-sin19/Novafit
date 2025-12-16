import CardioExerciseForm from "./CardioExerciseForm";
import StrengthExerciseForm from "./StrengthExerciseForm";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ExerciseFormLayout from "./ExerciseFormLayout";
// { isCardio, exerciseName, description, parentClick }
export default function AddExerciseForm({ isCardio, workoutId, selected, exerciseName, description, dateOfExercise, parentClick, isWorkout }) {
    const location = useLocation();
    const state  = location.state || {};
    console.log("isWorkout: ", isWorkout);
    // const isCardio = state.isCardio || false;
    // const workoutId = state.workoutId || "";
    // const exerciseId = state.exerciseId || "";
    // const exerciseName = state.exerciseName || "";
    // const description = state.description || "";
    // const dateOfExercise = state.dateOfExercise || "";
    // const parentClick = state.parentClick || null;
    // const isWorkout = state.isWorkout || false;

    // console.log("selectedId: ", selectedId);

    const [submitHandler, setSubmitHandler] = useState(null);

    return (
        <div>
            {/*{isCardio &&*/}
            {/*    // <ExerciseFormLayout isCardio={true} exerciseName={exerciseName} description={description} submitHandler={submitHandler ?? (() => {})} parentClick={submitHandler ?? (() => {})}>*/}
            {/*        <CardioExerciseForm addingNew={true} isWorkout={isWorkout} workoutId={workoutId} exerciseId={exerciseId} exerciseName={exerciseName}*/}
            {/*                            description={description} dateOfExercise={dateOfExercise}*/}
            {/*                            setSubmitHandler={setSubmitHandler ?? (() => {})}*/}
            {/*                            parentClick={submitHandler ?? (() => {})}>*/}
            {/*            /!*{children}*!/*/}
            {/*        </CardioExerciseForm>*/}
                {/*// </ExerciseFormLayout>*/}
            {/*}*/}
            {/*{!state.isCardio &&*/}
            {/*    // <ExerciseFormLayout isCardio={false} exerciseName={exerciseName} description={description} submitHandler={submitHandler ?? (() => {})} parentClick={submitHandler ?? (() => {})}>*/}
            {/*        <StrengthExerciseForm addingNew={true} isWorkout={isWorkout} workoutId={workoutId} exerciseId={exerciseId} exerciseName={exerciseName}*/}
            {/*                              description={description} dateOfExercise={dateOfExercise}*/}
            {/*                              setSubmitHandler={setSubmitHandler ?? (() => {})}*/}
            {/*                              parentClick={submitHandler ?? (() => {})}>*/}
            {/*        /!*{children}*!/*/}
            {/*        </StrengthExerciseForm>*/}
            {/*    // </ExerciseFormLayout>*/}
            {/*}*/}
            <StrengthExerciseForm addingNew={true} isWorkout={isWorkout} workoutId={workoutId} exerciseId={null}
                                  selectedOption={selected} exerciseName={exerciseName}
                                description={description} dateOfExercise={dateOfExercise}
                                setSubmitHandler={setSubmitHandler ?? (() => {})}
                                parentClick={submitHandler ?? (() => {})}>
                {/*{children}*/}
            </StrengthExerciseForm>
            isWorkout, workoutId, exerciseId, optionId, exerciseName, description, dateOfExercise, setSubmitHandler, parentClick
        </div>
    );
}