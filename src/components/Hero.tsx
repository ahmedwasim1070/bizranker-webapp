// Imports
import Image from "next/image";
import { motion } from 'framer-motion';
import { Search } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import AddCategoryBtn from "./AddCategoryBtn";
import GoogleAccountBtn from "./GoogleAuthBtn";

// 
function Hero() {
    const { userLocation } = getGlobalProvider();

    // 
    return (
        <>
            <main className="min-w-screen pt-32 pb-4 bg-gradient-to-b from-background to-white flex items-center justify-center text-center">
                <article className="md:w-1/2 xxs:1/1 flex flex-col items-center justify-center gap-y-6">
                    <header className="w-full flex flex-col items-center justify-center gap-y-3">

                        <motion.h1
                            initial={{ y: 40, scale: 0.50, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image className="md:w-auto xs:w-50 xxs:w-46" src='/main-logo.svg' width={270} height={120} alt="Bizraker - Business Directory and Ranking Platform logo" />
                            <span className="sr-only">Bizranker</span>
                        </motion.h1>

                        <motion.h2
                            initial={{ y: 40, scale: 0.50, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-secondary md:text-2xl sm:text-xl xxs:text-lg font-bold"
                        >
                            Top Business
                            <Typewriter
                                words={[" in City.", " in Country.", " in World."]}
                                loop={false}
                                typeSpeed={50}
                            />
                        </motion.h2>
                    </header>

                    <section className="w-full flex flex-col items-center justify-center">

                        {/*  */}
                        <motion.div
                            initial={{ y: 40, scale: 0.50, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-full flex flex-row items-center justify-center gap-x-2 my-2 md:px-0 xxs:px-4"
                        >
                            <input type="search" placeholder="Search resturants , cafe or other business." className="lg:w-2/3 md:w-2/1 xxs:w-full border-2 border-gray-400 rounded-lg px-2 py-2.5 text-gray-700 outline-none focus:border-primary transition-all " aria-label="Search box" />
                            <button type="button" className="bg-primary p-2.5 rounded-full border border-primary hover:bg-transparent transition-colors cursor-pointer group" aria-label="Search">
                                <Search className="w-6.5 h-6.5 text-secondary group-hover:text-secondary" />
                            </button>
                        </motion.div>

                        <p className="text-secondary my-2 md:text-md xxs:text-sm">Searching in <strong className="text-primary">{userLocation?.defaultCity || userLocation?.capital}</strong> , <strong>{userLocation?.countryCode}</strong></p>

                        <GoogleAccountBtn />

                        <AddCategoryBtn />

                    </section>
                </article>
            </main>
        </>
    )
}

export default Hero;