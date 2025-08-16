"use client";

// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { useSession } from "next-auth/react";
import { MapPin, Phone, Clock, Globe, Star, UtensilsCrossed, Package, Truck, Car, ArrowLeft } from "lucide-react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import LoadingDots from "./LoadingDots";
import { toast } from "react-toastify";

// 
function AddPlace() {
    // Session Context
    const { data: session, status } = useSession();
    // Context
    const { setIsAddPlace, userLocation, selectedCategory } = getGlobalProvider();
    // Refs
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    // States
    const [suggestedProfiles, setSuggestedProfiles] = useState<any[] | null>(null);
    const [formData, setFormData] = useState({
        placeDescription: "",
        placeId: "",
    });
    const [placeDetails, setPlaceDetails] = useState<any | null>(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    // Fetch Places Suggestions
    const fetchPlacesSuggestion = async (name: string, value: string) => {
        if (name === 'placeDescription' && value.length > 3 && userLocation.lat && userLocation.lng && status === 'authenticated') {
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
                setIsLoadingSuggestions(false);
            }
        } else if (value.length <= 3) {
            setSuggestedProfiles(null);
            setIsLoadingSuggestions(false);
        } else {
            setIsLoadingSuggestions(false);
        }
    };
    // Calls after 500ms of idle on input
    const debouncedFetchPlacesSuggestion = (name: string, value: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (value.length > 3) {
            setIsLoadingSuggestions(true);
            debounceTimerRef.current = setTimeout(() => {
                fetchPlacesSuggestion(name, value);
            }, 500);
        } else {
            setIsLoadingSuggestions(false);
            setSuggestedProfiles(null);
        }
    };
    // Handle Change
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            setIsLoadingSuggestions(false);
            setShowConfirmation(true);
            fetchPlaceDetails(profile.place_id);
        }
    };
    // Fetch place details by ID
    const fetchPlaceDetails = async (profileId: string) => {
        if (status === 'authenticated') {
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
                setIsLoadingDetails(false);
                setShowConfirmation(false);
            } finally {
                setIsLoadingDetails(false);
            }
        }
    };
    // Handle confirmation
    const handleConfirmPlace = async () => {
        setIsConfirming(true);
        try {
            const res = await fetch(`/api/addPlace`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeDetails,
                    category: selectedCategory,
                }),
            });
            if (!res.ok) {
                const errData = (await res.json()) as FailedApiResponse;
                goBackToSearch();
                toast.error(errData.error);
                throw new Error(`Error while confirmingPlace ${errData.error}`)
            }

            const data = (await res.json()) as SuccessApiResponse;
            toast.success(data.message);
            closeModal();
        } catch (err) {
            toast.error("Failed to add place.");
            console.error("Failed to confirm place:", err);
            goBackToSearch();
        } finally {
            setIsConfirming(false);
        }
    };
    // Go back to search
    const goBackToSearch = () => {
        setShowConfirmation(false);
        setPlaceDetails(null);
        setIsLoadingDetails(false);
        setFormData({
            placeDescription: "",
            placeId: ""
        });
    };
    // Close modal
    const closeModal = () => {
        setIsAddPlace(false);
        setSuggestedProfiles(null);
        setIsLoadingSuggestions(false);
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
                className="overflow-y-hidden fixed inset-0 w-full h-full flex justify-center items-center bg-black/30 backdrop-blur-sm z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="relative w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl overflow-y-visible"
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
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-secondary/10 transition-colors duration-200 cursor-pointer"
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
                                    onChange={handleSearchInput}
                                    className="w-full border-2 border-gray-400 text-gray-700 outline-none rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400 shadow-sm"
                                    placeholder="Enter a place name..."
                                    autoComplete="off"
                                />

                                {/* Suggestions Dropdown */}
                                {(isLoadingSuggestions || (suggestedProfiles && suggestedProfiles.length > 0)) && (
                                    <motion.div
                                        className="absolute top-full left-4 sm:left-6 right-4 sm:right-6 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {isLoadingSuggestions && (
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
                                        {!isLoadingSuggestions && suggestedProfiles && suggestedProfiles.length === 0 && (
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
                                        : isLoadingSuggestions
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
                                    <ArrowLeft className="w-6 h-6 text-secondary" />
                                </button>

                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 px-12 text-center">
                                    Confirm to Add This Place
                                </h2>
                                <p className="text-sm text-primary font-semibold mt-1 text-center">
                                    Review and confirm to add this Place to {selectedCategory} Category.
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
                                        {/* Main Place Info */}
                                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                                            <h3 className="font-bold text-xl text-gray-800 mb-2">
                                                {placeDetails.name || formData.placeDescription.split(',')[0]?.trim()}
                                            </h3>

                                            {/* Address Information */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-start">
                                                    <MapPin className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-gray-700 text-sm font-medium">
                                                            {placeDetails.formatted_address || formData.placeDescription}
                                                        </p>
                                                        {/* City and Country */}
                                                        {placeDetails.address_components && (
                                                            <div className="mt-1">
                                                                {(() => {
                                                                    const city = placeDetails.address_components.find(comp =>
                                                                        comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
                                                                    )?.long_name;
                                                                    const country = placeDetails.address_components.find(comp =>
                                                                        comp.types.includes('country')
                                                                    )?.long_name;

                                                                    return (
                                                                        <p className="text-primary text-xs font-semibold">
                                                                            {city && country ? `${city}, ${country}` : city || country || ''}
                                                                        </p>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating and Reviews */}
                                            {placeDetails.rating && (
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                                            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                                                            <span className="font-bold text-gray-700">{placeDetails.rating}</span>
                                                        </div>
                                                        {placeDetails.user_ratings_total && (
                                                            <span className="text-gray-600 text-sm ml-2">
                                                                ({placeDetails.user_ratings_total} reviews)
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Business Status */}
                                                    {placeDetails.business_status && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${placeDetails.business_status === 'OPERATIONAL'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {placeDetails.business_status.toLowerCase().replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Place Types */}
                                            {placeDetails.types && placeDetails.types.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {placeDetails.types.slice(0, 4).map((type, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-white/70 text-primary text-xs rounded-full capitalize border border-primary/30"
                                                        >
                                                            {type.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Information */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-primary" />
                                                Contact Information
                                            </h4>

                                            <div className="space-y-3">
                                                {/* Phone Number */}
                                                {(placeDetails.formatted_phone_number || placeDetails.international_phone_number) && (
                                                    <div className="flex items-center">
                                                        <Phone className="w-4 h-4 text-gray-500 mr-3" />
                                                        <div>
                                                            <p className="text-gray-800 font-medium text-sm">
                                                                {placeDetails.formatted_phone_number || placeDetails.international_phone_number}
                                                            </p>
                                                            <p className="text-gray-500 text-xs">Phone</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Website */}
                                                {placeDetails.website && (
                                                    <div className="flex items-center">
                                                        <Globe className="w-4 h-4 text-gray-500 mr-3" />
                                                        <div>
                                                            <a
                                                                href={placeDetails.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline font-medium text-sm"
                                                            >
                                                                Visit website
                                                            </a>
                                                            <p className="text-gray-500 text-xs">Website</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Services Available */}
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {placeDetails.dine_in && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                                                            <UtensilsCrossed className="w-3 h-3 mr-1" />
                                                            Dine-in
                                                        </span>
                                                    )}
                                                    {placeDetails.takeout && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                                                            <Package className="w-3 h-3 mr-1" />
                                                            Takeout
                                                        </span>
                                                    )}
                                                    {placeDetails.delivery && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                                                            <Truck className="w-3 h-3 mr-1" />
                                                            Delivery
                                                        </span>
                                                    )}
                                                    {placeDetails.curbside_pickup && (
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center">
                                                            <Car className="w-3 h-3 mr-1" />
                                                            Curbside pickup
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

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

                            {/* Footer with Add Place Button */}
                            {placeDetails && !isLoadingDetails && (
                                <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                                    <button
                                        onClick={handleConfirmPlace}
                                        disabled={isConfirming}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isConfirming ? (
                                            <div className="flex items-center justify-center">
                                                <LoadingDots className="w-6 h-6" />
                                            </div>
                                        ) : (
                                            'Add This Place'
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