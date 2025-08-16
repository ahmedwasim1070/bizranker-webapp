"use client";

// Imports
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { getGlobalProvider } from "@/app/providers/GolobalProvider";

//  Loader
const CategorySkeleton = () => {
    return (
        <>
            {[...Array(15)].map((_, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:min-w-32 xxs:min-w-18 flex flex-row items-center gap-x-1 xxs:gap-x-2 border border-gray-300 bg-gray-300 rounded-lg px-3 py-2.5 text-nowrap group animate-pulse"
                />
            ))}
        </>
    );
};


// 
function BusinessCateogoriesCorosel() {
    // Context
    const { selectedCategory, setSelectedCategory, requestedCategories, isRequestingCategories, requestedCategoriesError } = getGlobalProvider();
    // Refs
    const sliderRef = useRef(null);
    // States

    // handleScroll
    const handleScroll = (direction: string) => {
        const slider = sliderRef.current as HTMLElement | null;
        if (!slider) return;

        const scrollAmount = 500; // Adjust as needed

        if (direction === "next") {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
                // At end, loop to start
                (slider.scrollLeft, 0, {
                    duration: 0.5,
                    onUpdate: (latest: number) => {
                        slider.scrollLeft = latest;
                    }
                });
            } else {
                const targetScroll = Math.min(
                    slider.scrollLeft + scrollAmount,
                    slider.scrollWidth - slider.clientWidth
                );
                animate(slider.scrollLeft, targetScroll, {
                    duration: 0.5,
                    onUpdate: (latest) => {
                        slider.scrollLeft = latest;
                    }
                });
            }
        } else {
            if (slider.scrollLeft <= 0) {
                // At start, loop to end
                animate(slider.scrollLeft, slider.scrollWidth - slider.clientWidth, {
                    duration: 0.5,
                    onUpdate: (latest) => {
                        slider.scrollLeft = latest;
                    }
                });
            } else {
                const targetScroll = Math.max(slider.scrollLeft - scrollAmount, 0);
                animate(slider.scrollLeft, targetScroll, {
                    duration: 0.5,
                    onUpdate: (latest) => {
                        slider.scrollLeft = latest;
                    }
                });
            }
        }
    };
    // handle category btn click
    const handleCategoryChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const category = (e.target as HTMLButtonElement).value;
        if (selectedCategory !== category) {
            setSelectedCategory(category);
        }
    }

    // 
    return (
        <>
            <section hidden={requestedCategoriesError} className="min-w-screen bg-white h-10 flex flex-row items-center justify-center py-10 overflow-hidden">
                <button
                    onClick={() => handleScroll("prev")}
                    className="bg-primary rounded-full p-1 xxs:p-2 border border-primary transition-colors mx-4 hover:bg-transparent cursor-pointer"
                >
                    <ChevronLeft className="w-6 h-6 xxs:w-8 xxs:h-8 text-secondary" />
                </button>

                <div
                    ref={sliderRef}
                    className="w-full xs:max-w-[85%] xxs:max-w-[70%] flex flex-row gap-x-1 xxs:gap-x-2 overflow-x-scroll mx-1 xxs:mx-2 rounded-lg scrollbar-hidden"
                    style={{ minHeight: '48px', minWidth: '120px', position: 'relative' }}
                >
                    {isRequestingCategories ? (
                        <CategorySkeleton />
                    ) : (
                        <>
                            <button
                                value={'all'}
                                onClick={handleCategoryChange}
                                type="button"
                                aria-label="Change Category"
                                className={`flex flex-row items-center font-semibold text-xxs xxs:text-base gap-x-1 xxs:gap-x-2 border  border-secondary bg-secondary rounded-lg px-3 py-2.5 text-nowrap  group transition-colors  ${selectedCategory === "all" ? 'bg-transparent text-secondary' : 'text-white hover:bg-transparent hover:text-secondary cursor-pointer'}`}
                            >
                                All
                            </button>
                            {requestedCategories && requestedCategories.map((category, idx) => (
                                <button
                                    key={idx}
                                    value={category.name}
                                    onClick={handleCategoryChange}
                                    type="button"
                                    aria-label="Change Category"
                                    className={`flex flex-row items-center font-semibold text-xxs xxs:text-base gap-x-1 xxs:gap-x-2 border  border-secondary bg-secondary rounded-lg px-3 py-2.5 text-nowrap  group transition-colors  ${selectedCategory === category.name ? 'bg-transparent text-secondary' : 'text-white hover:bg-transparent hover:text-secondary cursor-pointer'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </>
                    )}
                </div>

                <button
                    onClick={() => handleScroll("next")}
                    className="bg-primary rounded-full p-1 xxs:p-2 border border-primary transition-colors hover:bg-transparent cursor-pointer"
                >
                    <ChevronRight className="w-6 h-6 xxs:w-8 xxs:h-8 text-secondary" />
                </button>
            </section>
        </>
    )
}

export default BusinessCateogoriesCorosel;