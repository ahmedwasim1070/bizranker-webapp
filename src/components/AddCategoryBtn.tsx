"use client";
// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { PlusSquare } from "lucide-react";

// 
function AddCategoryBtn() {
    const { setIsAddBusiness } = getGlobalProvider();

    return (
        <>
            <section className="min-w-full pt-4 flex item-center justify-center">
                <button onClick={() => setIsAddBusiness(true)} type="button" className="flex flex-row items-center group sm:gap-x-3 xxs:gap-x-2 sm:px-4 xxs:px-2 py-2 bg-primary text-center rounded-lg border border-primary cursor-pointer hover:bg-transparent transition-colors">
                    <PlusSquare className="w-6 h-6 text-secondary" />
                    <p className="text-white sm:text-lg xxs:text-sm font-semibold group-hover:text-secondary">Add Custom Category</p>
                </button>
            </section>
        </>
    )
}

export default AddCategoryBtn;