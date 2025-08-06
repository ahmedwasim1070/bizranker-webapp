// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { X } from "lucide-react";

// 
function AddCategory() {
    // Context
    const { setIsAddBusiness } = getGlobalProvider();

    return (
        <>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
                <div className="relative w-full max-w-xl min-h-100 bg-background rounded-lg shadow-2xl overflow-hidden text-center">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsAddBusiness(false)}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-secondary/10 transition-colors cursor-pointer shadow-lg"
                    >
                        <X className="w-6 h-6" style={{ color: '#273f4f' }} />
                    </button>

                    <h2 className="text-secondary font-bold">Make Custom Category</h2>
                </div>
            </section>
        </>
    )

}

export default AddCategory;