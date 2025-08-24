'use client';

// Imports
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Components
import CitySelector from "./CitySelector";

// 
function Header() {
    // Paht
    const pathname = usePathname();
    // Nav Contents
    const navigationItems = [
        {
            href: '/top/country/profiles',
            label: 'Top Country Places',
            isActive: pathname === '/top/country/profiles',
        },
        {
            href: '/top/city/profiles',
            label: 'Top City Places',
            isActive: pathname === '/top/city/profiles',
        }
    ]


    return (
        <header id="header" role="banner" className="min-w-screen flex flex-row items-center bg-background justify-between py-8 px-6">
            {/* Left */}
            <div>
                <Link href={'/'} className="cursor-pointer group">
                    <Image className="group-hover:opacity-80 transition-opacity" src={'./main-logo.svg'} width={150} height={50} alt="RankedPlaces - Business Directory and Ranking Platform Logo" />
                </Link>
            </div>

            {/* Right */}
            <nav>
                <ul className="flex flex-row items-center gap-x-5">
                    {/* Nav Items */}
                    {navigationItems.map((nav, idx) => (
                        <li key={idx} className="list-none">
                            <Link className={`font-semibold text-secondary hover:text-primary underline-animation ${nav.isActive && 'text-primary'}`} href={nav.href}>{nav.label}</Link>
                        </li>
                    ))}
                    <li className="list-none">
                        <CitySelector />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
