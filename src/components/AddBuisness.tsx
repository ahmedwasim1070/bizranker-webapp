'use client';

// Imports
import Image from "next/image";
import { X } from "lucide-react";
import { getUserLocation } from "@/app/providers/LocationProvider";
import AreaSelectorProvider from "@/app/providers/AreaSelectorProvider";
// Components
import CountryLister from "./CountryLister";
import CityLister from "./CityLister";

function AddBuisness() {
    const { setIsAddBuisness } = getUserLocation();

    return (
        <>
            <section className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4">
                <dialog open
                    role="dialog"
                    aria-labelledby="add-business-dialog"
                    aria-modal="true"
                    className="relative w-full max-w-2xl max-h-[90vh] bg-background border-1 border-secondary rounded-xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 ">
                        <Image
                            src='/main-logo.svg'
                            alt="BizRanker - Business Directory and Ranking Platform Logo"
                            width={150}
                            height={50}
                        />
                        <button
                            onClick={() => setIsAddBuisness(false)}
                            className="p-2 rounded-full border border-secondary hover:bg-primary transition-all duration-200 cursor-pointer"
                            aria-label="Close dialog"
                        >
                            <X className="w-6 h-6 text-secondary" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col items-center justify-center px-6">
                        <h2 className="text-primary text-2xl font-semibold">Add Your Buisness</h2>

                        <div className="min-w-full flex flex-row py-4">

                            {/* Left */}
                            <div className="min-w-1/2">
                                <div className="rounded-full border border-secondary bg-white"></div>
                            </div>

                            {/* Right */}
                            <div className="min-w-1/2 flex flex-col items-center gap-y-2">
                                <div>
                                    <label className="sr-only" htmlFor="buisnessName">Buisness Name:</label>
                                    <input className="border border-secondary text-secondary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary transition-all placeholder:text-primary" name="buisnessName" type="text" placeholder="Buisness name" />
                                </div>

                                <div className="flex flex-row items-center gap-x-2 overflow-y-clip">
                                    <AreaSelectorProvider>
                                        <CountryLister />
                                        <CityLister />
                                    </AreaSelectorProvider>
                                </div>

                            </div>


                        </div>
                    </div>
                </dialog>
            </section>
        </>
    )
}

export default AddBuisness;