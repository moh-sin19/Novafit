// I acknowledge the use of Microsoft Copilot AI in this document.
// The following prompt was given:
//     Hello, can you please help me construct a form in React and Tailwind that
//     has all options listed (not dropdown), and the user can click on one to
//     then add it to their data, and then the form is submitted automatically?
// The response was:
// Absolutely! Here's a simple React + Tailwind form that displays a list of options (like buttons), lets the user click one, adds it to their data, and automatically submits the form.
//
// ---
//
// ### 🧩 React + Tailwind Form: Click-to-Select and Auto-Submit
//
// ```jsx
// import React, { useState } from 'react';
//
// const options = ['Option A', 'Option B', 'Option C', 'Option D'];
//
// export default function AutoSubmitForm() {
//   const [selected, setSelected] = useState(null);
//
//   const handleSelect = (option) => {
//     setSelected(option);
//
//     // Simulate form submission
//     const formData = { selectedOption: option };
//     console.log('Form submitted with:', formData);
//
//     // You can replace this with an actual API call
//     // fetch('/api/submit', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(formData),
//     // });
//   };
//
//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Choose an Option</h2>
//       <div className="grid grid-cols-2 gap-4">
//         {options.map((option) => (
//           <button
//             key={option}
//             onClick={() => handleSelect(option)}
//             className={`py-2 px-4 rounded border ${
//               selected === option
//                 ? 'bg-blue-500 text-white border-blue-500'
//                 : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//       {selected && (
//         <p className="mt-4 text-green-600 font-medium">
//           You selected: {selected}. Form submitted!
//         </p>
//       )}
//     </div>
//   );
// }
// ```
//
// ---
//
// ### 🛠 How It Works
// - All options are visible as buttons.
// - Clicking a button sets the selected value and triggers a simulated form submission.
// - You can replace the `console.log` with an actual API call or form handler.
//
// Would you like to add animations, validation, or make it reusable as a component?



// I acknowledge the use of Microsoft Copilot AI in this project.
// The following prompt was given:
    // Hello, I'm getting a 500 Error on my Springboot application. Can you help me debug?
    // This is the Response (the error could be coming from here). " public static ExerciseResponse
    // from(Exercise exercise) { ExerciseResponse response = new ExerciseResponse();
    // response.setExerciseId(exercise.getExerciseId()); response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
    // // response.setCreatedByUsername(exercise.getCreatedBy().getUsername()); response.setName(exercise.getName());
    // response.setDescription(exercise.getDescription()); response.setLastUpdated(exercise.getLastUpdated());
    // TEXT NOT NULL, description TEXT, created_by INTEGER, -- null = global/shared last_updated TIMESTAMP NOT NULL
    // DEFAULT CURRENT_TIMESTAMP, UNIQUE (created_by, name), FOREIGN KEY (created_by) REFERENCES user(user_id) ON
    // DELETE SET NULL );" Please keep your response short (preferably no more than a paragraph).
// The following response was given:
    // The 500 error likely stems from `exercise.getCreatedBy().getUserId()` when `created_by` is
    // `NULL` in the database. Since the foreign key allows nulls, `getCreatedBy()` may return `null`,
    // causing a `NullPointerException`. Add a null check before accessing `getUserId()` or `getUsername`:
    //
    // ```java
    // if (exercise.getCreatedBy() != null) {
    //     response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
    // }
    // ```
    //
    // This should prevent the crash.

import React, { useState, useEffect } from 'react';
import RoutineCard from "../../../../components/workout/RoutineCard";
import {Icon} from "@iconify/react";
import ExerciseFormCard from "../../../../components/workout/ExerciseFormCard";
import DashboardLayout from "../../../../layout/DashboardLayout";
import {getJson} from "../../../../utils/api";
import useModal from "../../../../hooks/useModal";
import {useLocation, useNavigate} from "react-router-dom";
import AddExerciseForm from "./AddExerciseForm";


// const strengthOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
// const cardioOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

export default function AddingExerciseMenu({parentClick, sessionId, isWorkout}) {
    const [selected, setSelected] = useState(null);
    const [addingExercise, setAddingExercise] = useState(false);
    const [options, setOptions] = useState(null);
    // const [weightExerciseOptions, setWeightExerciseOptions] = useState(null);
    // const [cardioExerciseOptions, setCardioExerciseOptions] = useState(null);
    const modal = useModal();
    const navigate = useNavigate();

    const location = useLocation();
    const state  = location.state || {};

    console.log("state.workoutId: ", state.workoutId);

    // Load exercise options
    useEffect(() => {
        (async () => {
            try {
                const options = await getJson(`/api/exercises/all`);
                setOptions(options);
                console.log("options: ", options);

                // const cardioOptions = await getJson(`/api/exercises/type/CARDIO`);
                // setCardioExerciseOptions(cardioOptions);
                // console.log("cardioOptions: ", cardioOptions);

                // form.reset({
                //     name: routine?.name?? "",
                //     notes: routine?.notes ?? "",
                // });

            } catch (e) {
                modal.showError(
                    "Couldn’t load your info",
                    e?.message || "Please try again or re-login."
                );
            }
        })();
    }, []);

    const handleSelect = (option) => {
        setSelected(option);

        console.log("option: ", option);

        // Simulate form submission
        const formData = { selectedOption: option };
        console.log('Form submitted with:', formData);

        setAddingExercise(true);
        console.log("adding ex, ", addingExercise);

        // navigate("")


        // parentClick();
    };

    useEffect(() => {
        console.log("selected: ", selected);
    }, [selected]);

    return (
            <div>{!addingExercise &&

                <DashboardLayout>
                <div className="flex flex-col gap-7">
                    <div>
                        <h6 className="text-primary">Exercises</h6>
                        <div className="flex flex-col items-start no-shadow-card">
                            <div className="flex flex-row justify-between items-center px-6 w-[100%]">
                                <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">
                                    <div className="p3 text-secondary">NAME</div>
                                </div>
                                {/*<Icon icon="ph:plus-circle-light" height="3%" onClick={parentClick}></Icon>*/}
                            </div>
                            {options!= null &&
                            <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">
                                {options.map((option) => (
                                    <div key={option.exerciseId} className="flex flex-row justify-between align-center mx-6 py-2.5 border-t border-subtle">
                                        <div className="flex flex-col items-start justify-center gap-1 ">
                                            <div className="p2 text-primary">{option.name}</div>
                                            <div className="p3 text-secondary">{option.description}</div>
                                        </div>
                                        <button
                                            key={option.exerciseId}
                                            onClick={() => handleSelect(option)}
                                            className={`py-2 px-4 rounded border ${
                                                selected === option.exerciseId
                                                    ? "bg-purple-200"
                                                    : "bg-transparent text-purple-400 border-transparent"
                                            }`}
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                            }
                            {selected && (
                                <p className="mt-4 text-green-600 font-medium">
                                    You selected: {selected}. Form submitted!
                                </p>
                            )}
                        </div>
                    </div>
                    {/*<div>*/}
                    {/*    <h6 className="text-primary">Cardio</h6>*/}
                    {/*    <div className="flex flex-col items-start no-shadow-card">*/}
                    {/*        <div className="flex flex-row justify-between items-center px-6 w-[100%]">*/}
                    {/*            <div className="flex flex-col justify-center pt-4 pb-3 gap-1 w-[100%]">*/}
                    {/*                <div className="p3 text-secondary">NAME</div>*/}
                    {/*            </div>*/}
                    {/*            /!*<Icon icon="ph:plus-circle-light" height="3%" onClick={parentClick}></Icon>*!/*/}
                    {/*        </div>*/}
                    {/*        {cardioExerciseOptions!= null &&*/}
                    {/*        <div className="flex flex-col py-1.5 w-[100%] border-t border-subtle rounded-b-2xl bg-gray">*/}
                    {/*            {cardioExerciseOptions.map((option) => (*/}
                    {/*                <div className="flex flex-row justify-between mx-6 py-1.5 border-subtle">*/}
                    {/*                    <div className="p3 text-secondary">{option.name}</div>*/}
                    {/*                    <button*/}
                    {/*                        key={option.exerciseId}*/}
                    {/*                        onClick={() => handleSelect(option.exerciseId)}*/}
                    {/*                        className={`py-2 px-4 rounded border ${*/}
                    {/*                            selected === option.name*/}
                    {/*                                ? "bg-blue-500 text-primary"*/}
                    {/*                                : "bg-transparent text-purple-400 border-transparent"*/}
                    {/*                        }`}*/}
                    {/*                    >*/}
                    {/*                        {option.name}*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*        }*/}
                    {/*        /!*{selected && (*!/*/}
                    {/*        /!*    <p className="mt-4 text-green-600 font-medium">*!/*/}
                    {/*        /!*        You selected: {selected}. Form submitted!*!/*/}
                    {/*        /!*    </p>*!/*/}
                    {/*        /!*)}*!/*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                </DashboardLayout>
            }
            {(selected != null) && addingExercise &&
                // isCardio, workoutId, selectedId, exerciseName, description, dateOfExercise, parentClick, isWorkout
                <AddExerciseForm workoutId={state.workoutId}
                                 // isCardio={selected.type.toString() == "CARDIO"}
                                 // exerciseId={exerciseId}selected
                                 selected={selected}
                                 exerciseName={selected.name} description={selected.description}
                                 // dateOfExercise={dateOfExercise}
                                 parentClick={parentClick}
                                 isWorkout={state.isWorkout}/>
                // "exerciseId": 1,
                //   "type": "WEIGHT",
                //   "sortOrder": 1,
                //   "notes": "Focus on form"
                // }

                // <div>
                //     HI
                //     <ExerciseFormCard isCardio={true} exerciseName={"Ex1"} description={"Blah"} parentClick={() => console.log("func")}/>
                // </div>
            }

            </div>
    );
}




//
// import { useEffect } from "react";
//
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
//
// import EmailInput from "../../../components/inputs/EmailInput";
// import SelectInput from "../../../components/inputs/SelectInput";
// import SecondaryButton from "../../../components/buttons/SecondaryButton";
//
// import Modal from "../../../components/ui/Modal";
// import useModal from "../../../hooks/useModal";
// import { getJson, putJson } from "../../../utils/api";
//
// // ---- validation (required) ----
// const schema = z.object({
//     email: z
//         .string()
//         .trim()
//         .min(1, "Email is required")
//         .email("Enter a valid email"),
//     firstName: z.string().trim().min(1, "First name is required"),
//     lastName: z.string().trim().min(1, "Last name is required"),
// });
//
// export default function AddingExerciseMenu() {
//     const modal = useModal();
//
//     const form = useForm({
//         resolver: zodResolver(schema),
//         defaultValues: { email: "", firstName: "", lastName: "" },
//         mode: "onBlur",
//     });
//
//     // Load current user + profile
//     useEffect(() => {
//         (async () => {
//             try {
//                 const me = await getJson("/api/users/me");
//                 // Expecting shape from UserResponse: { email, username, profile: { firstName, lastName, ... } }
//                 form.reset({
//                     email: me?.email ?? "",
//                     firstName: me?.firstName ?? "",
//                     lastName: me?.lastName ?? "",
//                 });
//             } catch (e) {
//                 modal.showError(
//                     "Couldn’t load your info",
//                     e?.message || "Please try again or re-login."
//                 );
//             }
//         })();
//     }, []);
//
//     const onSubmit = form.handleSubmit(async (values) => {
//         try {
//             // Update first/last name (profile table)
//             await putJson("/api/users/me/profile", {
//                 firstName: values.firstName,
//                 lastName: values.lastName,
//             });
//
//             modal.showSuccess(
//                 "Changes Saved",
//                 "Your user information has been updated."
//             );
//         } catch (e) {
//             modal.showError(
//                 "Save Failed",
//                 e?.message || "We couldn’t save your details."
//             );
//         }
//     });
//
//     return (
//         <section>
//             <h6 className="mb-4 text-primary">Add Exercise</h6>
//
//             <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
//                 <SelectInput
//                     label="Strength"
//                     options={[["Bench Press", 0], ["Squat", 1], ["Deadlift", 2], ["Pull Up", 3]]}
//                     disabled
//                     {...form.register("strength")}
//                     error={form.formState.errors.email?.message}
//                 />
//                 <SelectInput
//                     label="Cardio"
//                     options={[["Bench Press", 0], ["Squat", 1], ["Deadlift", 2], ["Pull Up", 3]]}
//                     disabled
//                     {...form.register("cardio")}
//                     error={form.formState.errors.email?.message}
//                 />
//
//                 <div className="pt-2">
//                     <SecondaryButton type="submit">ADD EXERCISE</SecondaryButton>
//                 </div>
//             </form>
//
//             <Modal
//                 open={modal.open}
//                 type={modal.type}
//                 title={modal.title}
//                 description={modal.description}
//                 confirmText={modal.confirmText}
//                 onClose={modal.close}
//                 onConfirm={modal.close}
//             />
//         </section>
//     );
// }
