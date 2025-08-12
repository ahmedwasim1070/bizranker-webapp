"use client";

// Imports
// Components
import Hero from "@/components/Hero";
import BusinessCateogoriesCorosel from "@/components/BusinessCateogoriesCorosel";
import ProfilesShowroom from "@/components/ProfilesShowroom";
import AddPlaceBtn from "@/components/AddPlaceBtn";
import { SessionProvider } from "next-auth/react";

// 
function Home() {

	return (
		<>
			<section>
				<Hero />
				<BusinessCateogoriesCorosel />
				<SessionProvider>
					<AddPlaceBtn />
				</SessionProvider>
				<ProfilesShowroom />
			</section>
		</>
	)
}

export default Home;