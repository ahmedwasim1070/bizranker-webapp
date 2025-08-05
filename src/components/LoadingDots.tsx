import React from 'react';
import { motion } from 'framer-motion';

interface LoadingDotsProps {
    fullscreen?: boolean;
    className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ fullscreen = false, className = '' }) => {
    const containerClass = fullscreen
        ? "fixed inset-0 flex items-center justify-center bg-white z-50"
        : "flex items-center justify-center";
    return (
        <div className={`${containerClass} ${className}`}>
            <div className="flex items-center space-x-2">
                <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#fe7743' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#273f4f' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#fe7743' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
        </div>
    );
};

export default LoadingDots;