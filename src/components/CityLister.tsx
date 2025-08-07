"use client";

// Imports
import React, { useEffect, useState } from "react"
// Context
import { useAreaSelectorContext } from "@/app/providers/AreaSelectorProvider";
import { FailedApiResponse, SuccessApiResponse } from "@/types";

// Interfaces
interface CityListerProps {
    customSelectCss?: string;
}

// Component
function CityLister({ customSelectCss }: CityListerProps) {
    // Context states
    const { selectedCountryCode, selectedCountryCapital, selectedCity, setSelectedCity } = useAreaSelectorContext();
    // States
    const [cities, setCities] = useState<string[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    // Fetch Cities from backend(/api/geonames)
    const fetchCities = async () => {
        setIsFetching(true);
        setFetchingError(null);
        if (!selectedCountryCode) {
            setIsFetching(false);
            setFetchingError("No selected country found. Unexpected error.")
            return;
        }
        try {
            const res = await fetch(`/api/geonames/?countryCode=${selectedCountryCode}`);
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                setFetchingError("Error while loading Cities.");
                throw new Error(`Error , ${errData}`);
            }

            const data = (await res.json()) as SuccessApiResponse;
            setCities(data.data);
        } catch (err) {
            setFetchingError("Error while loading cities.");
            console.error("Failed to fetch cities.", err);
        } finally {
            setIsFetching(false);
        }
    };
    // Handle selection
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedCity(selected);
    };


    // Effect
    useEffect(() => {
        if (selectedCountryCode) {
            fetchCities();
        } else {
            setCities(null);
        }
    }, [selectedCountryCode]);

    return (
        <select
            value={selectedCity || selectedCountryCapital}
            className={`${customSelectCss ? customSelectCss : 'border border-secondary cursor-pointer text-white bg-secondary font-semibold rounded-xl p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all'}`}
            disabled={isFetching || !!fetchingError || !cities}
            onChange={handleSelect}
        >

            {!selectedCountryCapital &&
                <option hidden>
                    Select City
                </option>
            }

            {isFetching && (
                <option className="text-white bg-secondary" hidden>Loading cities...</option>
            )}

            {fetchingError && (
                <option className="text-red-500 bg-secondary" hidden>{fetchingError}</option>
            )}

            {cities && cities?.length > 0 && cities.map((city, idx) => (
                <option key={idx} value={city} className="font-poppin font-semibold ">
                    {city}
                </option>
            ))}

        </select>
    );
}

export default CityLister;