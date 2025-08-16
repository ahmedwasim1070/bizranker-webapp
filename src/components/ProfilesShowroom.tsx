"use client";

// Imports
import { getGlobalProvider } from "@/app/providers/GolobalProvider"
import { Star, Phone, Globe, Info, ArrowDown, ArrowUp, MapPin } from "lucide-react";
import { motion } from 'framer-motion'
import { CldImage } from "next-cloudinary";


// Intercaes
interface RenderProfilesProps {
    profile: any;
    className?: string;
}
interface ErrorThrowerProps {
    requestedProfilesError: string;
}

// React FC
// Skeleton Profile Loader 
const SkeletonProfileLoader = () => (
    <motion.div
        className="bg-background border-2 border-gray-200 rounded-lg flex flex-col items-center justify-center pb-4 gap-y-2 animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        <div className="w-full flex flex-row items-center justify-around px-4">
            <div className="flex flex-row items-center gap-x-2">
                <div className="w-5 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="flex flex-row items-center gap-x-2">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
            </div>
        </div>
        <div className="w-full flex items-center justify-center gap-x-4 px-4">
            <div className="w-12 h-8 bg-gray-300 rounded"></div>
            <div className="w-12 h-8 bg-gray-300 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
    </motion.div>
)
// Error Thrower
const ErrorThrower = ({ requestedProfilesError }: ErrorThrowerProps) => (
    <div className="min-w-screen flex items-center gap-x-2 justify-center p-6 text-red-500 font-semibold text-xl">
        <Info className="w-8 h-8 " />
        <p>{requestedProfilesError}</p>
    </div>
)
// Profile Renderer
const RenderProfiles = ({ profile, className }: RenderProfilesProps) => (
    <div className={`${className ? className : 'border-2 border-primary '} text-secondary text-center rounded-lg flex flex-col items-center justify-center pb-4 gap-y-3`}>
        <CldImage
            className="w-full rounded-t-lg font-semibold object-cover"
            src={profile.pfp}
            width={100}
            height={48}
            alt={profile.name}
            crop="fill"
            gravity="auto"
        />

        <h3 className="text-xl font-semibold">{profile.name}</h3>

        <h4 className="text-primary">{profile.category.name}</h4>

        <div className="w-full flex flex-row items-center justify-around">
            <a className="flex flex-row items-center gap-x-2 cursor-pointer hover:text-primary transition-colors">
                <Phone className="w-5 h-4 font-medium text-red-500 " />
                <span className="text-xs underline">{profile.phone}</span>
            </a>

            <a href={profile.website || ''} className="flex flex-row items-center gap-x-2 cursor-pointer hover:text-primary transition-colors">
                <Globe className="w-5 h-5 text-blue-300 font-medium " />
                <span className="text-xs underline">Website</span>
            </a>
        </div>

        <div className="rounded-full flex flex-row items-center bg-secondary/20 pr-2 my-2">
            <div className="flex flex-row items-center">
                <button className="p-2 rounded-full cursor-pointer hover:bg-secondary/40 group transition-colors">
                    <ArrowUp className="w-4 h-4 stroke-2 text-primary" />
                </button>
                <p className="text-primary font-semibold text-sm">{profile.customCategories.upVotes || 0}</p>
            </div>

            <div className="flex flex-row items-center">
                <button className="p-2 rounded-full cursor-pointer text-secondary hover:bg-primary/40 transition-colors">
                    <ArrowDown className="w-4 h-4 stroke-2 text-secondary" />
                </button>
                <p className="text-secondary font-semibold text-sm">{profile.customCategories.downVotes || 0}</p>
            </div>
        </div>

        <div className="flex flex-row gap-x-1 items-center cursor-pointer group">
            <MapPin className="w-4 h-4  text-primary group-hover:text-secondary transition-colors" />
            <a href={profile.mapsUrl} className="text-secondary underline group-hover:text-primary transition-colors text-sm">
                Google Maps
            </a>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-x-2">
            {profile.reviewValue && (
                <span className="text-xs text-primary font-semibold flex items-center gap-x-2">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {profile.reviewValue.toFixed(1)}
                </span>
            )}
            {profile.reviewAmount && (
                <span className="text-xs text-secondary">
                    ({profile.reviewAmount} reviews)
                </span>
            )}
        </div>

    </div>
);

// 
function ProfilesShowroom() {
    // Context
    const { requestedProfiles, requestedProfilesError, isRequestingProfiles, newlyAddedPlace } = getGlobalProvider();


    return (
        <>
            <section className="min-w-screen px-6 py-10 bg-white">
                <div className="grid grid-cols-3 gap-6">
                    {/* Loader */}
                    {isRequestingProfiles && [...Array(3)].map((_, idx) => (
                        <SkeletonProfileLoader key={idx} />
                    ))}
                    {newlyAddedPlace && newlyAddedPlace && (
                        <RenderProfiles profile={newlyAddedPlace} className="border-2 border-green-500" />
                    )}
                    {/* Error */}
                    {!requestedProfiles && !newlyAddedPlace && requestedProfilesError ?
                        <ErrorThrower requestedProfilesError={requestedProfilesError || "Error while loading"} />
                        :
                        requestedProfiles?.map((profile, idx) => (
                            <RenderProfiles profile={profile} key={idx} />
                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default ProfilesShowroom