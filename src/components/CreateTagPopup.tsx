"use client";

// Imports
import { X } from "lucide-react"
import { useEffect, useState } from "react";
import { rankingPhrases } from "@/lib/constants/rankingPhrases";
// Types
import { ApiResponse, TagFormData, TagFormError } from "@/types";
// Provider
import { getGlobalProvider } from "@/providers/GlobalProvider"
// Components
import Loader from "./Loader";

// 
function CreateTagPopup() {
    // Providers
    // Global
    const { setIsCreateTagPop } = getGlobalProvider();
    // States
    // Disable button
    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
    // Form Data
    const [tagFormData, setTagFormData] = useState<TagFormData>({
        userId: "",
        phrase: "",
        keyword: "",
    });
    // Form Error
    const [tagFormError, setTagFormError] = useState<TagFormError>({
        phrase: null,
        keyword: null,
    })
    // Loader for submission
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    // Handle Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTagFormError({ ...tagFormError, [name]: null });
        setTagFormData({ ...tagFormData, [name]: value });
        setDisableSubmit(false);
    }
    // Handle Submit 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmiting(true);
        try {
            const res = await fetch(`/api/createTag`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tagFormData),
            });
            if (!res.ok) {
                const errData = (await res.json()) as ApiResponse<never>;
                throw new Error(errData.message);
            }

            const data = (await res.json()) as ApiResponse<never>;
            if (data.success) {
            }
        } catch (err) {
            // Message
            const msg =
                err instanceof Error ? err.message : "Unexpected error.";
            // 
            console.error("Error in fetchCountries in CountrySelector.", "Message : ", msg, "Error : ", err);
        } finally {
            setIsSubmiting(false);
        }
    };

    // Effect
    useEffect(() => {
        // 
        if (!rankingPhrases.includes(tagFormData.phrase)) {
            setTagFormError({ ...tagFormError, phrase: "Invalid Phrse" })
            setDisableSubmit(true);
        }

        // 
        if (tagFormData.keyword === "" || tagFormData.keyword.length < 3 || tagFormData.keyword.length > 20) {
            setTagFormError({ ...tagFormError, keyword: "Invalid Keyword" })
            setDisableSubmit(true);
        }
    }, [tagFormData])

    return (
        <section className="fixed min-w-screen min-h-screen bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-2">
            <div className="w-1/3 min-w-xxs bg-background rounded-lg shadow-sm px-2 py-4 border border-secondary/20 relative text-center space-y-5">

                {/*  */}
                <button onClick={() => setIsCreateTagPop(false)} type="button" className="p-2 bg-white shadow-sm absolute top-2 right-2 rounded-full cursor-pointer hover:bg-secondary/20 transition-colors">
                    <X className="w-5 h-5 text-secondary" />
                </button>

                {/*  */}
                <h3 className="text-xl text-secondary font-semibold">
                    Create Tag
                </h3>

                {/*  */}
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-row gap-x-2 items-center">
                        {/*  */}
                        <select required value={tagFormData.phrase} onChange={handleChange} name="phrase" className="w-1/2 border-2 border-primary bg-background rounded-lg px-2 py-2 outline-none focus:border-secondary cursor-pointer text-secondary font-semibold ">
                            {/*  */}
                            <option hidden>Phrase</option>

                            {/*  */}
                            {rankingPhrases.map((phrase, idx) => (
                                <option value={phrase} key={idx}>
                                    {phrase}
                                </option>
                            ))}
                        </select>

                        {/*  */}
                        <p className="font-semibold text-secondary">+</p>

                        {/*  */}
                        <input value={tagFormData.keyword} required onChange={handleChange} type="text" name="keyword" className="w-1/2 border-2 border-primary text-secondary rounded-lg px-2 py-2 placeholder:text-gray-400 outline-none focus:border-secondary font-semibold" placeholder="Keyword" />
                    </div>

                    <p className="text-sm text-secondary">
                        <span className={`${tagFormError.phrase || tagFormData.phrase === "" ? 'text-red-500' : 'text-secondary'}`}>
                            {tagFormError.phrase || tagFormData.phrase || "required"}
                        </span>

                        <span> + </span>

                        <span className={`${tagFormError.keyword ? 'text-red-500' : 'text-secondary'}`}>
                            {tagFormError.keyword || (tagFormError.keyword || tagFormData.keyword === "" ? "required" : tagFormData.keyword)}
                        </span>
                    </p>

                    {/*  */}
                    <button disabled={disableSubmit || isSubmiting} type="submit" className="bg-primary border-2 border-primary text-center rounded-lg w-full py-2 text-white font-semibold enabled:hover:bg-transparent transition-colors enabled:cursor-pointer enabled:hover:text-primary disabled:bg-primary/10">
                        {isSubmiting ? <Loader className="py-1" dotSize="3" /> : 'Add Tag'}
                    </button>
                </form>

            </div>
        </section>
    )
}

export default CreateTagPopup;