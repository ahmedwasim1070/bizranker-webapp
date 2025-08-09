// Imports
import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
// Provider
import { GlobalProvider } from "./providers/GolobalProvider";
// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Header
export const metadata: Metadata = {
	title: "RankedPlaces",
	description: "A unique way to Rank Businesses.",
};

// 
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const cookieStore = await cookies();
	const locationRawCookie = cookieStore.get("user_location")?.value;

	let locationData = null;
	try {
		locationData = locationRawCookie ? JSON.parse(locationRawCookie) : null;
	} catch (error) {
		console.error("Error parsing location cookei", error);
		locationData = null;
	}

	return (
		<html lang="en">
			<body>
				<GlobalProvider locationData={locationData} >
					<Header />
					{children}
					<Footer />
				</GlobalProvider>
			</body>
		</html>
	);
}
