"use client";

// Imports
import React, { useEffect, useState } from "react"
// Context
import { useAreaSelectorContext } from "@/app/providers/AreaSelectorProvider";

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
            const response = await fetch(`/api/geonames/?countryCode=${selectedCountryCode}`);
            if (!response.ok) {
                setFetchingError("Error while loading cities.");
                throw new Error("Failed to fetch cities.");
            }

            const data = await response.json();
            setCities(data);
        } catch (error) {
            setFetchingError("Error while loading cities.");
            console.error("Failed to fetch cities.", error);
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
                <option disabled hidden>
                    Select Country
                </option>
            }

            {isFetching && (
                <option className="text-white bg-secondary" hidden>Loading cities...</option>
            )}

            {fetchingError && (
                <option className="text-red-500 bg-secondary" hidden>{fetchingError}</option>
            )}

            {cities && cities?.length > 0 && cities.map((city, idx) => {
                if (selectedCountryCapital || selectedCity !== city) {
                    return (
                        <option key={idx} value={city} className="font-[Poppins]">
                            {city}
                        </option>
                    );
                }
                return null;
            })}

        </select>
    );
}

export default CityLister;