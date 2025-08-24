// Imports
import { useEffect, useState } from "react";
// Types
import { ApiResponse, CitiesResponse } from "@/types";
// Porviders
import { getLocationProvider } from "@/providers/LocationProvider";

// 
function CitySelector() {
    // Context
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
            const res = await fetch('/data/countries.json');
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
            setIsLoading(true);
            // 
            setErrMsg(msg);
            console.error("Error in fetchCountries in CountrySelector.", "Message : ", msg, "Error : ", err);
        }
    }
    // Handle selection
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedCity(selected);
    };

    // Effects
    // Fetch cities if not any 
    useEffect(() => {
        if (!cities) {
            fetchCities();
        }
    }, [cities]);
    // Update locationCookieData
    useEffect(() => {
        if (selectedCity && locationCookieData) {
            setLocationCookieData({ ...locationCookieData, lat: selectedCity.lat, lng: selectedCity.lng, defaultCity: selectedCity.name })
        }
    }, [selectedCity])

    return (
        <select
            value={selectedCity?.name || locationCookieData?.capital}
            className={'border border-secondary cursor-pointer text-white bg-secondary font-semibold rounded-xl p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all'}
            disabled={isLoading || !!errMsg || !cities}
            onChange={handleSelect}
        >

            {!selectedCity &&
                <option hidden>
                    Select City
                </option>
            }

            {isLoading && (
                <option className="text-white bg-secondary" hidden>Loading cities...</option>
            )}

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