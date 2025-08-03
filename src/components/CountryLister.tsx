"use client";

// Imports
import React, { useEffect, useState } from "react"
// Context
import { useAreaSelectorContext } from "@/app/providers/AreaSelectorProvider";

// Component
function CountryLister() {
    // Context states
    const { setSelectedCountryData } = useAreaSelectorContext();
    // States
    const [countries, setCountries] = useState<any[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    // Fetch Countries from public/data
    const fetchCountries = async () => {
        setIsFetching(true);
        setFetchingError(null);
        try {
            const res = await fetch("/data/countries.json");
            if (!res.ok) {
                setFetchingError("Error while loading Countries.");
                throw new Error(`Failed to fetch countries , status:${res.status}`)
            }

            const data = await res.json();
            setCountries(data);
        } catch (error) {
            setFetchingError("Error while loading countries.");
            console.error("Failed to fetch countries.", error);
        } finally {
            setIsFetching(false);
        }
    };
    // Handle selection
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedCountryData(selected);
    };


    // Effect
    useEffect(() => {
        if (!countries || countries.length === 0) {
            fetchCountries();
        }
    }, []);

    return (
        <select
            className="border border-secondary cursor-pointer text-white bg-secondary font-semibold rounded-xl p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            disabled={isFetching || !!fetchingError || !countries}
            onChange={handleSelect}
        >
            <option hidden>
                Select Country
            </option>

            {isFetching && (
                <option className="text-white bg-secondary" hidden>Loading countries...</option>
            )}

            {fetchingError && (
                <option className="text-red-500 bg-secondary" hidden>{fetchingError}</option>
            )}

            {countries && countries.length > 0 && countries.map((country, idx) => (
                <option
                    key={idx}
                    value={JSON.stringify(country)}
                    className="font-poppin font-semibold"
                >
                    {country.country}
                </option>
            ))}
        </select>
    );
}

export default CountryLister;
