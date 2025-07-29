"use client";
// Imports
import { getUserLocation } from "@/app/providers/LocationProvider";

// 
function AddBuisnessBtn() {
    const { setIsAddBuisness } = getUserLocation();

    return (
        <>
            <section className="min-w-full pt-4 flex item-center justify-center">
                <button onClick={() => setIsAddBuisness(true)} type="button" className="px-4 py-2 bg-background text-center rounded-xl border border-secondary cursor-pointer hover:bg-transparent transition-colors">
                    <p className="text-secondary font-semibold">Add your Buisness</p>
                </button>
            </section>
        </>
    )
}

export default AddBuisnessBtn;