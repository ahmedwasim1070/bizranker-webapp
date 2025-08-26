'use client';

// Imports
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
// Component
import CountrySelector from "@/components/CountrySelector";
// Types
import { LocationCookieData } from "@/types";

// Interfaces
interface LocationProvider {
    locationCookieData: LocationCookieData | null;
    setLocationCookieData: React.Dispatch<React.SetStateAction<LocationCookieData | null>>
}
interface LocationProviderProps {
    children: ReactNode;
    initialLocation: LocationCookieData | null;
}

// Context 
const LocationContext = createContext<LocationProvider | undefined>(undefined);

// 
export const LocationProvider = ({ children, initialLocation }: LocationProviderProps) => {
    // States
    // Location cookie data in var
    const [locationCookieData, setLocationCookieData] = useState<LocationCookieData | null>(initialLocation);
    // Location prompt for country selection
    const [isCountrySelector, setIsCountrySelector] = useState<boolean>(false);

    const updateCookie = () => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        document.cookie = `user_location=${JSON.stringify(locationCookieData)}; expires=${expires.toUTCString()}; path=/`;
    }

    // Effect 
    // Updates cookie if the locationData gets changed
    useEffect(() => {
        if (locationCookieData) {
            setIsCountrySelector(false);
            updateCookie();
        } else {
            setIsCountrySelector(true);
        }
    }, [locationCookieData])

    return (
        <LocationContext.Provider value={{
            locationCookieData,
            setLocationCookieData
        }}>
            {/*  */}
            {isCountrySelector && <CountrySelector />}

            {/*  */}
            {locationCookieData && children}

        </LocationContext.Provider>
    )
}

// Hook to fetch provider data
export const getLocationProvider = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('getLocationProvider must be used within a LoactionProvider');
    }
    return context;
}
