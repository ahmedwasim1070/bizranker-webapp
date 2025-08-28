'use client';

// Imports
import Image from "next/image";
import Link from "next/link";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
// Context
import { getGlobalProvider } from "@/providers/GlobalProvider";
// Components
import CitySelector from "./CitySelector";

// 
function Header() {
    // Context
    const { pathname } = getGlobalProvider();
    // States
    const [isExpanded, setIsExpaneded] = useState<boolean>(false);
    // Nav Contents
    const navigationItems = [
        {
            href: '/top/country/place',
            label: 'Top Country Places',
            isActive: pathname === '/top/country/places',
        },
        {
            href: '/top/city/places',
            label: 'Top City Places',
            isActive: pathname === '/top/city/places',
        }
    ]


    return (
        <header id="header" role="banner" className={`min-w-screen ${isExpanded ? 'xxs:h-50' : 'xxs:h-22'} bg-background py-6 flex flex-row md:gap-y-0 xxs:gap-y-4 items-center justify-between md:flex-nowrap xxs:flex-wrap xs:px-6 xxs:px-2 overflow-hidden transition-all`}>
            {/* Left */}
            <div className="flex items-center justify-between md:min-w-auto xxs:min-w-full">
                <Link href={'/'} className="cursor-pointer group">
                    <Image className="group-hover:opacity-80 transition-opacity" src={'./main-logo.svg'} width={150} height={50} alt="RankedPlaces - Business Directory and Ranking Platform Logo" />
                </Link>

                <button onClick={() => setIsExpaneded(!isExpanded)} className="md:hidden xxs:block p-2 bg-primary rounded-lg shadow-sm border border-secondary/80 cursor-pointer hover:bg-transparent transition-colors">
                    <AlignJustify className="w-6 h-6 text-secondary" />
                </button>
            </div>


            {/* Right */}
            <nav>
                <ul className="md:min-w-auto min-w-screen flex md:flex-row flex-col items-center gap-x-5 xxs:gap-y-4 xxs:py-8">
                    {/* Nav Items */}
                    {navigationItems.map((nav, idx) => (
                        <li key={idx} className="list-none">
                            <Link className={`font-semibold text-secondary hover:text-primary underline-animation ${nav.isActive && 'text-primary'}`} href={nav.href}>{nav.label}</Link>
                        </li>
                    ))}
                    {pathname !== '/' &&
                        <li className="list-none">
                            <CitySelector />
                        </li>
                    }
                </ul>
            </nav>
        </header>
    )
}

export default Header;
