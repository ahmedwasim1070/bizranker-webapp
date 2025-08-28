// Imports
import { X } from "lucide-react"
// Provider
import { getGlobalProvider } from "@/providers/GlobalProvider"
import { rankingPhrases } from "@/lib/constants/rankingPhrases";

// 
function CreatetagPopup() {
    // Providers
    // Global
    const { setIsCreateTagPop } = getGlobalProvider();

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
                <form className="space-y-2">
                    <div className="w-full flex flex-row gap-x-2 items-center">
                        {/*  */}
                        <select className="w-1/2 border-2 border-primary bg-background rounded-lg px-2 py-2 outline-none focus:border-secondary cursor-pointer text-secondary font-semibold ">
                            {/*  */}
                            <option hidden>Phrase</option>

                            {/*  */}
                            {rankingPhrases.map((phrase, idx) => (
                                <option key={idx}>
                                    {phrase}
                                </option>
                            ))}
                        </select>

                        {/*  */}
                        <p className="font-semibold text-secondary">+</p>

                        {/*  */}
                        <input type="text" name="tagName" className="w-1/2 border-2 border-primary text-secondary rounded-lg px-2 py-2 placeholder:text-gray-400 outline-none focus:border-secondary font-semibold" placeholder="Keyword" />
                    </div>

                    {/*  */}
                    <button className="bg-primary border-2 border-primary text-center rounded-lg w-full py-2 text-white font-semibold hover:bg-transparent transition-colors cursor-pointer hover:text-primary">Add Tag</button>
                </form>

            </div>
        </section>
    )
}

export default CreatetagPopup