// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 
function AddCategory() {
    // Context
    const { setIsAddBusiness } = getGlobalProvider();

    return (
        <AnimatePresence>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50 px-2 xs:px-0">
                <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 80 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex items-center justify-center w-full max-w-xl bg-background rounded-lg shadow-2xl overflow-hidden text-center px-2 xs:px-4 py-4 xs:py-6"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsAddBusiness(false)}
                        className="absolute top-2 xs:top-4 right-2 xs:right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-secondary/10 transition-colors cursor-pointer shadow-lg"
                    >
                        <X className="w-6 h-6 xs:w-7 xs:h-7" style={{ color: '#273f4f' }} />
                    </button>

                    <div className="flex flex-col gap-y-3 xs:gap-y-4 w-full">
                        <motion.h2
                            className="text-xl xs:text-2xl font-bold text-secondary"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                        >
                            Add A Custom Collection
                        </motion.h2>

                        <motion.div
                            className="flex flex-col gap-y-1 xs:gap-y-2"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                        >
                            <motion.label
                                htmlFor="addCategory"
                                className="text-left text-primary font-semibold text-sm xs:text-base"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                Category :
                            </motion.label>
                            <motion.input
                                type="search"
                                name="addCategory"
                                className="border-2 border-gray-400 outline-none rounded-lg px-2 py-2 xs:py-3 focus:border-primary transition-all text-xs xs:text-base"
                                placeholder="e.g (World best pizza , shawarma)"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                            />
                        </motion.div>

                        <motion.button
                            type="button"
                            className="text-white cursor-pointer bg-primary border border-primary rounded-lg py-2 xs:py-3 text-sm xs:text-base hover:bg-secondary hover:text-primary transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.3 }}
                        >
                            Add Category
                        </motion.button>
                    </div>
                </motion.div>
            </section>
        </AnimatePresence>
    );
}

export default AddCategory;