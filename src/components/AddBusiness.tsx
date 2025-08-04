import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Coffee, UtensilsCrossed, ShoppingBag, Car, Scissors, Dumbbell, Heart, Home, Briefcase, GraduationCap, Wrench, Palette, LucideIcon } from 'lucide-react';
import { getGlobalProvider } from '@/app/providers/GolobalProvider';
import { FailedApiResponse, SuccessApiResponse } from '@/types';

interface BusinessIcon {
    icon: LucideIcon;
    label: string;
}

const AddBusiness: React.FC = () => {
    const { setIsAddBusiness } = getGlobalProvider();
    const [googleLink, setGoogleLink] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const businessIcons: BusinessIcon[] = [
        { icon: UtensilsCrossed, label: 'Restaurant' },
        { icon: Coffee, label: 'Cafe' },
        { icon: ShoppingBag, label: 'Retail' },
        { icon: Car, label: 'Automotive' },
        { icon: Scissors, label: 'Salon' },
        { icon: Dumbbell, label: 'Fitness' },
        { icon: Heart, label: 'Healthcare' },
        { icon: Home, label: 'Real Estate' },
        { icon: Briefcase, label: 'Services' },
        { icon: GraduationCap, label: 'Education' },
        { icon: Wrench, label: 'Repair' },
        { icon: Palette, label: 'Creative' }
    ];

    const validateGoogleBusinessLink = (url: string): boolean => {
        const googleBusinessPatterns: RegExp[] = [
            /^https:\/\/www\.google\.com\/maps\/place\/.+/,
            /^https:\/\/maps\.google\.com\/.+/,
            /^https:\/\/goo\.gl\/maps\/.+/,
            /^https:\/\/business\.google\.com\/.+/
        ];

        return googleBusinessPatterns.some(pattern => pattern.test(url));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        if (!googleLink.trim()) {
            setError('Please enter a Google Business Profile link');
            return;
        }
        if (!validateGoogleBusinessLink(googleLink)) {
            setError('Please enter a valid Google Business Profile link');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/scrape-business/?url=${googleLink}`);
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                throw new Error(`Error , ${errData.error}`);
            }

            const data = (await res.json()) as SuccessApiResponse;
            console.log(data.data);
        } catch (error) {
            setError("Unkown Error occured.");
            console.error("Failed to fetch cities.", error);
        } finally {
            setIsLoading(false);
        }
    };

    const LoadingDots: React.FC = () => (
        <div className="flex items-center justify-center space-x-1">
            <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#fe7743' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#273f4f' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#fe7743' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button onClick={() => setIsAddBusiness(false)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background backdrop-blur-sm hover:bg-secondary/20 transition-colors cursor-pointer">
                    <X className="w-7 h-7 text-primary" />
                </button>

                <div className="flex h-full">
                    {/* Left Side - Animated Icons */}
                    <div
                        className="flex-1 relative overflow-hidden flex flex-col items-center justify-center xs:block xxs:hidden"
                        style={{ backgroundColor: '#efeeea' }}
                    >
                        <div className="absolute inset-0 flex flex-wrap items-center justify-center p-8">
                            {businessIcons.map((item: BusinessIcon, index: number) => {
                                const IconComponent = item.icon;
                                return (
                                    <motion.div
                                        key={item.label}
                                        className="m-4 p-4 rounded-xl shadow-lg"
                                        style={{ backgroundColor: 'rgba(254, 119, 67, 0.1)' }}
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 3 + (index * 0.2),
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.3,
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <IconComponent
                                            className="w-8 h-8"
                                            style={{ color: '#273f4f' }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Floating Background Elements */}
                        <motion.div
                            className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20"
                            style={{ backgroundColor: '#fe7743' }}
                            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute bottom-20 right-10 w-16 h-16 rounded-full opacity-20"
                            style={{ backgroundColor: '#273f4f' }}
                            animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex-1 bg-white p-8 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-bold mb-8 text-center"
                                style={{ color: '#273f4f' }}
                            >
                                Add Business
                            </motion.h2>

                            <motion.form
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <label
                                        htmlFor="googleLink"
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: '#273f4f' }}
                                    >
                                        Add your Google Business Profile link
                                    </label>
                                    <input
                                        type="url"
                                        id="googleLink"
                                        value={googleLink}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoogleLink(e.target.value)}
                                        placeholder="https://www.google.com/maps/place/..."
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-gray-700"
                                        disabled={isLoading}
                                    />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 text-sm text-red-600"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: isLoading ? '#273f4f' : '#fe7743',
                                    }}
                                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                                >
                                    {isLoading ? <LoadingDots /> : 'Add Business'}
                                </motion.button>
                            </motion.form>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-gray-500 text-center mt-6"
                            >
                                We'll verify your business profile and get you set up quickly
                            </motion.p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddBusiness;