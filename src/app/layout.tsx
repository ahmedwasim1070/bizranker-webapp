// Imports
import type { Metadata } from "next";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import { cookies } from "next/headers";
// Provider
import { GlobalProvider } from "./providers/GolobalProvider";
// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

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
		console.error("Error while Parsing Cookie. ,", error);
		locationData = null;
	}

	return (
		<html lang="en">
			<body>
				<ToastContainer position="top-right" autoClose={3000} />
				<GlobalProvider locationData={locationData} >
					<Header />
					{children}
					<Footer />
				</GlobalProvider>
			</body>
		</html>
	);
}
