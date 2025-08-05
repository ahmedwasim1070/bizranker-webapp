'use client';

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FailedApiResponse, LocationDataContext, SuccessApiResponse } from "@/types";
import { usePathname } from "next/navigation";
// Components
import LocationSelector from "@/components/LocationSelector";
import AddBusiness from "@/components/AddBusiness";

// Interfaces
interface GlobalContextType {
    userLocation: LocationDataContext | null;
    setUserLocation: (location: LocationDataContext | null) => void;
    setIsAddBusiness: (isAddBusiness: boolean) => void;
    selectedCategoryId: number;
    setSelectedCategoryId: (selectedCategoryId: number) => void;
}
interface GlobalProviderProps {
    children: ReactNode;
    locationData: LocationDataContext | null;
}

// Global context
const GlobalConext = createContext<GlobalContextType | undefined>(undefined);

// 
export function GlobalProvider({ children, locationData }: GlobalProviderProps) {
    // Path
    const pathname = usePathname();
    // States
    const [userLocation, setUserLocation] = useState<LocationDataContext | null>(locationData || null);
    const [isLocationPrompt, setIsLocationPrompt] = useState<boolean>(false);
    const [isAddBusiness, setIsAddBusiness] = useState<boolean>(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

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
                    console.error("Failed to fetchLiveLocation continuing with capital :", err);
                    setUserLocation({ ...userLocation, defaultCity: userLocation.capital })
                }
            },
            (err) => {
                console.error("Location permission denied or timedout continuing with capital :", err.message);
                setUserLocation({ ...userLocation, defaultCity: userLocation.capital })
            },
            {
                timeout: 30000,
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
    // Generates fetch profile url
    const generateFetchProfilesApi = () => {
        let type;
        console.log(pathname);
        switch (pathname) {
            case "/":
                type = "cityProfiles";
                break;
            case "/top/country/profiles":
                type = "countryProfiles";
                break;
            case "/top/world/profiles":
                type = "worldProfiles";
                break;
            default:
                type = "cityProfiles";
        }
        return `/api/fetchProfiles/?requestType=${type}&categoryId=${selectedCategoryId}&country=${userLocation?.country}&city=${userLocation?.defaultCity}`;
    }
    // Fetches Profiles
    const fetchProfiles = async () => {
        if (!userLocation?.defaultCity)
            return;

        const apiUrl = generateFetchProfilesApi();
        console.log(apiUrl);

        try {
            const res = await fetch(apiUrl);
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                throw new Error(`Error , ${errData}`);
            }

            const data = await res.json();
            const buisnessProfiles = data.data;
            console.log(buisnessProfiles);
        } catch (err) {
            console.error("Failed to fetchProfiels:", err);
        }
    }

    // Effects
    //  Fetch Live Location
    useEffect(() => {
        fetchLiveLocation();
    }, []);
    // On User Location change
    useEffect(() => {
        if (userLocation) {
            updateCookie();
            fetchProfiles();
        } else {
            setIsLocationPrompt(true);
        }
    }, [userLocation]);
    // On category change
    useEffect(() => {
        fetchProfiles();
    }, [selectedCategoryId])

    return (
        <GlobalConext.Provider value={{ userLocation, setUserLocation, setIsAddBusiness, selectedCategoryId, setSelectedCategoryId }}>
            {/*  */}
            {isLocationPrompt && <LocationSelector />}

            {/*  */}
            {isAddBusiness && <AddBusiness />}

            {children}
        </GlobalConext.Provider>
    );
}

// Hook to use context
export const getGlobalProvider = (): GlobalContextType => {
    const context = useContext(GlobalConext);
    if (context === undefined) {
        throw new Error('getGlobalProvider must be used within a GlobalProvider');
    }
    return context;
}