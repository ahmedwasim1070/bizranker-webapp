'use client';

// Imports
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FailedApiResponse, LocationData, SuccessApiResponse } from "@/types";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
// Components
import LocationSelector from "@/components/LocationSelector";
import AddCategory from "@/components/AddCategory";
import GoogleAuth from "@/components/GoogleAuth";
import AddPlace from "@/components/AddPlace";

// Interfaces
interface GlobalContextType {
    userLocation: LocationData | null;
    setUserLocation: (location: LocationData | null) => void;
    setIsGoogleAuth: (isGoogleAuth: boolean) => void;
    setIsAddCategory: (isAddCategory: boolean) => void;
    setIsAddPlace: (isAddPlace: boolean) => void;
    selectedCategory: string;
    setSelectedCategory: (selectedCategory: string) => void;
    requestedCategories: any[];
    isRequestingCategories: boolean;
    requestedCategoriesError: boolean;
    requestedProfiles: any[] | null;
    isRequestingProfiles: boolean;
    requestedProfilesError: string | null;
    newlyAddedPlace: any | null;
    setNewlyAddedPlace: (newlyAddedPlace: any | null) => void;
}
interface GlobalProviderProps {
    children: ReactNode;
    locationData: LocationData | null;
}

// Global context
const GlobalConext = createContext<GlobalContextType | undefined>(undefined);

// 
export function GlobalProvider({ children, locationData }: GlobalProviderProps) {
    // Path
    const pathname = usePathname();
    // States
    const [userLocation, setUserLocation] = useState<LocationData | null>(locationData || null);
    const [isLocationPrompt, setIsLocationPrompt] = useState<boolean>(false);
    const [isAddCategory, setIsAddCategory] = useState<boolean>(false);
    const [isGoogleAuth, setIsGoogleAuth] = useState<boolean>(false);
    const [isAddPlace, setIsAddPlace] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [requestedCategories, setRequestedCategories] = useState<any[]>([]);
    const [isRequestingCategories, setIsRequestingCategories] = useState<boolean>(false);
    const [requestedCategoriesError, setRequestedCategoriesError] = useState<boolean>(false);
    const [requestedProfiles, setRequestedProfiles] = useState<any[] | null>(null);
    const [isRequestingProfiles, setIsRequistingProfiles] = useState<boolean>(false);
    const [requestedProfilesError, setRequestedProfilesError] = useState<string | null>(null);
    const [newlyAddedPlace, setNewlyAddedPlace] = useState<any | null>(null);

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
                        throw new Error(`Error , ${errData.error}`);
                    };
                    const data = (await res.json()) as SuccessApiResponse;
                    const latNlngInfo = data.data;

                    setUserLocation({ ...userLocation, lat: latitude.toString(), lng: longitude.toString(), defaultCity: latNlngInfo.city || latNlngInfo.town || latNlngInfo.village });
                } catch (err) {
                    console.error("Failed to fetchLiveLocation continuing with capital : ,", err);
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
    // Fetch Categories
    const fetchPlacesCategories = async () => {
        setIsRequestingCategories(true);
        setRequestedCategoriesError(false);
        try {
            const res = await fetch('/api/fetchCategories');
            if (!res.ok) {
                throw new Error("Failed to fetch business categories.");
            }

            const data = await res.json();
            const storedBusinessCategory = data.data;
            setRequestedCategories(storedBusinessCategory);
        } catch (error) {
            console.error('Error fetching business types:', error);
            setRequestedCategoriesError(true);
        } finally {
            setIsRequestingCategories(false);
        }
    }
    // Fetches Profiles
    const fetchProfiles = async () => {
        if (!userLocation?.defaultCity)
            return;

        setIsRequistingProfiles(true);
        const apiUrl = generateFetchProfilesApi();

        setRequestedProfiles(null);

        setRequestedProfilesError(null);

        try {
            const res = await fetch(apiUrl);
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                setRequestedProfilesError(errData.error || "Unknown server error");
                throw new Error(errData.error || "Unknown server error");
            }

            const data = await res.json();
            const buisnessProfiles = data.data;
            setRequestedProfiles(buisnessProfiles);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to Load Profiles.";
            setRequestedProfilesError(message);
            console.error("Failed to fetchProfiles : ", err);
        } finally {
            setIsRequistingProfiles(false);
        }
    }
    // Updates location cookies
    const updateCookie = () => {
        setIsLocationPrompt(false);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        document.cookie = `user_location=${JSON.stringify(userLocation)}; expires=${expires.toUTCString()}; path=/`;
    }
    // Generates fetch profile url
    const generateFetchProfilesApi = () => {
        let type;
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
        return `/api/fetchProfiles/?requestType=${type}&category=${selectedCategory}&country=${userLocation?.country}&city=${userLocation?.defaultCity}`;
    }

    // Effects
    //  Fetch Live Location
    useEffect(() => {
        if (userLocation && !userLocation.defaultCity) {
            fetchLiveLocation();
        }
    }, [userLocation?.defaultCity]);
    // On User Location change
    useEffect(() => {
        if (userLocation) {
            updateCookie();
            if (userLocation?.defaultCity) {
                fetchProfiles();
            }
        } else {
            setIsLocationPrompt(true);
        }
    }, [userLocation?.defaultCity, userLocation?.country]);
    // Fetch On Render
    useEffect(() => {
        if (requestedCategories.length === 0) {
            fetchPlacesCategories();
        }
    }, [])
    // On category change
    useEffect(() => {
        if (userLocation?.defaultCity) {
            setRequestedProfiles(null);
            fetchProfiles();
        }
    }, [selectedCategory])
    // Update when user add a place
    useEffect(() => {
        if (newlyAddedPlace && userLocation?.defaultCity) {
            fetchProfiles();
        }
    }, [newlyAddedPlace])

    return (
        <GlobalConext.Provider value={{
            userLocation,
            setUserLocation,
            setIsGoogleAuth,
            setIsAddCategory,
            setIsAddPlace,
            selectedCategory,
            setSelectedCategory,
            requestedCategories,
            isRequestingCategories,
            requestedCategoriesError,
            requestedProfiles,
            isRequestingProfiles,
            requestedProfilesError,
            newlyAddedPlace,
            setNewlyAddedPlace
        }}>
            {/*  */}
            {isLocationPrompt && <LocationSelector />}


            {/*  */}
            <SessionProvider>
                {/*  */}
                {isGoogleAuth && <GoogleAuth />}

                {/*  */}
                {isAddCategory && <AddCategory />}

                {/*  */}
                {isAddPlace && <AddPlace />}
            </SessionProvider>


            {children}
        </GlobalConext.Provider >
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