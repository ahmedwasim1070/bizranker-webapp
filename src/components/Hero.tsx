"use client";

// Imports
import { Search } from "lucide-react";
import Image from "next/image";
// Providers
import { getLocationProvider } from "@/providers/LocationProvider";

// 
function Hero() {
    // Provider
    // Location
    const { locationCookieData } = getLocationProvider();

    return (
        <main role="main" className="min-w-screen py-10 flex flex-col items-center bg-gradient-to-b from-background to-white gap-y-3">
            {/*  */}
            <article className="text-center">
                <header>
                    {/*  */}
                    <h1>
                        <Image className="" src={'/main-logo.svg'} width={270} height={120} alt="RankedPlaces - Business Directory and Ranking Platform logo" />
                        <span className="sr-only">RankedPlaces</span>
                    </h1>

                    {/*  */}
                    <h2 className="font-semibold text-primary">Top Places In World</h2>
                </header>
            </article>

            {/*  */}
            <section className="min-w-2/6 flex flex-col justify-center items-center ">
                <div className="min-w-full flex flex-row items-center gap-x-1">
                    <input type="search" className="min-w-full border-2 border-gray-400 rounded-full px-3 py-2 text-secondary placeholder:text-gray-400 outline-none focus:border-primary " placeholder="Search tag or place." />
                    <button className="bg-primary p-2 rounded-full border-2 border-primary hover:bg-transparent cursor-pointer transition-colors">
                        <Search className="w-6 h-6 text-secondary" />
                    </button>
                </div>
                {/*  */}
                <p className="text-secondary my-2 md:text-md xxs:text-sm">Searching in <strong className="text-primary">{locationCookieData?.defaultCity}</strong> , <strong>{locationCookieData?.countryCode}</strong></p>
            </section>
        </main>
    )
}

export default Hero;