'use client';

// Imports
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAreaProvider } from "@/app/providers/AreaProvider";
import { useEffect, useState } from "react";
import { LocationDataContext } from "@/middleware";

// Type
type CityListerProps = {
    userLocation: LocationDataContext | null;
    setUserLocation: (userLocation: LocationDataContext | null) => void;
}

// 
function CityLister({ setUserLocation }: CityListerProps) {
    const { locationPayload, setLocationPayload } = getAreaProvider();
    const [cities, setCities] = useState<string[] | null>(null);
    const [listCity, setListCity] = useState<boolean>(false);
    const [isFetchingCity, setIsFetchingCity] = useState<boolean>(false);
    const [cityListingError, setCityListingError] = useState<string | null>(null);

    const fetchCities = async () => {
        setIsFetchingCity(true);
        setCityListingError(null);
        try {
            const response = await fetch(`/api/geonames/?countryCode=${locationPayload?.countryCode}`)
            if (!response.ok) {
                setCityListingError("Error while fetching cities");
                throw new Error(`Failed to fetch cities ${response.status}`);
            }

            const data = await response.json();
            setCities(data);
        } catch (error) {
            setCityListingError("Error while fetching cities");
            console.error("Error while fetching cities", error);
        } finally {
            setIsFetchingCity(false);
        }
    }
    const handleCitySelect = (city: string) => {
        if (locationPayload?.country && locationPayload.countryCode) {
            setLocationPayload({ ...locationPayload, defaultCity: city });
            setUserLocation({ ...locationPayload, defaultCity: city });
        }
    }

    useEffect(() => {
        if (locationPayload?.countryCode) {
            fetchCities();
        }
    }, [locationPayload])

    return (
        <>
            {/*  */}
            <div
                className="relative flex flex-row items-center gap-x-2 cursor-pointer group my-2 bg-secondary rounded-lg p-2 hover:bg-background border border-white hover:border-secondary"
                onClick={() => setListCity(!listCity)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setListCity(!listCity);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={listCity}
                aria-haspopup="listbox"
                aria-label={`Current location: ${locationPayload?.defaultCity}`}
            >
                <span className="text-white group-hover:text-secondary">{locationPayload?.defaultCity || "Select City"}</span>
                {!listCity ? (
                    <ChevronDown className="w-5 h-5 text-white group-hover:text-secondary transition-colors" />
                ) : (
                    <ChevronUp className="w-5 h-5 text-white group-hover:text-secondary transition-colors" />
                )}
                {listCity &&
                    <div className="absolute min-w-full min-h-[20vh] flex flex-col items-center inset-0 border-x border-b rounded-b-lg top-10 border-secondary bg-background overflow-y-scroll" role="listbox" aria-label="Select Country">
                        {/*  */}
                        {!locationPayload?.country &&
                            <span className="text-red-500 text-center m-2 font-bold">Select country first !</span>
                        }
                        {/* Loader */}
                        {isFetchingCity &&
                            <div className="flex items-center justify-center h-10 space-x-1">
                                <span
                                    className={`block w-3 h-3 rounded-full animate-bounce bg-primary`}
                                    style={{ animationDelay: '0s' }}
                                />
                                <span
                                    className={`block w-3 h-3 rounded-full animate-bounce bg-secondary`}
                                    style={{ animationDelay: '0.2s' }}
                                />
                                <span
                                    className={`block w-3 h-3 rounded-full animate-bounce bg-primary`}
                                    style={{ animationDelay: '0.4s' }}
                                />
                            </div>
                        }
                        {/* Error */}
                        {cityListingError &&
                            <div className="p-4 text-red-500 text-sm" role="alert">
                                {cityListingError}
                            </div>
                        }
                        {/* Cities */}
                        {cities && cities.map((city, idx) => (
                            <button onClick={() => handleCitySelect(city)} className={`w-full py-2 cursor-pointer text-secondary hover:bg-secondary hover:text-white ${locationPayload?.defaultCity === city && 'bg-secondary text-white'} `} key={idx} role="option" aria-selected={city === locationPayload?.defaultCity} tabIndex={listCity ? 0 : -1}>
                                {city}
                            </button>
                        ))}
                    </div>
                }
            </div>
        </>
    )
}

export default CityLister;