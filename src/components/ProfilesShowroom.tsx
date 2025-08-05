// Imports
import Image from "next/image";
import { getGlobalProvider } from "@/app/providers/GolobalProvider"
import { Star, Phone, Globe } from "lucide-react";

// 
function ProfilesShowroom() {
    const { requestedProfiles, requestedProfilesError } = getGlobalProvider();

    return (
        <>
            <section className="min-w-screen px-6 py-10 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/*  */}
                    {requestedProfiles?.map((profile, idx) => (
                        <div key={idx} className="bg-background border-2 border-primary text-secondary text-center  rounded-lg flex flex-col items-center justify-center pb-4 gap-y-2">
                            <Image className="w-full font-semibold object-cover" src={profile.pfpUrl} width={100} height={50} alt={profile.name} />

                            <h3 className="text-xl font-semibold">{profile.name}</h3>

                            <h4 className="text-primary">{profile.category.name}</h4>

                            <div className="w-full flex flex-row items-center justify-around">
                                <a className="flex flex-row items-center gap-x-2 cursor-pointer hover:text-primary transition-colors">
                                    <Phone className="w-5 h-4 font-medium text-red-500 " />
                                    <span className="text-xs underline">{profile.phone}</span>
                                </a>

                                <a className="flex flex-row items-center gap-x-2 cursor-pointer hover:text-primary transition-colors">
                                    <Globe className="w-5 h-5 text-blue-300 font-medium " />
                                    <span className="text-xs underline">Website</span>
                                </a>
                            </div>

                            <div className="w-full flex items-center justify-center gap-x-2">
                                {profile.reviewRating && (
                                    <span className="text-xs text-primary font-semibold flex items-center gap-x-2">
                                        <Star className="w-4 h-4 fill-amber-300" />
                                        {profile.reviewRating.toFixed(1)}
                                    </span>
                                )}
                                {profile.reviewAmount && (
                                    <span className="text-xs text-secondary">
                                        ({profile.reviewAmount} reviews)
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-primary">{profile.owner}</p>
                        </div>
                    ))}

                </div>
            </section>
        </>
    )
}

export default ProfilesShowroom