"use client";

// Imports
import { useEffect, useState } from "react"

// 
function CountryLister() {
    // States
    const [countries, setCountries] = useState<any[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    // Func
    const fetchCountries = async () => {
        setIsFetching(true);
        setFetchingError(null);
        try {
            const response = await fetch("/data/countries.json");
            if (!response.ok) {
                setFetchingError("Error while loading countries.");
                throw new Error("Failed to fetch countries");
            }

            const data = await response.json();
            setCountries(data);
        } catch (error) {
            setFetchingError("Error while loading countries.");
            console.error("Failed to fetch countries.", error);
        } finally {
            setIsFetching(false);
        }
    }

    // Func
    useEffect(() => {
        if (!countries || countries.length === 0) {
            fetchCountries();
        }
    }, [countries])

    // 
    return (
        <>
            <select>
                {countries && countries.length > 0 && countries.map(() => (
                    <option></option>
                ))}
            </select>
        </>
    )
}

export default CountryLister;