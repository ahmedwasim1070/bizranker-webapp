// Imports
import React from "react";

// Interface
interface LoaderProps {
    fullscreen?: boolean;
    className?: string;
    dotSize?: string;
}

// 
function Loader({ fullscreen, className, dotSize = "4" }: LoaderProps) {
    // Full screen class creator
    const containerClass = fullscreen
        ? "fixed inset-0 flex items-center justify-center bg-background/10 z-50 backdrop-blur-sm"
        : "flex items-center justify-center";

    // Predefined size mapping to ensure Tailwind includes these classes
    const sizeMap: Record<string, string> = {
        "1": "w-1 h-1",
        "2": "w-2 h-2",
        "3": "w-3 h-3",
        "4": "w-4 h-4",
        "5": "w-5 h-5",
        "6": "w-6 h-6",
        "8": "w-8 h-8",
        "10": "w-10 h-10",
        "12": "w-12 h-12"
    };

    // Dot size classes (fallback to w-4 h-4 if size not found)
    const dotSizeClasses = sizeMap[dotSize] || "w-4 h-4";

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="flex items-center space-x-2">
                <span className={`${dotSizeClasses} rounded-full bg-primary animate-bounce [animation-delay:0ms]`} />
                <span className={`${dotSizeClasses} rounded-full bg-secondary animate-bounce [animation-delay:200ms]`} />
                <span className={`${dotSizeClasses} rounded-full bg-primary animate-bounce [animation-delay:400ms]`} />
            </div>
        </div>
    );
}

export default Loader;