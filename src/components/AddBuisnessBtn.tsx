"use client";
// Imports
import { getUserLocation } from "@/app/providers/LocationProvider";
import { BriefcaseBusiness } from "lucide-react";

// 
function AddBuisnessBtn() {
    const { setIsAddBuisness } = getUserLocation();

    return (
        <>
            <section className="min-w-full pt-4 flex item-center justify-center">
                <button onClick={() => setIsAddBuisness(true)} type="button" className="flex flex-row items-center group gap-x-2 p-2 bg-background text-center rounded-full border border-secondary cursor-pointer hover:bg-transparent transition-colors">
                    <span className="border border-secondary bg-primary p-2 rounded-full group-hover:bg-secondary">
                        <BriefcaseBusiness className="w-4.5 h-4.5 text-secondary group-hover:text-primary" />
                    </span>
                    <p className="text-secondary font-semibold">Add your Buisness</p>
                </button>
            </section>
        </>
    )
}

export default AddBuisnessBtn;