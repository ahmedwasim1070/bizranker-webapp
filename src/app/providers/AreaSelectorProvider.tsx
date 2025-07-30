// Imports
import { createContext, ReactNode, useContext } from "react";

// Interfaces
interface AreaSelectorContextTypes {
    // Define any shared state or functions here
}

interface AreaSelectorProviderProps {
    children: ReactNode; // Exactly two children expected
}

// Global context
const AreaSelectorContext = createContext<AreaSelectorContextTypes | undefined>(undefined);

// Provider
function AreaSelectorProvider({ children }: AreaSelectorProviderProps) {

    return (
        <AreaSelectorContext.Provider value={{}}>
            {children}
        </AreaSelectorContext.Provider>
    );
}

// Hook to use the context
export const useAreaSelectorContext = () => {
    const context = useContext(AreaSelectorContext);
    if (context === undefined) {
        throw new Error("useAreaSelectorContext must be used within an AreaSelectorProvider");
    }
    return context;
};

export default AreaSelectorProvider;
