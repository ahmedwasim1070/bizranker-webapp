'use client';

// Imports
import React, { createContext, ReactNode, useContext, useState } from "react"
import { usePathname } from "next/navigation";
// Provider
import { SessionProvider } from "next-auth/react";
// Components
import Loader from "@/components/Loader";
import SigninPopup from "@/components/SigninPopup";
import CreatetagPopup from "@/components/CreatetagPopup";

// Interfaces
interface GloabalProvider {
    pathname: string;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSigninPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCreateTagPop: React.Dispatch<React.SetStateAction<boolean>>;
}
interface GlobalProviderProps {
    children: ReactNode;
}

// Context
const GlobalContext = createContext<GloabalProvider | undefined>(undefined);

// 
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    // Paht
    const pathname = usePathname();
    // States
    // Loader state to triger main loader
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Popup screen state for signin
    const [isSigninPop, setIsSigninPopup] = useState(false);
    // Popup screen state for tag-creation
    const [isCreateTagPop, setIsCreateTagPop] = useState(false);

    return (
        <GlobalContext.Provider value={{
            pathname,
            isLoading,
            setIsLoading,
            setIsSigninPopup,
            setIsCreateTagPop,
        }}>
            {/* Global Loader */}
            {isLoading &&
                <Loader fullscreen={true} />
            }

            {/* Signin Screen Popup */}
            {isSigninPop &&
                <SigninPopup />
            }

            {/* Create-tag Screen Popup */}
            {isCreateTagPop &&
                <CreatetagPopup />
            }

            {/* Session Provider */}
            <SessionProvider>
                {/* Children Components */}
                {children}
            </SessionProvider>
        </GlobalContext.Provider >
    );
}

// Hook to fetch provider data
export const getGlobalProvider = (): GloabalProvider => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('getGlobalProvider must be used within a GlobalProvider');
    }
    return context;
}
