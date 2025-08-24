'use client';

// Imports
import React, { createContext, ReactNode, useContext, useState } from "react"
// Components
import Loader from "@/components/Loader";
import { LocationProvider } from "./LocationProvider";

// Interfaces
interface GloabalProvider {
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
    // States
    // Loader state to triger main loader
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <GlobalContext.Provider value={{
            isLoading,
            setIsLoading,
        }}>
            {/* Global Loader */}
            {isLoading &&
                <Loader fullscreen={true} />
            }

            {/* Country Location Prompt */}
            <LocationProvider />

            {/* Children Components */}
            {children}
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
