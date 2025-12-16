import {Icon, loadIcons} from "@iconify/react";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import TextInput from "../../../../components/inputs/TextInput";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";
import Modal from "../../../../components/ui/Modal";
import DashboardLayout from "../../../../layout/DashboardLayout";
import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Controller} from "react-hook-form";
import SelectInput from "../../../../components/inputs/SelectInput";
import SecondaryIconButton from "../../../../components/buttons/SecondaryIconButton";
import PrimaryIconButton from "../../../../components/buttons/PrimaryIconButton";
import {Check, X} from "lucide-react";
import Header from "../../../../components/dashboard/DashboardHeader";
import ListOfExercises from "../../../../components/workout/ListOfExercises";
import ListOfSets from "../../../../components/workout/ListOfSets";
import {getJson} from "../../../../utils/api";

export default function ExerciseFormLayout({ isWorkout, fromAdd, isCardio, exerciseObject, sessionId, exerciseName, description, dateOfExercise, parentClick, submitHandler, children }) {
    loadIcons(["ph:plus-circle-light"]);
    const navigate = useNavigate();
    const [crossClicked, setCrossClicked] = useState(false);
    const [tickClicked, setTickClicked] = useState(false);
    const state = useLocation().state;
    console.log("location state: ", state);


    const [exercise, setExercise] = useState(exerciseObject);
    // console.log("exercise exerciseformlayout:", exercise);

    // // Load exercise
    // useEffect(() => {
    //     (async () => {
    //         try {
    //             if (exerciseId != null) {
    //                 if (isWorkout) {
    //                     const exercises = await getJson(`/api/workouts/${sessionId}/exercises`);
    //                     const exercise = exercises.find((ex) => ex.sessionExerciseId == exercise.exerciseId);
    //                     console.log("exercise sub: ", exercise);
    //                     setExercise(exercise);
    //                 }
    //                 else {
    //                     const routine = await getJson(`/api/routines/${sessionId}`);
    //                     console.log(" routine : ",  routine );
    //                     const exercise = routine.exercises.find((ex) => ex.routineExerciseId == exercise.exerciseId);
    //                     console.log("exercise sub: ", exercise);
    //                     setExercise(exercise);
    //                 }
    //             }
    //
    //         } catch (e) {
    //             modal.showError(
    //                 "Couldn’t load your routine",
    //                 e?.message || "Please try again or re-login."
    //             );
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        console.log("exercise exerciseformlayout:", exercise);
    }, [exercise]);

    useEffect(() => {
        if (crossClicked) {
            // navigate(-1);
            console.log("exercise form layout state.from", state.from);
            setCrossClicked(!crossClicked);
            const lengthFromMoreThanOne = state.from.length > 1;
            const navTo = "/" + state.from.at(-1).toString();
            navigate(navTo, {
                state: {
                    id: sessionId,
                    from: (lengthFromMoreThanOne ? state.from.slice(0, -1) : []), // Take all except last
                    date: dateOfExercise
                }
            });
        }
    }, [crossClicked, navigate]);


    useEffect(() => {
        if (tickClicked) {
            console.log("tick clicked exercise form layout. state:", submitHandler);

            // Submit form
            if (submitHandler) {
                submitHandler();
            }
            else {
                console.log("!! Submit handler not defined yet.");
            }

            // navigate(-1);
            console.log("state exercise form layout: ", state);
            let navTo = "/app/workouts";
            const lengthFromMoreThanOne = state.from.length > 1;
            if (state.from.length > 1) {
                console.log("should be navigating to: ", "/" + state.from.at(-1).toString());
                navTo = "/" + state.from.at(-1).toString();
            }
            setTickClicked(false);
            navigate(navTo, {
                state: {
                    id: sessionId,
                    from: (lengthFromMoreThanOne ? state.from.slice(0, -1) : []), // Take all except last
                    date: dateOfExercise
                }
            });
        }
    }, [tickClicked, navigate]);
    // , submitHandler && submitHandler

    return (
    <DashboardLayout>
        <Header
            title="Edit Exercise"
            leftSlot={
                <h6 className="mb-4 text-primary">Edit {isCardio ? "Cardio" : "Strength"} Exercise</h6>
            }
            rightSlot={
                <div className="flex flex-row justify-between pt-4 pb-3 gap-1">
                    <PrimaryIconButton onClick={() => setTickClicked(true)}>
                    <Check className="w-6 h-6 text-primary" />
                    </PrimaryIconButton>
                    <SecondaryIconButton onClick={() => setCrossClicked(true)}>
                        <X className="w-6 h-6 text-primary" />
                    </SecondaryIconButton>
                </div>
            }
        />
        <section>
            <div className="flex flex-col items-start no-shadow-card">
                <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                    <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">
                        <div className="b1 text-primary">{exerciseName}</div>
                        <div className="p3 text-secondary">{description}</div>
                    </div>
                    <Icon icon="ph:plus-circle-light" height="3%"></Icon>
                </div>
                <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                    {children}
                </div>
            </div>
            <ListOfSets
                title={"Sets"}
                exercise={exercise}
                isWorkout={isWorkout}
                fromAdd={fromAdd}
                exerciseId={exercise.exerciseId}
                dateOfExercise={dateOfExercise}
                currentSessionId={sessionId}
            ></ListOfSets>
        </section>
    </DashboardLayout>
    );
}