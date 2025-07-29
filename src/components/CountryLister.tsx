'use client';

// Imports
import { getAreaProvider } from "@/app/providers/AreaProvider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { LocationDataContext } from "@/middleware";

// Type
type CountryListerProps = {
    setUserLocation: (userLocation: LocationDataContext | null) => void;
}

// 
function CountryLister({ setUserLocation }: CountryListerProps) {
    const { locationPayload, setLocationPayload } = getAreaProvider();
    const [countries, setCountries] = useState<any[] | null>(null);
    const [listCountry, setListCountry] = useState<boolean>(false);
    const [isFetchingCountry, setIsFetchingCountry] = useState<boolean>(false);
    const [countryListingError, setCountryListingError] = useState<string | null>(null);

    const fetchCountries = async () => {
        setIsFetchingCountry(true);
        setCountryListingError(null);
        try {
            const res = await fetch('/data/countries.json');
            if (!res.ok) {
                setCountryListingError("Failed to fetch countries.");
                throw new Error("Failed to fetch countries");
            }

            const data = await res.json();
            setCountries(data);
        } catch (error) {
            setCountryListingError("Failed to fetch countries.");
            console.error("Error while fetching data", error);
        } finally {
            setIsFetchingCountry(false);
        }
    }
    const handleCountrySelection = async (country: string, countryCode: string, capital: string) => {
        if (locationPayload?.country !== country) {
            setLocationPayload({ ...locationPayload, country, countryCode, capital })
            setUserLocation({ ...locationPayload, country, countryCode, capital })
        }
    }

    useEffect(() => {
        if (listCountry && !countries) {
            fetchCountries();
        }
    }, [listCountry])

    return (
        <>
            {/*  */}
            <div
                className="relative flex flex-row items-center gap-x-2 cursor-pointer group my-2 bg-secondary rounded-lg p-2 hover:bg-background border border-white hover:border-secondary"
                onClick={() => setListCountry(!listCountry)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setListCountry(!listCountry);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={listCountry}
                aria-haspopup="listbox"
                aria-label={`Current location: ${locationPayload?.country}`}
            >
                <span className="text-white group-hover:text-secondary">{locationPayload?.country || "Select Country"}</span>
                {!listCountry ? (
                    <ChevronDown className="w-5 h-5 text-white group-hover:text-secondary transition-colors" />
                ) : (
                    <ChevronUp className="w-5 h-5 text-white group-hover:text-secondary transition-colors" />
                )}
                {listCountry &&
                    <div className="absolute min-w-full min-h-[20vh] flex flex-col items-center inset-0 border-x border-b rounded-b-lg top-10 border-secondary bg-background overflow-y-scroll" role="listbox" aria-label="Select Country">
                        {/* Loader */}
                        {isFetchingCountry &&
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
                        {countryListingError &&
                            <div className="p-4 text-red-500 text-sm" role="alert">
                                {countryListingError}
                            </div>
                        }
                        {/* Countries */}
                        {countries && countries.map((country, idx) => (
                            <button onClick={() => handleCountrySelection(country.name, country.code, country.capital)} className={`w-full py-2 cursor-pointer text-secondary hover:bg-secondary hover:text-white ${locationPayload?.country === country.name && 'bg-secondary text-white'} `} key={idx} role="option" aria-selected={country === locationPayload?.country} tabIndex={listCountry ? 0 : -1}>
                                {country.name}
                            </button>
                        ))}
                    </div>
                }
            </div>

        </>
    )
}

export default CountryLister