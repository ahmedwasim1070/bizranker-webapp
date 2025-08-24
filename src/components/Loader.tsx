// Imports
import React from "react";

// Interface
interface LoaderProps {
    fullscreen?: boolean;
    className?: string;
}

// 
function Loader({ fullscreen, className }: LoaderProps) {
    // Full screen class creater
    const containerClass = fullscreen
        ? "fixed inset-0 flex items-center justify-center bg-background/10 z-50 backdrop-blur-sm"
        : "flex items-center justify-center";

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                <span className="w-4 h-4 rounded-full bg-secondary animate-bounce [animation-delay:200ms]" />
                <span className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:400ms]" />
            </div>
        </div>
    );
};

export default Loader;
