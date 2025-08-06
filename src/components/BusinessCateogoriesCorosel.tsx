// Imports
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { getGlobalProvider } from "@/app/providers/GolobalProvider";

// Skeleton loader for category buttons
const CategorySkeleton = () => (
    <div className="flex flex-row gap-x-2 w-full">
        {[...Array(15)].map((_, idx) => (
            <div
                key={idx}
                className="xs:h-12 xxs:h-10 w-22 xxs:w-34 rounded-lg bg-gray-400 animate-pulse"
            />
        ))}
    </div>
);

function BusinessCateogoriesCorosel() {
    // Context
    const { selectedCategoryId, setSelectedCategoryId } = getGlobalProvider();
    // Refs
    const sliderRef = useRef(null);
    // States
    const [isFeching, setIsFetching] = useState<boolean>(false);
    const [businessCategories, setBusinessCategories] = useState<any[] | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    // fetchAllBuinessTypes
    const fetchBusinessType = async () => {
        setIsFetching(true);
        setIsError(false);
        try {
            const res = await fetch('/api/fetchCategories');
            if (!res.ok) {
                setIsFetching(false);
                setIsError(true);
                throw new Error("Failed to fetch business categories.");
            }

            const data = await res.json();
            const storedBusinessCategory = data.data;
            setBusinessCategories(storedBusinessCategory);
        } catch (error) {
            console.error('Error fetching business types:', error);
            setIsError(true);
            setIsFetching(false);
        } finally {
            setIsFetching(false);
        }
    }
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
        const categoryId = parseInt((e.target as HTMLButtonElement).value);
        if (selectedCategoryId !== categoryId) {
            setSelectedCategoryId(categoryId);
        }
    }


    // Effects
    useEffect(() => {
        if (!businessCategories) {
            fetchBusinessType();
        }
    }, [])

    // 
    return (
        <>
            <section hidden={isError} className="min-w-screen h-10 flex flex-row items-center py-10 px-2 xxs:px-4 bg-white">
                <button
                    onClick={() => handleScroll("prev")}
                    className="bg-primary rounded-full p-1 xxs:p-2 border border-primary transition-colors hover:bg-transparent cursor-pointer"
                >
                    <ChevronLeft className="w-6 h-6 xxs:w-8 xxs:h-8 text-secondary" />
                </button>

                <div
                    ref={sliderRef}
                    className="w-full flex flex-row gap-x-1 xxs:gap-x-2 overflow-x-scroll mx-1 xxs:mx-2 rounded-lg scrollbar-hidden"
                    style={{ minHeight: '48px', minWidth: '120px', position: 'relative' }}
                >
                    {isFeching ? (
                        <CategorySkeleton />
                    ) : (
                        <>
                            <button
                                value={0}
                                onClick={handleCategoryChange}
                                type="button"
                                aria-label="Change Category"
                                className={`flex flex-row items-center font-semibold text-xxs xxs:text-base gap-x-1 xxs:gap-x-2 border  border-secondary bg-secondary rounded-lg px-3 py-2.5 text-nowrap  group transition-colors  ${selectedCategoryId === 0 ? 'bg-transparent text-secondary' : 'text-white hover:bg-transparent hover:text-secondary cursor-pointer'}`}
                            >
                                All
                            </button>
                            {businessCategories && businessCategories.map((category, idx) => (
                                <button
                                    key={idx}
                                    value={category.id}
                                    onClick={handleCategoryChange}
                                    type="button"
                                    aria-label="Change Category"
                                    className={`flex flex-row items-center font-semibold text-xxs xxs:text-base gap-x-1 xxs:gap-x-2 border  border-secondary bg-secondary rounded-lg px-3 py-2.5 text-nowrap  group transition-colors  ${selectedCategoryId === category.id ? 'bg-transparent text-secondary' : 'text-white hover:bg-transparent hover:text-secondary cursor-pointer'}`}
                                >
                                    Top{" "}{category.name}
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