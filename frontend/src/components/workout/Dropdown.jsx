// This code uses Microsoft Copilot AI assistance, and acknowledges its use.
// The following prompt was given:
//      "How can I create a dropdown menu in React, Tailwind - so that the clicking part (that toggles the dropdown)
//      is in a flexbox, but the rest of the dropdown can extend out of that flexbox, without affecting other elements?"
// The response gave some written advice and sample code for how to structure the dropdown while using "flex" &
// "absolute" among other things.

import {Icon, loadIcons} from "@iconify/react";
import {useState} from "react";




export default function Dropdown() {
    const [dropdownClicked, setDropdownClicked] = useState(false);
    loadIcons(["lucide:chevron-down"]);

    return (
        <div className="flex flex-col relative">
            <div className="flex flex-row justify-center items-center gap-2 p3 text-primary no-shadow-less-round-card py-1 px-4 w-[100%]"
            onClick={() => setDropdownClicked(!dropdownClicked)}>
                Weekly
                <div className="w-[20px] h-[20px] flex justify-center items-center">
                    <Icon icon="lucide:chevron-down" height="100%" className="text-secondary" ></Icon>
                </div>
            </div>
            {dropdownClicked && (
                <div className="absolute top-full right-0 mt-2 z-10 w-[100%]">
                    <div className="flex flex-col justify-center items-end gap-2 p3 text-primary no-shadow-less-round-card p-2">
                        <div>Daily</div>
                        <div>3 Days</div>
                        <div>Weekly</div>
                        <div>Fortnightly</div>
                        <div>Monthly</div>
                    </div>
                </div>
            )}
        </div>
    );
}