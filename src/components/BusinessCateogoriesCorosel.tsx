// Imports
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

// 
function BusinessCateogoriesCorosel() {
    const sliderRef = useRef(null);
    const [businessCategory, setBusinessCategory] = useState<any[] | null>(null);

    const fetchBusinessType = async () => {
        try {
            const res = await fetch('/api/fetchCategories');
            if (!res.ok) {
                throw new Error("Failed to fetch business types.");
            }

            const data = await res.json();
            const businessCategory = data.data;
            setBusinessCategory(businessCategory);
        } catch (error) {
            console.error('Error fetching business types:', error);
        }
    }
    const handleScroll = (direction: string) => {
        const slider = sliderRef.current as HTMLElement | null;
        if (!slider) return;

        const scrollAmount = 500; // Adjust as needed

        if (direction === "next") {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
                // At end, loop to start
                animate(slider.scrollLeft, 0, {
                    duration: 0.5,
                    onUpdate: (latest) => {
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

    // 
    useEffect(() => {
        if (!businessCategory) {
            fetchBusinessType();
        }
    }, [])

    // 
    return (
        <>
            <section className="min-w-screen h-10 flex flex-row items-center py-10 px-2 xxs:px-4 bg-white">
                <button
                    onClick={() => handleScroll("prev")}
                    className="bg-primary rounded-full p-1 xxs:p-2 border border-primary transition-colors hover:bg-transparent cursor-pointer"
                >
                    <ChevronLeft className="w-6 h-6 xxs:w-8 xxs:h-8 text-secondary" />
                </button>

                <div
                    ref={sliderRef}
                    className="w-full flex flex-row gap-x-1 xxs:gap-x-2 overflow-x-scroll mx-1 xxs:mx-2 rounded-lg scrollbar-hidden"
                >
                    {businessCategory && businessCategory.map((business, idx) => (
                        <div
                            key={idx}
                            className="flex flex-row items-center gap-x-1 xxs:gap-x-2 border border-secondary bg-secondary rounded-lg px-3 py-2.5 text-nowrap cursor-pointer group transition-colors hover:bg-transparent"
                        >
                            <p className="text-white group-hover:text-secondary font-semibold text-xxs xxs:text-base">Top{" "}{business.name}</p>
                        </div>
                    ))}
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