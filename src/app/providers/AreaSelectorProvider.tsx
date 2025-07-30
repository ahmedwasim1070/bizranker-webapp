"use client";

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// Context
import { getUserLocation } from "./LocationProvider";

// Interfaces
interface AreaSelectorContextTypes {
    setSelectedCountryData: (selectedCountryData: selectedCountryDataPayload | null) => void;
    selectedCountryCode: string | undefined;
    selectedCountryCapital: string | undefined;
    selectedCity: string | null;
    setSelectedCity: (selectedCity: string | null) => void;
}
interface AreaSelectorProviderProps {
    children: ReactNode;
}
// Types
export type selectedCountryDataPayload = {
    country: string,
    countryCode: string,
    capital: string,
}

// Global context
const AreaSelectorContext = createContext<AreaSelectorContextTypes | undefined>(undefined);

// Provider
function AreaSelectorProvider({ children }: AreaSelectorProviderProps) {
    // Context states
    const { userLocation, setUserLocation } = getUserLocation();
    // States
    const [selectedCountryData, setSelectedCountryData] = useState<selectedCountryDataPayload | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Effect 
    useEffect(() => {
        if (!selectedCountryData) return;

        const { country, countryCode, capital } = selectedCountryData;
        if (
            userLocation?.country !== country ||
            userLocation?.countryCode !== countryCode ||
            userLocation?.capital !== capital
        ) {
            setUserLocation({ ...selectedCountryData });
        }
    }, [selectedCountryData]);
    useEffect(() => {
        if (!userLocation || !selectedCity) return;

        if (selectedCity === userLocation?.defaultCity) return;

        setUserLocation({ ...userLocation, defaultCity: selectedCity })
    }, [selectedCity])
    useEffect(() => {
        if (!userLocation) return;

        const { defaultCity, ...countryData } = userLocation;

        if (
            selectedCountryData?.country !== countryData.country ||
            selectedCountryData?.countryCode !== countryData.countryCode ||
            selectedCountryData?.capital !== countryData.capital
        ) {
            setSelectedCountryData(countryData);
        }

        if (defaultCity) {
            setSelectedCity(defaultCity);
        }
    }, [userLocation]);

    return (
        <AreaSelectorContext.Provider value={{ setSelectedCountryData, selectedCountryCapital: selectedCountryData?.capital, selectedCountryCode: selectedCountryData?.countryCode, selectedCity, setSelectedCity }}>
            {children}
        </AreaSelectorContext.Provider>
    );
}

// Hook to use the context
export const useAreaSelectorContext = () => {
    const context = useContext(AreaSelectorContext);
    if (context === undefined) {
        throw new Error("useAreaSelectorContext must be used within an AreaSelectorProvider");
    }
    return context;
};

export default AreaSelectorProvider;
