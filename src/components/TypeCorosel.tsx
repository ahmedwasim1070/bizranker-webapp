// Imports
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buisnessTypeIcons } from "@/utils/buisnessTypeIcon";
import { animate } from "framer-motion";

// 
function TypeCorosel() {
    const sliderRef = useRef(null);
    const [buisnessType, setBuisnessType] = useState<any[] | null>(null);

    const fetchBuisnessType = async () => {
        try {
            const res = await fetch('/data/buisnessTypes.json');
            if (!res.ok) {
                throw new Error("Failed to fetch buisness types.");
            }

            const data = await res.json();
            setBuisnessType(data);
        } catch (error) {
            console.error('Error fetching business types:', error);
        }
    }
    const renderIcon = (iconName: string, className: string) => {
        const IconComponent = buisnessTypeIcons[iconName];
        return IconComponent ? <IconComponent className={className} /> : null;
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
        if (!buisnessType) {
            fetchBuisnessType();
        }
    }, [])

    // 
    return (
        <>
            <section className="min-w-screen h-10 flex flex-row items-center my-10 px-2 xs:px-4">
                <button
                    onClick={() => handleScroll("prev")}
                    className="bg-secondary rounded-full p-1 xs:p-2 border border-secondary transition-colors hover:bg-white cursor-pointer"
                >
                    <ChevronLeft className="w-6 h-6 xs:w-8 xs:h-8 text-primary" />
                </button>

                <div
                    ref={sliderRef}
                    className="w-full flex flex-row gap-x-1 xs:gap-x-2 overflow-x-scroll mx-1 xs:mx-2 rounded-xl scrollbar-hidden"
                >
                    {buisnessType && buisnessType.map((buisness, idx) => (
                        <div
                            key={idx}
                            className="flex flex-row items-center gap-x-1 xs:gap-x-2 border border-secondary bg-background rounded-full px-1 xs:px-2 py-1 xs:py-2 text-nowrap cursor-pointer group transition-colors hover:bg-transparent"
                        >
                            <span className="p-1 xs:p-2 rounded-full border border-secondary bg-primary group-hover:bg-secondary">
                                {renderIcon(buisness.icon, `w-4 h-4 xs:w-5 xs:h-5 text-secondary group-hover:text-primary`)}
                            </span>
                            <p className="text-secondary font-semibold text-xs xs:text-base">{buisness.type}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => handleScroll("next")}
                    className="bg-secondary rounded-full p-1 xs:p-2 border border-secondary transition-colors hover:bg-white cursor-pointer"
                >
                    <ChevronRight className="w-6 h-6 xs:w-8 xs:h-8 text-primary" />
                </button>
            </section>
        </>
    )
}

export default TypeCorosel;