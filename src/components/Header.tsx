'use client';

// Imports
import Link from "next/link";
import Image from "next/image";
import { getUserLocation } from "@/app/providers/LocationProvider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, LocationEdit, AlignJustify } from "lucide-react";
import { AreaProvider } from "@/app/providers/AreaProvider";
import CityLister from "./CityLister";

// 
function Header() {
    const pathname = usePathname();
    const { userLocation, setUserLocation, selectedCity, setSelectedCity } = getUserLocation();
    const navigationItems = [
        {
            href: '/top/world/profiles',
            label: 'Top World Profiles',
            isActive: pathname === '/top/world/profiles',
        },
        {
            href: '/top/country/profiles',
            label: 'Top Country Profiles',
            isActive: pathname === '/top/country/profiles',
        }
    ]
    const [isFetchingCity, setIsFetchingCity] = useState<boolean>(false);
    const [cityListingError, setCityListingError] = useState<string | null>(null);
    const [listCity, setListCity] = useState<boolean>(false);
    const [cities, setCities] = useState<string[] | null>(null);
    const [expandNav, setExnapadNav] = useState<boolean>(false);

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
    }
    const fetchCity = async () => {
        if (!userLocation) {
            setCityListingError("Error while fetching cities");
            return;
        };
        if (cities) return;

        setIsFetchingCity(true);
        setCityListingError(null);
        try {
            const response = await fetch(`/api/geonames/?countryCode=${userLocation?.countryCode}`)
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

    useEffect(() => {
        if (listCity && !cities) {
            fetchCity();
        }
    }, [listCity])

    return (
        <>
            <header id="header" role="banner" className={`bg-background min-w-screen md:h-auto ${expandNav ? 'xxs:h-50' : 'xxs:h-22'}  grid items-center justify-between md:grid-flow-col xxs:grid-flex-row grid-row-1 md:px-6 xxs:px-0 py-6 duration-200`}>
                {/*  */}
                <div className="md:min-w-auto xxs:min-w-screen md:px-0 xxs:px-4 flex items-center justify-between">
                    {/*  */}
                    <div id="logo" className="shrink-0">
                        <Link href="/" area-label="Bizranker Buisness Directory Home">
                            <Image
                                src='/main-logo.svg'
                                alt="BizRanker - Business Directory and Ranking Platform Logo"
                                width={150}
                                height={50}
                                className="hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>

                    {/*  */}
                    <button onClick={() => setExnapadNav(!expandNav)} className="md:hidden xxs:block p-2 bg-primary rounded-xl border border-secondary/50 hover:bg-transparent transition-colors cursor-pointer">
                        <AlignJustify className="w-6 h-6 text-secondary" />
                    </button>

                </div>

                {/*  */}
                <nav id="navbar" role="navigation" area-label="Main navigation" className={`md:block ${expandNav ? "xxs:block" : "xxs:hidden"}`}>
                    <ul className="w-auto flex md:flex-row xxs:flex-col space-x-6 md:space-y-0 xxs:space-y-4 md:py-0 xxs:py-4 font-semibold text-secondary">
                        {navigationItems.map((item, idx) => (
                            <li key={idx} className="list-none text-center">
                                <Link className={`underline-animation translate-x-full hover:text-secondary duration-100 ${item.isActive ? 'text-secondary' : 'text-primary'}`} href={item.href} title={item.label} aria-current={item.isActive ? 'page' : undefined}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <AreaProvider>
                                <CityLister setUserLocation={setUserLocation} />
                            </AreaProvider>
                        </li>
                    </ul>
                </nav>

            </header>
        </>
    )
}

export default Header;