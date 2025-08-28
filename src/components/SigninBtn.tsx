"use client";

// Imports
import { useSession } from "next-auth/react";

// 
function SigninBtn() {
    // Provider
    // Session
    const { data: session, status } = useSession();

    return (
        <section className="min-w-full pt-3 flex item-center justify-center">
            <button disabled={status === 'authenticated'} onClick={() => { { status !== 'authenticated' && (true) } }} type="button" className={`flex flex-row items-center group sm:gap-x-2 xxs:gap-x-1 sm:px-4 xxs:px-2 py-2  text-center rounded-lg group ${status !== 'authenticated' && 'border border-secondary hover:bg-transparent transition-colors bg-secondary cursor-pointer'}`}>
                <svg
                    className="w-5 h-5 "
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 50 50"
                >
                    <path
                        className={`${status === 'authenticated' ? 'fill-secondary' : 'fill-white group-hover:fill-secondary'}`}
                        d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"
                    />
                </svg>
                <p className={` sm:text-lg xxs:text-sm font-semibold  ${status === 'authenticated' ? 'text-secondary' : 'text-white group-hover:text-secondary'}`}>{status === 'authenticated' ? `Logged In As ${session.user.name}` : 'Sign In'}</p>
            </button>
        </section >
    )
}

export default SigninBtn;