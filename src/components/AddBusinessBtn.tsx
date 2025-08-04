"use client";
// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { BriefcaseBusiness } from "lucide-react";

// 
function AddBusinessBtn() {
    const { setIsAddBusiness } = getGlobalProvider();

    return (
        <>
            <section className="min-w-full pt-4 flex item-center justify-center">
                <button onClick={() => setIsAddBusiness(true)} type="button" className="flex flex-row items-center group gap-x-3 px-4 py-2 bg-primary text-center rounded-lg border border-primary cursor-pointer hover:bg-transparent transition-colors">
                    <BriefcaseBusiness className="w-6 h-6 text-secondary" />
                    <p className="text-white text-lg font-semibold group-hover:text-secondary">Add Your Business</p>
                </button>
            </section>
        </>
    )
}

export default AddBusinessBtn;