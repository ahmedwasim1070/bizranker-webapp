"use client";

// Imports
import { useState } from "react";
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { rankingPhrases } from "@/lib/constants/rankingPhrases";

// 
function AddCategory() {
    // Context
    const { setIsAddBusiness } = getGlobalProvider();
    // States
    const [formValues, setFormValues] = useState({
        categoryPhrase: "",
        categoryKeyword: "",
    })
    const [formErrors, setFormErrors] = useState({
        categoryPhrase: false,
        categoryKeyword: false,
    })
    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

    // Handle Submit 
    const handleSubmit = () => {
        const isError = validateForm();
        if (!isError) {

        }
        setDisableSubmit(true);
    }
    // Validates Form values
    const validateForm = () => {
        if (!rankingPhrases.includes(formValues.categoryPhrase)) {
            setFormErrors({ ...formErrors, categoryPhrase: true });
            return true;
        }
        if (!/^[A-Za-z\s]+$/.test(formValues.categoryKeyword.trim()) && formValues.categoryKeyword.length > 20) {
            setFormErrors({ ...formErrors, categoryKeyword: true });
            return true;
        }
        return false;
    }
    // Handle Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormErrors({ ...formErrors, [name]: false });
        setFormValues({ ...formValues, [name]: value });
        setDisableSubmit(false);
    }

    return (
        <AnimatePresence>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50 px-2 xs:px-0">
                <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 80 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex flex-col items-center justify-center gap-y-4 w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden text-center px-2 xs:px-4 py-4 xs:py-6"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsAddBusiness(false)}
                        className="absolute top-2 xs:top-4 right-2 xs:right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-secondary/10 transition-colors cursor-pointer shadow-lg"
                    >
                        <X className="w-6 h-6 xs:w-7 xs:h-7" style={{ color: '#273f4f' }} />
                    </button>

                    <form className="flex flex-col justify-center items-center gap-y-3 xs:gap-y-4 w-full">
                        <motion.h2
                            className="text-xl xs:text-2xl font-bold text-secondary"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                        >
                            Add A Custom Category
                        </motion.h2>

                        <motion.div
                            className="flex flex-col gap-y-1 xs:gap-y-2 my-2"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                        >
                            <div className="w-full flex flex-row items-center gap-x-2 bg-background p-2 rounded-lg transition-all">
                                {/*  */}
                                <div className="w-1/2 flex flex-col">
                                    <motion.label
                                        htmlFor="categoryPhrase"
                                        className="text-left text-primary font-semibold text-sm xs:text-base"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        Phrase :
                                    </motion.label>
                                    <select required name="categoryPhrase" onChange={handleChange} className="min-w-full text-primary outline-none p-2 bg-background font-semibold cursor-pointer rounded-lg border-3 border-gray-400 focus:border-primary">
                                        {formValues.categoryPhrase === "" &&
                                            <option hidden>
                                                Select Phrase
                                            </option>
                                        }
                                        {rankingPhrases.map((phrase, idx) => (
                                            <option value={phrase} className="text-secondary" key={idx}>
                                                {phrase}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.categoryPhrase && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.3 }}
                                            className="text-left text-red-500">
                                            Invalid Phrase
                                        </motion.p>
                                    )}
                                </div>

                                {/*  */}
                                <div className="w-1/2 flex flex-col">
                                    <motion.label
                                        htmlFor="categoryKeyword"
                                        className="text-left text-primary font-semibold text-sm xs:text-base"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        Keyword :
                                    </motion.label>
                                    <motion.input
                                        type="text"
                                        required
                                        name="categoryKeyword"
                                        value={formValues.categoryKeyword}
                                        className="min-w-full border-3 border-gray-400 text-secondary outline-none rounded-lg px-2 py-2 focus:border-primary transition-all"
                                        onChange={handleChange}
                                        placeholder="e.g (Pizza Place)"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                        maxLength={20}
                                    />
                                    {formErrors.categoryKeyword && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.3 }}
                                            className="text-left text-red-500">
                                            Invalid Keyword
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <p className="text-secondary font-semibold flex flex-row items-center gap-x-1"><span>Category :</span> <span className={`${formValues.categoryPhrase === "" ? 'text-red-500' : 'text-primary'}`}>{formValues.categoryPhrase === "" ? "(Pharse Required) ," : formValues.categoryPhrase}</span><span className={`${formValues.categoryKeyword === "" ? 'text-red-500' : 'text-primary'}`}>{formValues.categoryKeyword === "" ? "(Keyword Required)" : formValues.categoryKeyword}</span></p>

                        <motion.button
                            disabled={disableSubmit}
                            onClick={handleSubmit}
                            type="submit"
                            className={`min-w-full text-white ${disableSubmit ? 'bg-red-300 border-red-500' : 'bg-primary border-primary hover:bg-transparent hover:text-primary cursor-pointer'} border-2 rounded-lg py-2 xs:py-3 text-sm xs:text-base  transition-colors font-semibold`}
                        >
                            Add Category
                        </motion.button>
                    </form>

                </motion.div>
            </section>
        </AnimatePresence >
    );
}

export default AddCategory;