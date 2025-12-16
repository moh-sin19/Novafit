import {Icon, loadIcons} from "@iconify/react";
import NumberWithUnitInput from "../../../../components/inputs/NumberUnitInput";
import TextInput from "../../../../components/inputs/TextInput";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";
import Modal from "../../../../components/ui/Modal";
import DashboardLayout from "../../../../layout/DashboardLayout";
import ListOfExercises from "../../../../components/workout/ListOfExercises";
import {useState, useEffect} from "react";
import useModal from "../../../../hooks/useModal";
import {getJson} from "../../../../utils/api";
import {useLocation, useNavigate} from "react-router-dom";
import PrimaryIconButton from "../../../../components/buttons/PrimaryIconButton";
import {Check, X} from "lucide-react";
import SecondaryIconButton from "../../../../components/buttons/SecondaryIconButton";
import Header from "../../../../components/dashboard/DashboardHeader";

export default function RoutineFormLayout({ routineId, heading, submitHandler, children }) {
    loadIcons(["ph:plus-circle-light"]);
    const [routine, setRoutine] = useState(null);

    const modal = useModal();

    const navigate = useNavigate();
    const [crossClicked, setCrossClicked] = useState(false);
    const [tickClicked, setTickClicked] = useState(false);
    const state = useLocation().state;



    // Load routine
    useEffect(() => {
        (async () => {
            try {
                if (routineId != null) {
                    const routine = await getJson(`/api/routines/${routineId}`);
                    console.log("routine routineformlayout: ", routine);
                    setRoutine(routine);
                }

            } catch (e) {
                modal.showError(
                    "Couldn’t load your routine",
                    e?.message || "Please try again or re-login."
                );
            }
        })();
    }, [routineId]);


    useEffect(() => {
        if (crossClicked) {
            // navigate(-1);
            console.log("state routine form layout: ", state);
            console.log("should be navigating to: ", "/" + state.from.at(-1).toString());
            const navTo = "/" + state.from.at(-1).toString();
            setCrossClicked(false);
            navigate(navTo, {
                state: {
                    date: new Date()
                }
            });
        }
    }, [crossClicked, navigate]);

    useEffect(() => {
        if (tickClicked) {

            // Submit form
            submitHandler();

            // navigate(-1);
            console.log("state routine form layout: ", state);
            let navTo = "/app/workouts";
            if (state.from.length > 1) {
                console.log("should be navigating to: ", "/" + state.from.at(-1).toString());
                navTo = "/" + state.from.at(-1).toString();
            }
            setTickClicked(false);
            navigate(navTo, {
                state: {
                    date: new Date()
                }
            });
        }
    }, [tickClicked, navigate]);

    return (
        <DashboardLayout>
            <Header
                title="Edit Routine"
                leftSlot={
                    <h6 className="mb-4 text-primary">Edit Routine</h6>
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
            <section className="flex flex-col gap-5">
                <div className="flex flex-col items-start no-shadow-card">
                    {/*<div className="flex flex-row justify-between pt-4 pb-3 gap-1 w-[100%]">*/}
                    {/*    <h6 className="mb-4 text-primary">Edit Routine</h6>*/}
                    {/*    Tick*/}
                    {/*    <div onClick={() => setCrossClicked(true)}>Cross</div>*/}
                    {/*</div>*/}
                    <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                        <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">
                            <div className="b1 text-primary">{heading}</div>
                        </div>
                        <Icon icon="ph:plus-circle-light" height="3%"></Icon>
                    </div>
                    <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                        {children}
                    </div>
                </div>
                {routine &&
                    <ListOfExercises
                        title={"Exercises"}
                        sessionOrRoutine={routine}
                        updateSessionOrRoutineHandler={(updatedRoutine) => setRoutine(updatedRoutine)}
                        isWorkout={false}
                        workoutId={routineId}
                    ></ListOfExercises>
                }
            </section>
        </DashboardLayout>
    );
}