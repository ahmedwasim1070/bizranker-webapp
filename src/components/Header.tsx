'use client';

// Imports
import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion';
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AlignJustify, LocationEdit } from "lucide-react";
import AreaSelectorProvider from "@/app/providers/AreaSelectorProvider";
import CityLister from "./CityLister";

// 
function Header() {
    const pathname = usePathname();
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
    const [expandNav, setExnapadNav] = useState<boolean>(false);

    return (
        <>
            <motion.header
                id="header" role="banner" className={`bg-background min-w-screen md:h-auto ${expandNav ? 'xxs:h-50' : 'xxs:h-22'}  grid items-center justify-between md:grid-flow-col xxs:grid-flex-row grid-row-1 md:px-6 xxs:px-0 py-6 duration-200`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
            >
                {/*  */}
                <div className="md:min-w-auto xxs:min-w-screen md:px-0 xxs:px-4 flex items-center justify-between">
                    {/*  */}
                    <div
                        id="logo" className="shrink-0"
                    >
                        <Link href="/" area-label="Bizranker Business Directory Home">
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
                    <button
                        onClick={() => setExnapadNav(!expandNav)} className="md:hidden xxs:block p-2 bg-primary rounded-lg border border-secondary/50 hover:bg-transparent transition-colors cursor-pointer"
                    >
                        <AlignJustify className="w-6 h-6 text-secondary" />
                    </button>

                </div>

                {/*  */}
                <nav
                    id="navbar" role="navigation" area-label="Main navigation" className={`md:block ${expandNav ? "xxs:block" : "xxs:hidden"}`}
                >
                    <ul className="w-auto flex md:flex-row xxs:flex-col space-x-6 md:space-y-0 xxs:space-y-4 md:py-0 xxs:py-4 font-bold ">
                        {navigationItems.map((item, idx) => (
                            <li key={idx} className="list-none text-center">
                                <Link className={`underline-animation translate-x-full hover:text-primary duration-100 ${item.isActive ? 'text-primary' : 'text-secondary'}`} href={item.href} title={item.label} aria-current={item.isActive ? 'page' : undefined}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="flex flex-row  items-center group">
                            <span>
                                <LocationEdit className="w-5 h-5 text-secondary group-hover:text-primary" />
                            </span>
                            <AreaSelectorProvider>
                                <CityLister customSelectCss="w-40 border-none text-secondary cursor-pointer group-hover:text-primary bg-background rounded-xl px-2" />
                            </AreaSelectorProvider>
                        </li>
                    </ul>
                </nav>

            </motion.header>
        </>
    )
}

export default Header;