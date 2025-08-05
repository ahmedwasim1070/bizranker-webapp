"use client";

// Imports
// Components
import Hero from "@/components/Hero";
import BusinessCateogoriesCorosel from "@/components/BusinessCateogoriesCorosel";
import ProfilesShowroom from "@/components/ProfilesShowroom";

// 
function Home() {

	return (
		<>
			<section>
				<Hero />
				<BusinessCateogoriesCorosel />
				<ProfilesShowroom />
			</section>
		</>
	)
}

export default Home;