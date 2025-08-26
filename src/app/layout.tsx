// Imports
import type { Metadata } from "next";
import { cookies } from "next/headers";
// CSS
import "./globals.css";
// Providers
import { GlobalProvider } from "@/providers/GlobalProvider";
import { LocationProvider } from "@/providers/LocationProvider";
// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Types
import { LocationCookieData } from "@/types";

// Metadata
export const metadata: Metadata = {
  title: "RankedPlaces",
  description: "Ranking Places based on tags.",
};

// 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cookie
  let locationCookieData: LocationCookieData | null = null;
  try {
    const raw = cookies().get("user_location")?.value;
    locationCookieData = raw ? (JSON.parse(raw)) as LocationCookieData : null;
  } catch (err) {
    console.error("Invalid user_location cookie : ", err);
    locationCookieData = null;
  }

  return (
    <html lang="en">
      <body>
        <LocationProvider initialLocation={locationCookieData}>

          {/* All childre wrapped inside GlobalProvider */}
          <GlobalProvider>
            {/* Header */}
            <Header />

            {children}

            {/* Footer */}
            <Footer />
          </GlobalProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
