'use client';

// Imports
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { cookies } from "next/headers";
// Types
import { LocationCookieData } from "@/types";
import CountrySelector from "@/components/CountrySelector";

// Interfaces
interface LocationProvider {
    locationCookieData: LocationCookieData | null;
    setLocationCookieData: React.Dispatch<React.SetStateAction<LocationCookieData | null>>
}
interface LocationProviderProps {
    children?: ReactNode;
}

// Context 
const LocationContext = createContext<LocationProvider | undefined>(undefined);

// 
export const LocationProvider = ({ children }: LocationProviderProps) => {
    // States
    // Location cookie data in var
    const [locationCookieData, setLocationCookieData] = useState<LocationCookieData | null>(null);
    // Location prompt for country selection
    const [isCountrySelector, setIsCountrySelector] = useState<boolean>(false);

    // get cookie data function
    const getLocationCookie = (): LocationCookieData | null => {
        // 
        const cookieStore = cookies();
        const locationRawCookie = cookieStore.get("user_location")?.value;

        // 
        let locationCookie = null;
        try {
            locationCookie = locationRawCookie ? JSON.parse(locationRawCookie) as LocationCookieData : null;
        } catch (error) {
            console.error("Error while Parsing Cookie. ,", error);
            locationCookie = null;
            setIsCountrySelector(true);
        }

        return locationCookie;
    };
    // Updates cookie funciton 
    const updateCookie = () => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        document.cookie = `user_location=${JSON.stringify(locationCookieData)}; expires=${expires.toUTCString()}; path=/`;
    }

    // Effect 
    // Sets Location Cookie to locationCookieData var
    useEffect(() => {
        if (!locationCookieData) {
            const locationCookie = getLocationCookie();
            setLocationCookieData(locationCookie);
        }
    }, [])
    // Updates cookie if the locationData gets changed
    useEffect(() => {
        if (locationCookieData) {
            updateCookie();
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
            {children}

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
