import {Icon, loadIcons} from "@iconify/react";
import {useEffect, useState} from "react";
import { useNavigate, useLocation} from "react-router-dom";

export default function RoutineCard({ keyForDiv, routineId, name, notes, exercisesList }) {
    loadIcons(["ph:plus-circle-light"]);
    const navigate = useNavigate();
    console.log("routineId", routineId);
    const location = useLocation();
    // name = state.name;
    // duration = state.duration;
    // calories = state.calories;
    // routineId = state.routineId;

    console.log(exercisesList);

    console.log(name);
    // console.log();
    //
    let stringActivities = "Loading..."
    if (typeof exercisesList != "undefined") {
        stringActivities = "";
        for (let i=0; i < exercisesList.length; i++) {
            if (i>0) {
                stringActivities += ","
            }
            console.log("exercise: ", exercisesList[i]);
            const exName = exercisesList[i].exerciseName;
            stringActivities += (" " + exName.toString());
        }
        // for (const exercise in exercisesList) {
        //     console.log("exercise: ", exercise)
        //     const exName = exercise.exerciseName;
        //     stringActivities += exName;
        // }
        // stringActivities = exercisesList.toString();
    }
    console.log(stringActivities);


    const [plusClicked, setPlusClicked] = useState(false);

    // const handleIconClick = (() => {
    //     navigate(`/app/workouts/routines/${routineId}`, {
    //         state: {
    //             id: routineId,
    //             name: name,
    //             // duration: routineId,
    //             // calories: routineId,
    //             notes: notes,
    //             exercises: exercisesList,
    //         }
    //     })
    // }, [navigate, routineId]);
    //
    // const handleEditRoutine = ({ editRoutineId }) => {
    //     console.log("handle edit routine called with ", editRoutineId);
    //     navigate(`routines/${editRoutineId}`);
    // };


    const handleEditRoutine = ( editRoutineId ) => {
        console.log("handle edit routine called with ", editRoutineId);
        console.log("path", `/app/workouts/routines/${editRoutineId}`);

        console.log("location.pathname: ", location.pathname);
        const locations = [location.pathname.replace("/", "")]; // Remove "/"
        console.log("Routine card locations: ", locations);

        console.log("location.pathname: ", location.pathname);
        navigate(`/app/workouts/routines/${editRoutineId}`, {
            state: {
                id: editRoutineId,
                from: locations, // List ("stack") of locations
            }
        });
    };


    return (
        <div key={keyForDiv} className="flex flex-col items-start no-shadow-card">
            <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">
                    <div className="b1 text-primary">{name}</div>
                    <div className="p3 text-secondary">{stringActivities}</div>
                </div>
                <Icon icon="lucide:pencil" height="3%" onClick={() => {
                    console.log("routineid circle: ", routineId);
                    handleEditRoutine(routineId);
                }}></Icon>
            </div>
            <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                <div className="flex flex-row justify-start mx-6 py-1.5 border-subtle">
                    <div className="p3 text-primary">{notes}</div>
                </div>
                {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                {/*    <div className="p3 text-primary">Est Duration</div>*/}
                {/*    <div className="p3 text-secondary">{duration}</div>*/}
                {/*</div>*/}
                {/*<div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                {/*    <div className="p3 text-primary">Est Calories</div>*/}
                {/*    <div className="p3 text-secondary">{calories} kcal</div>*/}
                {/*</div>*/}
            </div>
        </div>

    );
}