"use client";

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CityData } from "@/types";
// Context
import { getGlobalProvider } from "./GolobalProvider";

// Interfaces
interface AreaSelectorContextTypes {
    setSelectedCountryData: (selectedCountryData: selectedCountryDataPayload | null) => void;
    selectedCountryCode: string | undefined;
    selectedCountryCapital: string | undefined;
    selectedCity: CityData | null;
    setSelectedCity: (selectedCity: CityData | null) => void;
}
interface AreaSelectorProviderProps {
    children: ReactNode;
}
// Types
export type selectedCountryDataPayload = {
    country: string,
    countryCode: string,
    capital: string,
    lat: string,
    lng: string,
}

// Global context
const AreaSelectorContext = createContext<AreaSelectorContextTypes | undefined>(undefined);

// Provider
function AreaSelectorProvider({ children }: AreaSelectorProviderProps) {
    // Context states
    const { userLocation, setUserLocation } = getGlobalProvider();
    // States
    const [selectedCountryData, setSelectedCountryData] = useState<selectedCountryDataPayload | null>(null);
    const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

    // Effect 
    useEffect(() => {
        if (!selectedCountryData) return;

        const { country, countryCode, capital, lat, lng } = selectedCountryData;
        if (
            userLocation?.country !== country &&
            userLocation?.countryCode !== countryCode &&
            userLocation?.lat !== lat.toString() &&
            userLocation?.lat !== lng.toString() &&
            userLocation?.capital !== capital
        ) {
            setUserLocation({ ...selectedCountryData });
        }
    }, [selectedCountryData]);
    useEffect(() => {
        if (!userLocation || !selectedCity) return;

        if (selectedCity.name === userLocation?.defaultCity) return;

        setUserLocation({ ...userLocation, lat: selectedCity.lat, lng: selectedCity.lng, defaultCity: selectedCity.name })
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
            setSelectedCity({ name: defaultCity, lat: userLocation.lat, lng: userLocation.lng });
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
