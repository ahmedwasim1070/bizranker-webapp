"use client";

import { getGlobalProvider } from "@/providers/GlobalProvider";
// Imports
import { PlusSquare } from "lucide-react";
import { useSession } from "next-auth/react";

// 
function AddtagBtn() {
    // Provider
    // Session
    const { data: session, status } = useSession();
    // Global
    const { setIsCreateTagPop, setIsSigninPopup } = getGlobalProvider();

    return (
        <>
            <button disabled={status !== 'authenticated'} onClick={() => { { status === "authenticated" ? setIsCreateTagPop(true) : setIsSigninPopup(true) } }} type="button" className={`flex flex-row items-center group sm:gap-x-3 xxs:gap-x-2 sm:px-4 xxs:px-2 py-2 mx-2 text-center rounded-lg ${status !== 'authenticated' ? 'bg-primary/40' : 'border border-primary bg-primary cursor-pointer hover:bg-transparent transition-colors group'}`}>
                <PlusSquare className={`w-6 h-6 text-white ${status === 'authenticated' && ' group-hover:text-secondary'}`} />
                <p className={`text-white sm:text-lg xxs:text-sm font-semibold  ${status === 'authenticated' && 'group-hover:text-secondary'}`}>Add Custom Category</p>
            </button>
        </>
    )
}

export default AddtagBtn;
