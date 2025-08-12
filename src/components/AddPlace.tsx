"use client";

// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

// 
function AddPlace() {
    // Session Context
    const { data: session, status } = useSession();
    // Context
    const { setIsAddPlace } = getGlobalProvider();
    // States
    const [formData, setFormData] = useState({
        userEnteredPlace: "",
    });
    const [errorForm, setErrorForm] = useState({
        userEnteredPlace: false,
    })

    // Fetch Places Suggestions
    const fetchPlacesSuggestion = () => {
    };
    // Handle Change
    const handleChange = (e: React.ChangeEvent) => {
    };

    return (
        <AnimatePresence>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50 px-2 xs:px-0">
                <div className="relative flex flex-col items-center justify-center gap-y-4 w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden text-center px-2 xs:px-4 py-4 xs:py-6">

                    {/* Close Button */}
                    <button
                        onClick={() => setIsAddPlace(false)}
                        className="absolute top-2 xs:top-4 right-2 xs:right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-secondary/10 transition-colors cursor-pointer shadow-lg"
                    >
                        <X className="w-6 h-6 xs:w-7 xs:h-7" style={{ color: '#273f4f' }} />
                    </button>

                    {/* Heading */}
                    <h2 className="text-xl xs:text-2xl font-bold text-secondary">
                        Search the Place
                    </h2>

                    <input
                        type="search"
                        name="userEnteredPlace"
                        onChange={handleChange}
                        className="min-w-full border-3 border-gray-400 text-secondary outline-none rounded-lg px-2 py-2 focus:border-primary transition-all"
                        placeholder="Search any Place"
                    />
                </div>
            </section>
        </AnimatePresence>
    )
}

export default AddPlace;