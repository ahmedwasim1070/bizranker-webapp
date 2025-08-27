"use client";

// Imports
import { useEffect, useState } from "react";
// Types
import { ApiResponse, CitiesResponse } from "@/types";
// Porviders
import { getLocationProvider } from "@/providers/LocationProvider";

// 
function CitySelector() {
    // Providers
    // Location
    const { locationCookieData, setLocationCookieData } = getLocationProvider();
    // States
    // Selected City
    const [selectedCity, setSelectedCity] = useState<CitiesResponse | null>(null);
    // Cities
    const [cities, setCities] = useState<CitiesResponse[] | null>(null);
    // Loader
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Error message 
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // Fetch city from (/api/fetchCities)
    const fetchCities = async () => {
        // 
        setIsLoading(true);
        // 
        setErrMsg(null);
        try {
            const res = await fetch(`/api/fetchCities/?country-code=${locationCookieData?.countryCode}`);
            if (!res.ok) {
                const errData = (await res.json()) as ApiResponse<never>;
                throw new Error(errData.message);
            }

            const data = (await res.json()) as ApiResponse<CitiesResponse[]>;
            if (data.success) {
                setCities(data.data);
            }
        } catch (err) {
            // Message
            const msg =
                err instanceof Error ? err.message : "Unexpected error.";
            // 
            setErrMsg(msg);
            console.error("Error in fetchCountries in CountrySelector.", "Message : ", msg, "Error : ", err);
        } finally {
            setIsLoading(false);
        }
    }
    // Handle selection
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        const selectedCityData = cities?.find((city) => city.name === selected) || null;
        setSelectedCity(selectedCityData);
    };

    // Effects
    // Fetch cities if not any 
    useEffect(() => {
        if (!cities) {
            fetchCities();
        }
    }, []);
    // Update locationCookieData
    useEffect(() => {
        if (selectedCity && locationCookieData) {
            setLocationCookieData({ ...locationCookieData, lat: selectedCity.lat, lng: selectedCity.lng, defaultCity: selectedCity.name })
        }
    }, [selectedCity])

    return (
        <select
            value={selectedCity?.name || locationCookieData?.defaultCity}
            className={'max-w-44 cursor-pointer bg-background text-secondary rounded-xl px-2 font-semibold focus:outline-none focus:ring-2 focus:ring-secondary transition-all'}
            disabled={isLoading || !!errMsg || !cities}
            onChange={handleSelect}
        >

            {isLoading && (
                <option className="text-white bg-secondary" hidden>Loading cities...</option>
            )}

            {!selectedCity &&
                <option hidden>
                    Select City
                </option>
            }

            {errMsg && (
                <option className="text-red-500 bg-secondary" hidden>{errMsg}</option>
            )}

            {cities?.map((city, idx) => (
                <option key={idx} value={city.name} className="font-poppin font-semibold ">
                    {city.name}
                </option>
            ))}

        </select>

    )
}

export default CitySelector;