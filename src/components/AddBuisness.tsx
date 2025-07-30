'use client';

// Imports
import Image from "next/image";
import { X, Upload, Camera } from "lucide-react";
import { getUserLocation } from "@/app/providers/LocationProvider";
import { useEffect, useState, useRef } from "react";
import { selectedCountryDataPayload } from "@/app/providers/AreaSelectorProvider";

// Types
interface FormData {
    businessName: string;
    businessImage: File | null;
    country: selectedCountryDataPayload | null;
    city: string;
    completeAddress: string;
    ownerPhoneNumber: string;
    ownerWebsite: string;
    agreesToTerms: boolean;
}

// Components
function AddBuisness() {
    // Context States
    const { setIsAddBuisness } = getUserLocation();

    // States
    // Countries and Cities
    const [countries, setCountries] = useState<selectedCountryDataPayload[] | null>(null);
    const [isFetchingCountries, setIsFetchingCountries] = useState<boolean>(false);
    const [fetchingCountriesError, setFetchingCountriesError] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<selectedCountryDataPayload | null>(null);
    // 
    const [cities, setCities] = useState<string[] | null>(null);
    const [isFetchingCities, setIsFetchingCities] = useState<boolean>(false);
    const [FetchingCitiesError, setFetchingCitiesError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Form States
    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        businessImage: null,
        country: null,
        city: '',
        completeAddress: '',
        ownerPhoneNumber: '',
        ownerWebsite: '',
        agreesToTerms: false
    });

    // Image Preview State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Countries from public/data
    const fetchCountries = async () => {
        setIsFetchingCountries(true);
        setFetchingCountriesError(null);
        try {
            const response = await fetch("/data/countries.json");
            if (!response.ok) {
                setFetchingCountriesError("Error while loading countries.");
                throw new Error("Failed to fetch countries");
            }

            const data = await response.json();
            setCountries(data);
        } catch (error) {
            setFetchingCountriesError("Error while loading countries.");
            console.error("Failed to fetch countries.", error);
        } finally {
            setIsFetchingCountries(false);
        }
    };

    // Fetch Cities from backend(/api/geonames)
    const fetchCities = async () => {
        setIsFetchingCities(true);
        setFetchingCitiesError(null);
        if (!selectedCountry?.countryCode) {
            setIsFetchingCities(false);
            setFetchingCitiesError("No selected country found. Unexpected error.")
            return;
        }
        try {
            const response = await fetch(`/api/geonames/?countryCode=${selectedCountry.countryCode}`);
            if (!response.ok) {
                setFetchingCitiesError("Error while loading cities.");
                throw new Error("Failed to fetch cities.");
            }

            const data = await response.json();
            setCities(data);
        } catch (error) {
            setFetchingCitiesError("Error while loading cities.");
            console.error("Failed to fetch cities.", error);
        } finally {
            setIsFetchingCities(false);
        }
    };

    // Country Select Handler
    const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedCountry(selected);
        setFormData(prev => ({ ...prev, country: selected, city: '' }));
        setSelectedCity(null);
    }

    // City Select Handler
    const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityValue = e.target.value;
        setSelectedCity(cityValue);
        setFormData(prev => ({ ...prev, city: cityValue }));
    }

    // Image Upload Handlers
    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, businessImage: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // Form Input Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Form Submit Handler
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', {
            businessName: formData.businessName,
            businessImage: formData.businessImage,
            country: formData.country,
            city: formData.city,
            completeAddress: formData.completeAddress,
            ownerPhoneNumber: formData.ownerPhoneNumber,
            ownerWebsite: formData.ownerWebsite,
            agreesToTerms: formData.agreesToTerms
        });
    };

    // Effects
    useEffect(() => {
        if (!countries || countries.length > 0) {
            fetchCountries();
        }
    }, [])

    useEffect(() => {
        if (selectedCountry && selectedCountry?.countryCode) {
            fetchCities();
        }
    }, [selectedCountry])

    return (
        <>
            <section className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4">
                <dialog open
                    role="dialog"
                    aria-labelledby="add-business-dialog"
                    aria-modal="true"
                    className="relative w-full max-w-4xl max-h-[90vh] bg-background border-1 border-secondary rounded-xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6">
                        <Image
                            src='/main-logo.svg'
                            alt="BizRanker - Business Directory and Ranking Platform Logo"
                            width={150}
                            height={50}
                        />
                        <button
                            onClick={() => setIsAddBuisness(false)}
                            className="p-2 rounded-full border border-secondary hover:bg-primary transition-all duration-200 cursor-pointer"
                            aria-label="Close dialog"
                        >
                            <X className="w-6 h-6 text-secondary" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col items-center justify-center px-6 pb-6 max-h-[calc(90vh-100px)] overflow-y-auto">
                        <h2 className="text-primary text-2xl font-semibold mb-4">Add Your Buisness</h2>

                        <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-y-6">
                            <div className="w-full flex flex-row gap-x-6">

                                {/* Left - Image Upload */}
                                <div className="w-1/2 flex justify-center">
                                    <div className="relative">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                            aria-label="Upload business image"
                                        />
                                        <div
                                            onClick={handleImageClick}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`w-48 h-48 rounded-full border-2 border-dashed cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden ${isDragOver
                                                ? 'border-primary bg-primary/10'
                                                : 'border-secondary hover:border-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Business preview"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Camera className="w-8 h-8 text-secondary mx-auto mb-2" />
                                                    <p className="text-secondary text-sm font-medium">Upload Image</p>
                                                    <p className="text-primary text-xs mt-1">or drag and drop</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Basic Info */}
                                <div className="w-1/2 flex flex-col gap-y-4">
                                    {/* Business Name */}
                                    <div>
                                        <label className="sr-only" htmlFor="businessName">Business Name:</label>
                                        <input
                                            className="w-full border border-secondary text-secondary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all placeholder:text-primary"
                                            name="businessName"
                                            type="text"
                                            placeholder="Business name"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Country and City Selection */}
                                    <div className="flex flex-row gap-x-4">
                                        {/* Country Select */}
                                        <div className="w-1/2">
                                            <select
                                                className="w-full border border-secondary cursor-pointer text-white bg-secondary font-semibold rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                                onChange={handleCountrySelect}
                                                disabled={isFetchingCountries || !!fetchingCountriesError || !countries}
                                                required
                                            >
                                                <option hidden>
                                                    Select Country
                                                </option>

                                                {isFetchingCountries && (
                                                    <option className="text-white bg-secondary" hidden>Loading countries...</option>
                                                )}

                                                {fetchingCountriesError && (
                                                    <option className="text-red-500 bg-secondary" hidden>{fetchingCountriesError}</option>
                                                )}

                                                {countries && countries.length > 0 && countries.map((country, idx) => (
                                                    <option
                                                        key={idx}
                                                        value={JSON.stringify(country)}
                                                        className="font-[Poppins]"
                                                    >
                                                        {country.country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* City Select */}
                                        <div className="w-1/2">
                                            <select
                                                className="w-full border border-secondary cursor-pointer text-white bg-secondary font-semibold rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                                onChange={handleCitySelect}
                                                disabled={!selectedCountry || isFetchingCities || !!FetchingCitiesError}
                                                required
                                            >
                                                <option hidden>
                                                    Select City
                                                </option>

                                                {isFetchingCities && (
                                                    <option className="text-white bg-secondary" hidden>Loading cities...</option>
                                                )}

                                                {FetchingCitiesError && (
                                                    <option className="text-red-500 bg-secondary" hidden>{FetchingCitiesError}</option>
                                                )}

                                                {cities && cities.length > 0 && cities.map((city, idx) => (
                                                    <option
                                                        key={idx}
                                                        value={city}
                                                        className="font-[Poppins]"
                                                    >
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Fields */}
                            <div className="w-full flex flex-col gap-y-4">
                                {/* Complete Address */}
                                <div>
                                    <label className="block text-secondary font-medium mb-2" htmlFor="completeAddress">
                                        Business Complete Address
                                    </label>
                                    <textarea
                                        className="w-full border border-secondary text-secondary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all placeholder:text-primary resize-none"
                                        name="completeAddress"
                                        rows={3}
                                        placeholder="Enter complete business address"
                                        value={formData.completeAddress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Phone and Website */}
                                <div className="flex flex-row gap-x-4">
                                    {/* Owner Phone Number */}
                                    <div className="w-1/2">
                                        <label className="block text-secondary font-medium mb-2" htmlFor="ownerPhoneNumber">
                                            Owner Phone Number
                                        </label>
                                        <input
                                            className="w-full border border-secondary text-secondary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all placeholder:text-primary"
                                            name="ownerPhoneNumber"
                                            type="tel"
                                            placeholder="e.g. +1 234 567 8900"
                                            value={formData.ownerPhoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Owner Website */}
                                    <div className="w-1/2">
                                        <label className="block text-secondary font-medium mb-2" htmlFor="ownerWebsite">
                                            Owner Provided Website
                                        </label>
                                        <input
                                            className="w-full border border-secondary text-secondary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all placeholder:text-primary"
                                            name="ownerWebsite"
                                            type="url"
                                            placeholder="https://www.example.com"
                                            value={formData.ownerWebsite}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* Agreement Checkbox */}
                                <div className="flex items-start gap-x-3 mt-4">
                                    <input
                                        type="checkbox"
                                        name="agreesToTerms"
                                        className="mt-1 w-4 h-4 text-secondary border-secondary rounded focus:ring-primary focus:ring-2"
                                        checked={formData.agreesToTerms}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label className="text-secondary text-sm leading-relaxed">
                                        I agree that all the data provided matches the existing Google Business profile
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer bg-secondary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-6"
                                >
                                    Add Business
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </section>
        </>
    )
}

export default AddBuisness;