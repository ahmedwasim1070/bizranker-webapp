"use client";

// Imports
import { X } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { getGlobalProvider } from "@/app/providers/GolobalProvider";
import { useState } from "react";
import LoadingDots from "./LoadingDots";
import { toast } from "react-toastify";

function GoogleAuth() {
    // Session
    const { update } = useSession();
    // Context
    const { setIsGoogleAuth } = getGlobalProvider();
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle Zero auth google
    const handle0auth = async () => {
        setIsLoading(true);
        try {
            const res = await signIn("google", { redirect: false, });
            if (res.error) {
                toast.error("Error while Authentication.");
                return;
            }

            await update();
            setIsGoogleAuth(false);
        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <section className="fixed min-w-screen min-h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50 px-2 xs:px-0">
                <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 80 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex flex-col items-center justify-center gap-y-6 w-full max-w-xl bg-background rounded-lg shadow-2xl overflow-y-scroll text-center px-4 xs:px-8 py-6 xs:py-8"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsGoogleAuth(false)}
                        className="absolute top-3 xs:top-4 right-3 xs:right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-secondary/20 transition-colors cursor-pointer shadow-lg border border-secondary/20"
                    >
                        <X className="w-5 h-5 xs:w-6 xs:h-6 text-secondary" />
                    </button>

                    {/* Header */}
                    <div className="mt-4 xs:mt-6">
                        <h2 className="text-2xl  xs:text-3xl font-bold  mb-2">
                            <span className="text-secondary">Ranked</span>
                            <span className="text-primary">Plaecs</span>
                        </h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 text-secondary/80">
                        <p className="text-lg xs:text-xl leading-relaxed">
                            Feel free to explore our app and discover all its amazing features!
                        </p>

                        <div className="bg-secondary/5 rounded-lg p-4 xs:p-6 border border-secondary/10">
                            <h3 className="text-lg font-semibold text-primary mb-3">
                                Fair Voting Policy
                            </h3>
                            <p className="text-sm xs:text-base leading-relaxed mb-2">
                                To ensure fair and authentic voting, we need to verify each user.
                            </p>
                            <p className="text-sm xs:text-base leading-relaxed font-medium text-primary">
                                We only require your email address to participate in voting - no spam, no newsletters, no unwanted emails.
                                Your privacy is our priority.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 justify-center text-xs xs:text-sm text-secondary/60">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Secure & Private Authentication</span>
                        </div>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        disabled={isLoading}
                        onClick={handle0auth}
                        className={`w-full bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white font-semibold py-3 xs:py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group`}
                    >
                        {!isLoading ? (<>
                            < svg
                                className="w-5 h-5 xs:w-6 xs:h-6"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>

                            <span className="text-base xs:text-lg">Continue with Google</span>

                            <ChevronRight className="w-6 h-6 text-white" />
                        </>)
                            :
                            <LoadingDots className="w-8 h-8 " />
                        }
                    </button>

                    {/* Footer */}
                    <p className="text-xs xs:text-sm text-secondary/50 leading-relaxed max-w-md">
                        By continuing, you agree to our terms of service and privacy policy.
                        Your data is protected and never shared with third parties.
                    </p>
                </motion.div>
            </section>
        </AnimatePresence >
    );
}

export default GoogleAuth;