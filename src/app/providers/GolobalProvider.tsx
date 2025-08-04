'use client';

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FailedApiResponse, LocationDataContext, SuccessApiResponse } from "@/types";
import { usePathname } from "next/navigation";
// Components
import LocationSelector from "@/components/LocationSelector";
import AddBusiness from "@/components/AddBusiness";

// Interfaces
interface LocationContextType {
    userLocation: LocationDataContext | null;
    setUserLocation: (location: LocationDataContext | null) => void;
    setIsAddBusiness: (isAddBusiness: boolean) => void;
}
interface LocationProviderProps {
    children: ReactNode;
    locationData: LocationDataContext | null;
}

// Global context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// 
export function GlobalProvider({ children, locationData }: LocationProviderProps) {
    // 
    const pathname = usePathname();
    const [userLocation, setUserLocation] = useState<LocationDataContext | null>(locationData || null);
    const [isLocationPrompt, setIsLocationPrompt] = useState<boolean>(false);
    const [isAddBusiness, setIsAddBusiness] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Get and process cordinates
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
    // Updates location cookies
    const updateCookie = () => {
        setIsLocationPrompt(false);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        document.cookie = `user_location=${JSON.stringify(userLocation)}; expires=${expires.toUTCString()}; path=/`;
        setIsLocationPrompt(false);
    }
    // 
    // Fetches Profiles
    // const fetchProfiles = () => {
    //     try{
    //         // const res = await fetch(`/api/fetchProfiles/?requestType=${}&category=${}&`)

    //     }catch(err){

    //     }
    // }

    // 
    useEffect(() => {
        fetchLiveLocation();
    }, []);
    useEffect(() => {
        if (userLocation) {
            updateCookie();
        } else {
            setIsLocationPrompt(true);
        }
    }, [userLocation]);

    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation, setIsAddBusiness }}>
            {/*  */}
            {isLocationPrompt && <LocationSelector />}

            {/*  */}
            {isAddBusiness && <AddBusiness />}

            {children}
        </LocationContext.Provider>
    );
}

// Hook to use context
export const getGlobalProvider = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('getGlobalProvider must be used within a GlobalProvider');
    }
    return context;
}