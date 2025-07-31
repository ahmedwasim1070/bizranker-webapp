'use client';

// Imports
import Image from "next/image";
import { X, Camera, AlertCircle } from "lucide-react";
import { getUserLocation } from "@/app/providers/LocationProvider";
import { useEffect, useState, useRef } from "react";
import { selectedCountryDataPayload } from "@/app/providers/AreaSelectorProvider";

// Types
interface FormData {
    businessName: string;
    businessImage: File | null;
    country: selectedCountryDataPayload | null;
    city: string;
    googleBusinessLink: string;
    ownerPhoneNumber: string;
    ownerWebsite: string;
    agreesToTerms: boolean;
}
interface ValidationErrors {
    businessName?: string;
    businessImage?: string;
    country?: string;
    city?: string;
    googleBusinessLink?: string;
    ownerPhoneNumber?: string;
    ownerWebsite?: string;
    agreesToTerms?: string;
}

// Components
function AddBuisnessManually() {
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
        googleBusinessLink: '',
        ownerPhoneNumber: '',
        ownerWebsite: '',
        agreesToTerms: false
    });

    // Validation States
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Image Preview State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation Functions
    const validateBusinessName = (name: string): string | null => {
        if (!name.trim()) return 'Business name is required';
        if (name.trim().length < 3) return 'Business name must be at least 3 characters long';
        if (name.trim().length > 100) return 'Business name cannot exceed 100 characters';
        return null;
    };

    const validateImageSize = (file: File): string | null => {
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            return `Image size must be less than ${maxSizeInMB}MB`;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Image must be in JPEG, PNG, or WebP format';
        }

        return null;
    };

    const validateGoogleBusinessLink = (link: string): string | null => {
        if (!link.trim()) return 'Google Business profile link is required';

        // Google Business profile URL patterns
        const googleBusinessPatterns = [
            /^https:\/\/www\.google\.com\/maps\/place\/.+/,
            /^https:\/\/maps\.google\.com\/.+/,
            /^https:\/\/goo\.gl\/maps\/.+/,
            /^https:\/\/maps\.app\.goo\.gl\/.+/,
            /^https:\/\/business\.google\.com\/.+/
        ];

        const isValidGoogleLink = googleBusinessPatterns.some(pattern => pattern.test(link));

        if (!isValidGoogleLink) {
            return 'Please provide a valid Google Business profile or Google Maps link';
        }

        return null;
    };

    const validatePhoneNumber = (phone: string): string | null => {
        if (!phone.trim()) return null; // Optional field

        // Basic phone number validation (supports international formats)
        const phonePattern = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;

        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            return 'Please provide a valid phone number';
        }

        return null;
    };

    const validateWebsiteURL = (url: string): string | null => {
        if (!url.trim()) return null; // Optional field

        try {
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return 'Website URL must start with http:// or https://';
            }
            return null;
        } catch {
            return 'Please provide a valid website URL';
        }
    };

    const validateCountryAndCity = (): { country?: string; city?: string } => {
        const errors: { country?: string; city?: string } = {};

        if (!formData.country) {
            errors.country = 'Please select a country';
        }

        if (!formData.city) {
            errors.city = 'Please select a city';
        } else if (cities && !cities.includes(formData.city)) {
            errors.city = 'Selected city is not valid for the chosen country';
        }

        return errors;
    };

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
        // Clear validation errors
        setValidationErrors(prev => ({ ...prev, country: undefined, city: undefined }));
    }

    // City Select Handler
    const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityValue = e.target.value;
        setSelectedCity(cityValue);
        setFormData(prev => ({ ...prev, city: cityValue }));
        // Clear validation error
        setValidationErrors(prev => ({ ...prev, city: undefined }));
    }

    // Image Upload Handlers
    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const imageError = validateImageSize(file);
            if (imageError) {
                setValidationErrors(prev => ({ ...prev, businessImage: imageError }));
                return;
            }

            setFormData(prev => ({ ...prev, businessImage: file }));
            setValidationErrors(prev => ({ ...prev, businessImage: undefined }));

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
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Form Submit Handler
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate all fields
        const errors: ValidationErrors = {};

        // Business name validation
        const nameError = validateBusinessName(formData.businessName);
        if (nameError) errors.businessName = nameError;

        // Image validation (optional but if provided, must be valid)
        if (formData.businessImage) {
            const imageError = validateImageSize(formData.businessImage);
            if (imageError) errors.businessImage = imageError;
        }

        // Google business link validation
        const googleLinkError = validateGoogleBusinessLink(formData.googleBusinessLink);
        if (googleLinkError) errors.googleBusinessLink = googleLinkError;

        // Phone number validation (optional)
        const phoneError = validatePhoneNumber(formData.ownerPhoneNumber);
        if (phoneError) errors.ownerPhoneNumber = phoneError;

        // Website URL validation (optional)
        const websiteError = validateWebsiteURL(formData.ownerWebsite);
        if (websiteError) errors.ownerWebsite = websiteError;

        // Country and city validation
        const locationErrors = validateCountryAndCity();
        Object.assign(errors, locationErrors);

        // Agreement validation
        if (!formData.agreesToTerms) {
            errors.agreesToTerms = 'You must agree to the terms';
        }

        setValidationErrors(errors);

        // If there are errors, don't submit
        if (Object.keys(errors).length > 0) {
            setIsSubmitting(false);
            return;
        }

        // All validations passed - submit the form
        console.log('Form Data Submitted:', {
            businessName: formData.businessName,
            businessImage: formData.businessImage,
            country: formData.country,
            city: formData.city,
            googleBusinessLink: formData.googleBusinessLink,
            ownerPhoneNumber: formData.ownerPhoneNumber || 'Not provided',
            ownerWebsite: formData.ownerWebsite || 'Not provided',
            agreesToTerms: formData.agreesToTerms
        });

        setIsSubmitting(false);
        // Here you would typically make an API call to submit the data
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
            <section className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-2 sm:p-4">
                <dialog open
                    role="dialog"
                    aria-labelledby="add-business-dialog"
                    aria-modal="true"
                    className="relative w-full max-w-6xl max-h-[95vh] bg-background border-1 border-secondary rounded-xl shadow-2xl overflow-y-scroll flex flex-col">

                    <div className=" bg-background border-b border-secondary/20 flex items-center justify-between p-4 sm:p-6">
                        <Image
                            src='/main-logo.svg'
                            alt="BizRanker - Business Directory and Ranking Platform Logo"
                            width={120}
                            height={40}
                            className="sm:w-[150px] sm:h-[50px]"
                        />
                        <button
                            onClick={() => setIsAddBuisness(false)}
                            className="p-2 rounded-full border border-secondary hover:bg-primary transition-all duration-200 cursor-pointer"
                            aria-label="Close dialog"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col items-center justify-center px-4  py-4 sm:px-6 pb-4 sm:pb-6 flex-1 overflow-y-visible">
                        <h2 className="text-primary text-xl sm:text-2xl font-semibold my-4 text-center">Add Your Buisness</h2>

                        <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-y-4 my-4 sm:gap-y-6">
                            <div className="w-full flex flex-col lg:flex-row gap-y-4 lg:gap-x-6">

                                {/* Left - Image Upload */}
                                <div className="w-full lg:w-1/2 flex flex-col items-center">
                                    <div className="relative mb-3">
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
                                            className={`w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden ${isDragOver
                                                ? 'border-primary bg-primary/10'
                                                : validationErrors.businessImage
                                                    ? 'border-red-500 hover:border-red-400'
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
                                                <div className="text-center p-2 sm:p-4">
                                                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mx-auto mb-2" />
                                                    <p className="text-secondary text-xs sm:text-sm font-medium">Upload Image</p>
                                                    <p className="text-primary text-xs mt-1">or drag and drop</p>
                                                </div>
                                            )}
                                        </div>
                                        {validationErrors.businessImage && (
                                            <div className="flex items-center gap-1 mt-2 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{validationErrors.businessImage}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Guidelines */}
                                    <div className="text-center text-xs sm:text-sm text-primary max-w-xs">
                                        <p className="mb-2 font-medium">Image Guidelines (Optional):</p>
                                        <p className="leading-relaxed">
                                            Images should be the logo or profile picture from your Google Business profile.
                                            If using a logo, ensure it matches other social media profiles.
                                        </p>
                                    </div>
                                </div>

                                {/* Right - Basic Info */}
                                <div className="w-full lg:w-1/2 flex flex-col gap-y-4">
                                    {/* Business Name */}
                                    <div>
                                        <label className="sr-only" htmlFor="businessName">Business Name:</label>
                                        <input
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-all placeholder:text-primary ${validationErrors.businessName
                                                ? 'border-red-500 text-red-700 focus:ring-red-500'
                                                : 'border-secondary text-secondary focus:ring-secondary'
                                                }`}
                                            name="businessName"
                                            type="text"
                                            placeholder="Business name *"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.businessName && (
                                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{validationErrors.businessName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Country and City Selection */}
                                    <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4">
                                        {/* Country Select */}
                                        <div className="w-full sm:w-1/2">
                                            <select
                                                className={`w-full border cursor-pointer text-white bg-secondary font-semibold rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 transition-all ${validationErrors.country
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-secondary focus:ring-primary'
                                                    }`}
                                                onChange={handleCountrySelect}
                                                disabled={isFetchingCountries || !!fetchingCountriesError || !countries}
                                            >
                                                <option hidden>
                                                    Select Country *
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
                                            {validationErrors.country && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{validationErrors.country}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* City Select */}
                                        <div className="w-full sm:w-1/2">
                                            <select
                                                className={`w-full border cursor-pointer text-white bg-secondary font-semibold rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 transition-all ${validationErrors.city
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-secondary focus:ring-primary'
                                                    }`}
                                                onChange={handleCitySelect}
                                                disabled={!selectedCountry || isFetchingCities || !!FetchingCitiesError}
                                            >
                                                <option hidden>
                                                    Select City *
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
                                            {validationErrors.city && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{validationErrors.city}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Fields */}
                            <div className="w-full flex flex-col gap-y-4">
                                {/* Google Business Profile Link */}
                                <div>
                                    <label className="block text-secondary font-medium mb-2" htmlFor="googleBusinessLink">
                                        Google Business Profile Link or Address Link *
                                    </label>
                                    <input
                                        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-all placeholder:text-primary ${validationErrors.googleBusinessLink
                                            ? 'border-red-500 text-red-700 focus:ring-red-500'
                                            : 'border-secondary text-secondary focus:ring-secondary'
                                            }`}
                                        name="googleBusinessLink"
                                        type="url"
                                        placeholder="https://www.google.com/maps/place/your-business"
                                        value={formData.googleBusinessLink}
                                        onChange={handleInputChange}
                                    />
                                    {validationErrors.googleBusinessLink && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{validationErrors.googleBusinessLink}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Phone and Website */}
                                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4">
                                    {/* Owner Phone Number (Optional) */}
                                    <div className="w-full sm:w-1/2">
                                        <label className="block text-secondary font-medium mb-2" htmlFor="ownerPhoneNumber">
                                            Owner Phone Number (Optional)
                                        </label>
                                        <input
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-all placeholder:text-primary ${validationErrors.ownerPhoneNumber
                                                ? 'border-red-500 text-red-700 focus:ring-red-500'
                                                : 'border-secondary text-secondary focus:ring-secondary'
                                                }`}
                                            name="ownerPhoneNumber"
                                            type="tel"
                                            placeholder="e.g. +1 234 567 8900"
                                            value={formData.ownerPhoneNumber}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.ownerPhoneNumber && (
                                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{validationErrors.ownerPhoneNumber}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Owner Website (Optional) */}
                                    <div className="w-full sm:w-1/2">
                                        <label className="block text-secondary font-medium mb-2" htmlFor="ownerWebsite">
                                            Owner Provided Website (Optional)
                                        </label>
                                        <input
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-all placeholder:text-primary ${validationErrors.ownerWebsite
                                                ? 'border-red-500 text-red-700 focus:ring-red-500'
                                                : 'border-secondary text-secondary focus:ring-secondary'
                                                }`}
                                            name="ownerWebsite"
                                            type="url"
                                            placeholder="https://www.example.com"
                                            value={formData.ownerWebsite}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.ownerWebsite && (
                                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{validationErrors.ownerWebsite}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Agreement Checkbox */}
                                <div className="flex items-start gap-x-3 mt-4">
                                    <input
                                        type="checkbox"
                                        name="agreesToTerms"
                                        className={`mt-1 w-4 h-4 rounded focus:ring-2 ${validationErrors.agreesToTerms
                                            ? 'text-red-500 border-red-500 focus:ring-red-500'
                                            : 'text-secondary border-secondary focus:ring-primary'
                                            }`}
                                        checked={formData.agreesToTerms}
                                        onChange={handleInputChange}
                                    />
                                    <label className="text-secondary text-sm leading-relaxed">
                                        I agree that all the data provided matches the existing Google Business profile *
                                    </label>
                                </div>
                                {validationErrors.agreesToTerms && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{validationErrors.agreesToTerms}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Adding Business...' : 'Add Business'}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </section>
        </>
    )
}

export default AddBuisnessManually;