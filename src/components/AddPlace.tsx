"use client";

// Imports
import { motion, AnimatePresence } from "framer-motion";

// 
function AddPlace() {
    return (
        <AnimatePresence>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50 px-2 xs:px-0"></section>
        </AnimatePresence>
    )
}

export default AddPlace;