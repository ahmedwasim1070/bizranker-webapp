// Imports
import type { Metadata } from "next";
import "./globals.css";
// Providers
import { GlobalProvider } from "@/providers/GlobalProvider";
// Components
import Header from "../components/Header";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/providers/LocationProvider";

// Metadata
export const metadata: Metadata = {
  title: "RankedPlaces",
  description: "Ranking Places based on tags.",
};

// 
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <Header />

        {/* All childre wrapped inside GlobalProvider */}
        <GlobalProvider>
          {children}
        </GlobalProvider>


        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
