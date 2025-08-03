'use client';

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FailedApiResponse, LocationDataContext, SuccessApiResponse } from "@/types";
// Components
import LocationSelector from "@/components/LocationSelector";
import AddBusiness from "@/components/AddBuisness";

// Interfaces
interface LocationContextType {
    userLocation: LocationDataContext | null;
    setUserLocation: (location: LocationDataContext | null) => void;
    selectedCity: string | null;
    setSelectedCity: (city: string | null) => void;
    setIsAddBuisness: (isAddBuisness: boolean) => void;
}
interface LocationProviderProps {
    children: ReactNode;
    locationData: LocationDataContext | null;
}

// Global context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// 
export function LocationProvider({ children, locationData }: LocationProviderProps) {
    // 
    const [userLocation, setUserLocation] = useState<LocationDataContext | null>(locationData || null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [isLocationPrompt, setIsLocationPrompt] = useState<boolean>(false);
    const [isAddBuisness, setIsAddBuisness] = useState<boolean>(false);

    // 
    const fetchLiveLocation = () => {
        if (!userLocation) return;
        if (userLocation.defaultCity) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(`/api/opencage/?lat=${latitude}&lng=${longitude}`);
                    if (!res.ok) {
                        const errData = (await res.json()) as FailedApiResponse;
                        throw new Error(`Error , ${errData}`);
                    };
                    const data = (await res.json()) as SuccessApiResponse;
                    const latNlngInfo = data.data;

                    setUserLocation({ ...userLocation, defaultCity: latNlngInfo.city || latNlngInfo.town || latNlngInfo.village });
                } catch (err) {
                    console.error("Live location fetch error:", err);
                }
            },
            (err) => {
                console.error("location permission error:", err.message);
            },
            {
                timeout: 50000,
                maximumAge: 0,
            }
        );
    };

    // 
    useEffect(() => {
        fetchLiveLocation();
    }, []);
    useEffect(() => {
        if (userLocation) {
            setIsLocationPrompt(false);
            const expires = new Date();
            expires.setDate(expires.getDate() + 1);

            document.cookie = `user_location=${JSON.stringify(userLocation)}; expires=${expires.toUTCString()}; path=/`;
            setIsLocationPrompt(false);
        } else {
            setIsLocationPrompt(true);
        }
    }, [userLocation]);

    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation, selectedCity, setSelectedCity, setIsAddBuisness }}>
            {/*  */}
            {isLocationPrompt && <LocationSelector />}

            {/*  */}
            {isAddBuisness && <AddBusiness />}

            {children}
        </LocationContext.Provider>
    );
}

// Hook to use context
export const getUserLocation = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('getUserLocation must be used within a LocationProvider');
    }
    return context;
}

export type { LocationContextType };
