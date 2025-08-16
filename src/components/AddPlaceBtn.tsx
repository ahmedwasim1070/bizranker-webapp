"use client";

// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { PlusSquare } from "lucide-react";
import { useSession } from "next-auth/react";

// 
function AddPlaceBtn() {
    // Session Context
    const { data: session, status } = useSession();
    // Global Context
    const { setIsAddPlace, setIsGoogleAuth, selectedCategory } = getGlobalProvider();

    return (
        <section hidden={selectedCategory === 'all'} className="min-w-screen flex flex-col items-center justify-center gap-y-2 bg-white py-2">
            <button disabled={status !== 'authenticated'} onClick={() => { { status === "authenticated" ? setIsAddPlace(true) : setIsGoogleAuth(true) } }} type="button" className={`flex flex-row items-center group sm:gap-x-3 xxs:gap-x-2 sm:px-4 xxs:px-2 py-2 text-center rounded-lg ${status !== 'authenticated' ? 'bg-secondary/40' : 'border border-secondary bg-secondary cursor-pointer hover:bg-transparent transition-colors group'}`}>
                <PlusSquare className={`w-6 h-6 text-white ${status === 'authenticated' && ' group-hover:text-primary'}`} />
                <p className={`text-white sm:text-lg xxs:text-sm font-semibold  ${status === 'authenticated' && 'group-hover:text-primary'}`}>Add a Place</p>
            </button>
            {status === 'authenticated' &&
                <p className="text-primary">In {selectedCategory}</p>
            }
        </section>
    )
}

export default AddPlaceBtn;