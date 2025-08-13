"use client";

// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import LoadingDots from "./LoadingDots";

// 
function AddPlace() {
    // Session Context
    const { data: session, status } = useSession();
    // Context
    const { setIsAddPlace, userLocation } = getGlobalProvider();
    // Refs
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    // States
    const [suggestedProfiles, setSuggestedProfiles] = useState<any[] | null>(null);
    const [formData, setFormData] = useState({
        placeDescription: "",
        placeId: "",
    });
    const [errorForm, setErrorForm] = useState({
        userEnteredPlace: false,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // States for confirmation screen
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [placeDetails, setPlaceDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    // Fetch place details by ID
    const fetchPlaceDetails = async (profileId: string) => {
        setIsLoadingDetails(true);
        try {
            const res = await fetch(`/api/fetchProfileById/?profileId=${profileId}`);
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                throw new Error(`Error: ${errData.error}`);
            }

            const data = (await res.json()) as SuccessApiResponse;
            setPlaceDetails(data.data);
        } catch (err) {
            console.error("Failed to fetch place details: ", err);
            setShowConfirmation(false);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Handle confirmation
    const handleConfirmPlace = async () => {
        setIsConfirming(true);
        try {
            console.log("Confirming place:", placeDetails);
            setTimeout(() => {
                closeModal();
            }, 1000);
        } catch (err) {
            console.error("Failed to confirm place:", err);
        } finally {
            setIsConfirming(false);
        }
    };

    // Go back to search
    const goBackToSearch = () => {
        setShowConfirmation(false);
        setPlaceDetails(null);
        setIsLoadingDetails(false);
    };

    // Fetch Places Suggestions
    const fetchPlacesSuggestion = async (name: string, value: string) => {
        if (name === 'placeDescription' && value.length > 3 && userLocation.lat && userLocation.lng) {
            try {
                const res = await fetch(`/api/fetchPlacesSuggestion/?lat=${userLocation.lat}&lng=${userLocation.lng}&userKeyStrokes=${value}`)
                if (!res.ok) {
                    const errData = (await res.json()) as FailedApiResponse;
                    throw new Error(`Error , ${errData.error}`);
                }

                const data = (await res.json()) as SuccessApiResponse;
                const suggestions = data.data;

                setSuggestedProfiles(suggestions);
            } catch (err) {
                console.error("Failed to fetchPlacesSuggestion : ", err);
                setSuggestedProfiles(null);
            } finally {
                setIsLoading(false);
            }
        } else if (value.length <= 3) {
            setSuggestedProfiles(null);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    // Calls after 500ms of idle on input
    const debouncedFetchPlacesSuggestion = (name: string, value: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (value.length > 3) {
            setIsLoading(true);
            debounceTimerRef.current = setTimeout(() => {
                fetchPlacesSuggestion(name, value);
            }, 500);
        } else {
            setIsLoading(false);
            setSuggestedProfiles(null);
        }
    };

    // Handle Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        debouncedFetchPlacesSuggestion(name, value);
    };

    // Handle place selection
    const handlePlaceSelect = (profile: any) => {
        if (profile.description && profile.place_id) {
            setFormData({
                ...formData,
                placeDescription: profile.description,
                placeId: profile.place_id
            });
            setSuggestedProfiles(null);
            setIsLoading(false);
            setShowConfirmation(true);
            fetchPlaceDetails(profile.place_id);
        }
    };

    // Close modal
    const closeModal = () => {
        setIsAddPlace(false);
        setSuggestedProfiles(null);
        setIsLoading(false);
        setShowConfirmation(false);
        setPlaceDetails(null);
        setIsLoadingDetails(false);
        setIsConfirming(false);
        setFormData({
            placeDescription: "",
            placeId: ""
        });
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.section
                className="fixed inset-0 w-full h-full flex justify-center items-center bg-black/30 backdrop-blur-sm z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="relative w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    {!showConfirmation ? (
                        // Search Screen
                        <motion.div
                            key="search"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex flex-col"
                        >
                            {/* Header */}
                            <div className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-secondary/10 transition-colors duration-200"
                                >
                                    <X className="w-6 h-6 text-secondary" />
                                </button>

                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-12">
                                    Search Places
                                </h2>
                                <p className="text-sm text-primary font-semibold mt-1">
                                    Find and select a relevant place.
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="px-4 sm:px-6 py-4 relative">
                                <input
                                    type="search"
                                    name="placeDescription"
                                    value={formData.placeDescription}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-400 text-gray-700 outline-none rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400 shadow-sm"
                                    placeholder="Enter a place name..."
                                    autoComplete="off"
                                />

                                {/* Suggestions Dropdown */}
                                {(isLoading || (suggestedProfiles && suggestedProfiles.length > 0)) && (
                                    <motion.div
                                        className="absolute top-full left-4 sm:left-6 right-4 sm:right-6 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {isLoading && (
                                            <div className="p-4 flex justify-center">
                                                <LoadingDots className="w-full" />
                                            </div>
                                        )}

                                        {suggestedProfiles && suggestedProfiles.length > 0 && (
                                            <div className="py-2">
                                                {suggestedProfiles.map((profile, idx) => {
                                                    const profileContent = profile.description.split(',');
                                                    const mainLocation = profileContent[0]?.trim();
                                                    const subLocation = profileContent.slice(1).join(',').trim();

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handlePlaceSelect(profile)}
                                                            className="w-full px-4 py-3 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 text-left border-b border-gray-50 last:border-b-0 focus:outline-none focus:bg-primary/5 group"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-800 text-sm sm:text-base group-hover:text-primary transition-colors">
                                                                    {mainLocation}
                                                                </span>
                                                                {subLocation && (
                                                                    <span className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                                                        {subLocation}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* No results found */}
                                        {!isLoading && suggestedProfiles && suggestedProfiles.length === 0 && (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                No places found. Try a different search term.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 sm:px-6 py-4 bg-gray-50 rounded-b-xl">
                                <p className="text-xs text-gray-400 text-center">
                                    {formData.placeDescription.length <= 3
                                        ? "Start typing to see suggestions"
                                        : isLoading
                                            ? "Searching..."
                                            : "Select a place from above"
                                    }
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        // Confirmation Screen
                        <motion.div
                            key="confirmation"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex flex-col"
                        >
                            {/* Header */}
                            <div className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-secondary/10 transition-colors duration-200"
                                >
                                    <X className="w-6 h-6 text-secondary" />
                                </button>

                                <button
                                    onClick={goBackToSearch}
                                    className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-secondary/10 transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 px-12 text-center">
                                    Confirm Place
                                </h2>
                                <p className="text-sm text-primary font-semibold mt-1 text-center">
                                    Review and confirm your selection
                                </p>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-4 sm:px-6 py-4 max-h-96 overflow-y-auto">
                                {isLoadingDetails ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <LoadingDots className="mb-4" />
                                        <p className="text-gray-500 text-sm">Loading place details...</p>
                                    </div>
                                ) : placeDetails ? (
                                    <div className="space-y-6">
                                        {/* Place Info */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                                {placeDetails.name || formData.placeDescription.split(',')[0]?.trim()}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {placeDetails.formatted_address || formData.placeDescription}
                                            </p>

                                            {placeDetails.rating && (
                                                <div className="flex items-center mb-2">
                                                    <span className="text-yellow-500 mr-1">★</span>
                                                    <span className="font-medium text-gray-700">{placeDetails.rating}</span>
                                                    {placeDetails.user_ratings_total && (
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            ({placeDetails.user_ratings_total} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {placeDetails.types && placeDetails.types.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {placeDetails.types.slice(0, 3).map((type: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize"
                                                        >
                                                            {type.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional Details */}
                                        {(placeDetails.opening_hours || placeDetails.phone || placeDetails.website) && (
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-800">Details</h4>

                                                {placeDetails.opening_hours?.open_now !== undefined && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600 text-sm w-20">Status:</span>
                                                        <span className={`text-sm font-medium ${placeDetails.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                                                            {placeDetails.opening_hours.open_now ? 'Open now' : 'Closed'}
                                                        </span>
                                                    </div>
                                                )}

                                                {placeDetails.phone && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600 text-sm w-20">Phone:</span>
                                                        <span className="text-sm text-gray-800">{placeDetails.phone}</span>
                                                    </div>
                                                )}

                                                {placeDetails.website && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600 text-sm w-20">Website:</span>
                                                        <a
                                                            href={placeDetails.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            Visit website
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <p className="text-gray-500 text-sm text-center">
                                            Failed to load place details. Please try again.
                                        </p>
                                        <button
                                            onClick={goBackToSearch}
                                            className="mt-3 text-primary hover:underline text-sm"
                                        >
                                            Go back to search
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer with Confirm Button */}
                            {placeDetails && !isLoadingDetails && (
                                <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                                    <button
                                        onClick={handleConfirmPlace}
                                        disabled={isConfirming}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isConfirming ? (
                                            <div className="flex items-center justify-center">
                                                <LoadingDots className="w-6 h-6 mr-2" />
                                                Confirming...
                                            </div>
                                        ) : (
                                            'Confirm This Place'
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>
        </AnimatePresence>
    )
}

export default AddPlace;