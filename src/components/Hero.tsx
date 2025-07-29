// Imports
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { getUserLocation } from "@/app/providers/LocationProvider";
import AddBuisnessBtn from "./AddBuisnessBtn";

// 
function Hero() {
    const { userLocation, selectedCity } = getUserLocation();
    const navigationItems = [
        {
            href: '/about-us',
            label: 'About us',
        },
        {
            href: '/terms-of-usage',
            label: 'Terms Of Usage',
        },
        {
            href: '/privacy-policy',
            label: 'Privacy Policy',
        }
    ]

    // 
    return (
        <>
            <main className="min-w-screen pt-16 pb-4 bg-gradient-to-b from-background to-white flex items-center justify-center text-center">
                <article className="md:w-1/2 xxs:1/1 flex flex-col items-center justify-center gap-y-6">
                    <header className="w-full flex flex-col items-center justify-center gap-y-4">
                        <h1>
                            <Image className="md:w-auto xs:w-50 xxs:w-46" src='/main-logo.svg' width={250} height={100} alt="Bizraker - Buisness Directory and Ranking Platform logo" />
                            <span className="sr-only">Bizranker</span>
                        </h1>

                        <h2 className="text-primary md:text-2xl sm:text-xl xxs:text-lg font-semibold">
                            Top Buisness
                            <Typewriter
                                words={[" in City.", " in Country.", " in World."]}
                                loop={false}
                                typeSpeed={50}
                            />
                        </h2>
                    </header>

                    <section className="w-full flex flex-col items-center justify-center">

                        {/*  */}
                        <div className="w-full flex flex-row items-center justify-center gap-x-2 my-2 md:px-0 xxs:px-4">
                            <input type="search" placeholder="Search resturants , cafe or other buisnesses." className="md:w-2/3 xxs:w-full border border-primary rounded-xl px-2 py-3 placeholder:text-secondary outline-none text-secondary" aria-label="Search box" />
                            <button type="button" className="bg-secondary p-2 rounded-full border border-secondary hover:bg-transparent transition-colors cursor-pointer group" aria-label="Search">
                                <Search className="w-7 h-7 text-primary group-hover:text-secondary" />
                            </button>
                        </div>

                        <p className="text-secondary my-2 md:text-md xxs:text-sm">Searching in <strong className="text-primary">{selectedCity || userLocation?.defaultCity || userLocation?.capital}</strong> , <strong>{userLocation?.countryCode}</strong></p>

                        <nav className="my-2">
                            <ul className="flex gap-x-4 md:text-md xxs:text-sm">
                                {navigationItems.map((item, idx) => (
                                    <li key={idx} className="text-primary transition-colors decoration-secondary hover:text-secondary hover:decoration-primary group ">
                                        <span className="text-secondary group-hover:text-primary">| </span><Link href={item.href} className="underline">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <AddBuisnessBtn />

                    </section>
                </article>
            </main>
        </>
    )
}

export default Hero;