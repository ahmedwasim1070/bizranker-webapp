'use client';

// Imports
import Link from "next/link";
import { useEffect, useState } from "react";
// Types
import { CountryResponse } from "@/types";
// Porviders
import { getLocationProvider } from "@/providers/LocationProvider";

// 
function CountrySelector() {
    // Providers
    // Location
    const { locationCookieData, setLocationCookieData } = getLocationProvider();
    // States
    // Selected country 
    const [selectedCountry, setSelectedCountry] = useState<CountryResponse | null>(null);
    // Country data state
    const [countries, setCountries] = useState<CountryResponse[] | null>(null);
    // Loader state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Error message 
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // Nav Contents
    const navigationItems = [
        {
            href: '/top/world/places',
            label: 'Top World Places',
        },
    ]
    // Fetch country from (/public/data/countries.json)
    const fetchCountries = async () => {
        // 
        setIsLoading(true);
        // 
        setErrMsg(null);
        try {
            const res = await fetch('/data/countries.json');
            if (!res.ok) {
                throw new Error("Failed to fetch countries.")
            }

            const data = await res.json();
            setCountries(data);
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
        const selected = JSON.parse(e.target.value);
        setSelectedCountry(selected);
    };

    // Effects
    // Fetch countries if not any
    useEffect(() => {
        if (!countries) {
            fetchCountries();
        }
    }, [])
    // Set the country data to locationCookie
    useEffect(() => {
        if (selectedCountry) {
            const locationPayload = {
                ...selectedCountry,
                defaultCity: selectedCountry.capital,
            }
            setLocationCookieData(locationPayload);
        }
    }, [selectedCountry])

    return (
        <>
            <dialog role="dialog" aria-labelledby="location-title" aria-modal="true" className="fixed z-50 min-w-screen min-h-screen flex flex-col items-center space-y-2 justify-center bg-background/60 overflow-hidden backdrop-blur-sm">
                <h2 className="text-3xl text-primary font-semibold">Failed to fetch location.</h2>

                <p className="text-secondary text-lg font-semibold">Select Manually.</p>

                <form className="flex flex-row space-x-4 items-center justify-center">
                    <select
                        className="border border-secondary cursor-pointer text-secondary bg-background font-semibold rounded-xl p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                        disabled={isLoading || !!errMsg || !countries}
                        onChange={handleSelect}
                    >
                        {isLoading && (
                            <option className="text-white bg-secondary" hidden>Loading countries...</option>
                        )}

                        <option hidden>
                            Select Country
                        </option>

                        {errMsg && (
                            <option className="text-red-500 bg-secondary" hidden>{errMsg}</option>
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
                </form>

                <h3 className="text-secondary font-bold">Or</h3>

                <h4 className="text-primary font-bold">Continue to</h4>

                <nav>
                    <ul className="inline-flex space-x-2">
                        {navigationItems.map((nav, idx) => (
                            <li key={idx} className="list-none text-secondary">
                                <Link className="translate-x-full hover:text-primary hover:decoration-secondary duration-100 underline decoration-primary group" href={nav.href} title={nav.label} >
                                    <span className="text-primary group-hover:text-secondary">|</span> {nav.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <span className="text-primary">Cookies should be enabled for best experience.</span>

            </dialog>
        </>
    )
}

export default CountrySelector;
