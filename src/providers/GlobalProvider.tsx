'use client';

// Imports
import React, { createContext, ReactNode, useContext, useState } from "react"
import { usePathname } from "next/navigation";
// Provider
import { SessionProvider } from "next-auth/react";
// Components
import Loader from "@/components/Loader";

// Interfaces
interface GloabalProvider {
    pathname: string;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

    return (
        <GlobalContext.Provider value={{
            pathname,
            isLoading,
            setIsLoading,
        }}>
            {/* Global Loader */}
            {isLoading &&
                <Loader fullscreen={true} />
            }

            {/* Session Provider */}
            <SessionProvider>
                {/* Children Components */}
                {children}
            </SessionProvider>
        </GlobalContext.Provider>
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
