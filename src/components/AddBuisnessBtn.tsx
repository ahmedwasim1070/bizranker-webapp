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
                <button onClick={() => setIsAddBuisness(true)} type="button" className="flex flex-row items-center group gap-x-3 px-4 py-2 bg-primary text-center rounded-lg border border-primary cursor-pointer hover:bg-transparent transition-colors">
                    <BriefcaseBusiness className="w-6 h-6 text-secondary" />
                    <p className="text-white text-lg font-semibold group-hover:text-secondary">Add Your Buisness</p>
                </button>
            </section>
        </>
    )
}

export default AddBuisnessBtn;