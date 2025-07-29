'use client';

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LocationDataContext } from "@/middleware";

// Interfaces
interface AreaContextType {
    locationPayload: LocationDataContext | null,
    setLocationPayload: (locationPayload: LocationDataContext | null) => void,
}
interface AreaProviderProps {
    children: ReactNode;
}

// Global context
const AreaContext = createContext<AreaContextType | undefined>(undefined);

// 
export function AreaProvider({ children }: AreaProviderProps) {
    const [locationPayload, setLocationPayload] = useState<LocationDataContext | null>(null);

    return (
        <AreaContext.Provider value={{ locationPayload, setLocationPayload }}>
            {children}
        </AreaContext.Provider>
    )
}

// 
export const getAreaProvider = () => {
    const context = useContext(AreaContext);
    if (context === undefined) {
        throw new Error('getAreaProvider must be used within a AreaProvider');
    }
    return context;
}