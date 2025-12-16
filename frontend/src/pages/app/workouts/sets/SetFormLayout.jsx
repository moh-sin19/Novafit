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
import useModal from "../../../../hooks/useModal";

export default function SetFormLayout({ isWorkout, setId, exerciseId, sessionId, dateOfExercise, submitHandler, children }) {
    loadIcons(["ph:plus-circle-light"]);

    const modal = useModal();
    const navigate = useNavigate();
    const [crossClicked, setCrossClicked] = useState(false);
    // const [tickClicked, setTickClicked] = useState(false);
    const state = useLocation().state;
    console.log("location state: ", state);

    const [exercise, setExercise] = useState(null);


    const [set, setSet] = useState(null);

    // Load exercise
    useEffect(() => {
        (async () => {
            try {
                if (setId != null) {
                    if (isWorkout) {
                        const exercises = await getJson(`/api/workouts/${sessionId}/exercises`);
                        const exercise = exercises.find((exercise) => exercise.sessionExerciseId == exerciseId);
                        console.log("exercise: ", exercise);
                        setExercise(exercise);
                        const set = exercise.sets.find((set) => set.sessionSetId == setId);
                        console.log("set", set);
                        setSet(set);
                    }
                    else {
                        const routine = await getJson(`/api/routines/${sessionId}`);
                        console.log(" routine : ",  routine );
                        const exercise = routine.exercises.find((exercise) => exercise.routineExerciseId == exerciseId);
                        console.log("exercise: ", exercise);
                        setExercise(exercise);
                        const set = exercise.sets.find((set) => set.routineSetId == setId);
                        console.log("set", set);
                        setSet(set);
                    }
                }

            } catch (e) {
                modal.showError(
                    "Couldn’t load your set",
                    e?.message || "Please try again or re-login."
                );
            }
        })();
    }, []);

    useEffect(() => {
        if (crossClicked) {
            // navigate(-1);
            console.log("exercise form layout state.from", state.from);
            setCrossClicked(!crossClicked);
            const navTo = "/" + state.from.at(-1).toString();
            navigate(navTo, {
                state: {
                    isCardio: (exercise.type == "WEIGHT") ? false : true,
                    workoutId: sessionId,
                    exerciseId: (isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId),
                    exerciseName: exercise.exerciseName,
                    description: exercise.description,
                    dateOfExercise: dateOfExercise,
                    parentClick: navigate("/"),
                    isWorkout: isWorkout,

                    from: state.from.slice(0, -1) // Take all except last
                }
            });
        }
    }, [crossClicked, navigate]);

    // const handleSubmit = async (e) => {
    //     try {
    //         if (e) {
    //             e.preventDefault();
    //         }
    //
    //         console.log("tick clicked, submithandler: ", submitHandler);
    //         // Submit form
    //         // submitHandler();
    //         console.log("submitHandler type:", typeof submitHandler);
    //
    //         const formElement = document.querySelector('form');
    //         if (formElement) {
    //             formElement.requestSubmit();
    //         }
    //         console.log("formElement:", formElement);
    //
    //         console.log("4. About to call submitHandler");
    //
    //
    //         const result = await submitHandler(e);
    //         console.log("submitHandler result:", result);
    //
    //
    //         console.log("5. submitHandler completed");
    //         // } catch (error) {
    //         //     console.error("6. Submit handler error:", error);
    //         // }
    //
    //         let navTo = "/app/workouts";
    //         if (state.from.length > 1) {
    //             console.log("should be navigating to: ", "/" + state.from.at(-1).toString());
    //             navTo = "/" + state.from.at(-1).toString();
    //         }
    //         // setTickClicked(false);
    //         await navigate(navTo, {
    //             state: {
    //                 isCardio: (exercise.type === "WEIGHT") ? false : true,
    //                 workoutId: sessionId,
    //                 exerciseId: (isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId),
    //                 exerciseName: exercise.exerciseName,
    //                 description: exercise.description,
    //                 dateOfExercise: dateOfExercise,
    //                 parentClick: navigate("/"),
    //                 isWorkout: isWorkout,
    //
    //                 from: state.from.slice(0, -1) // List ("stack") of previous location
    //             }
    //         });
    //     } catch (error) {
    //         modal.showError(
    //             "Save failed",
    //             error?.message || "Please try again."
    //         )
    //     }
    // }

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const form = document.getElementById("edit-set-form");

        if (!form) {
            console.error("Form not found!");
            return;
        }

        // This triggers the React Hook Form `onSubmit` pipeline
        form.requestSubmit();

        // Now wait a tick for it to finish before navigating
        setTimeout(() => {
            let navTo = "/app/workouts";
            if (state?.from?.length > 1) {
                navTo = "/" + state.from.at(-1).toString();
            }

            navigate(navTo, {
                state: {
                    isCardio: exercise?.type !== "WEIGHT",
                    workoutId: sessionId,
                    exerciseId: isWorkout
                        ? exercise?.sessionExerciseId
                        : exercise?.routineExerciseId,
                    exerciseName: exercise?.exerciseName,
                    description: exercise?.description,
                    dateOfExercise,
                    parentClick: navigate("/"),
                    isWorkout,
                    from: state.from.slice(0, -1)
                },
            });
        }, 300);
    };


    // useEffect(() => {
    //     if (tickClicked) {
    //         console.log("tick clicked, submithandler: ", submitHandler);
    //
    //         console.log("4. About to call submitHandler");
    //
    //         // Submit form
    //         // submitHandler();
    //
    //         try {
    //             submitHandler();
    //             console.log("5. submitHandler completed");
    //         } catch (error) {
    //             console.error("6. Submit handler error:", error);
    //         }
    //
    //
    //         // navigate(-1);
    //         console.log("state routine form layout: ", state);
    //         let navTo = "/app/workouts";
    //         if (state.from.length > 1) {
    //             console.log("should be navigating to: ", "/" + state.from.at(-1).toString());
    //             navTo = "/" + state.from.at(-1).toString();
    //         }
    //         setTickClicked(false);
    //         navigate(navTo, {
    //             state: {
    //                 isCardio: (exercise.type == "WEIGHT") ? false : true,
    //                 workoutId: sessionId,
    //                 exerciseId: (isWorkout ? exercise.sessionExerciseId : exercise.routineExerciseId),
    //                 exerciseName: exercise.exerciseName,
    //                 description: exercise.description,
    //                 dateOfExercise: dateOfExercise,
    //                 parentClick: navigate("/"),
    //                 isWorkout: isWorkout,
    //
    //                 from: state.from.slice(0, -1) // List ("stack") of previous location
    //             }
    //         });
    //     }
    // }, [tickClicked, navigate]);

    return (
    <DashboardLayout>
        <Header
            title="Edit Set"
            leftSlot={
                <h6 className="mb-4 text-primary">Edit Set</h6>
            }
            rightSlot={
                <div className="flex flex-row justify-between pt-4 pb-3 gap-1">
                    <PrimaryIconButton onClick={handleSubmit}>
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
                {/*<div className="flex flex-row justify-between items-center px-6 w-[100%]">*/}
                {/*    <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">*/}
                {/*        /!*<div className="b1 text-primary">{setName}</div>*!/*/}
                {/*        /!*<div className="p3 text-secondary">{description}</div>*!/*/}
                {/*    </div>*/}
                {/*    /!*<Icon icon="ph:plus-circle-light" height="3%"></Icon>*!/*/}
                {/*</div>*/}
                <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                    {children}
                </div>
            </div>
        </section>


        <Modal
            open={modal.open}
            type={modal.type}
            title={modal.title}
            description={modal.description}
            confirmText={modal.confirmText}
            onClose={modal.close}
            onConfirm={modal.close}
        />
    </DashboardLayout>
    );
}