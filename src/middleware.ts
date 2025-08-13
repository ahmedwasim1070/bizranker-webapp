// Imports
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LocationData } from "./types";

//
export async function middleware(request: Request) {
  const cookieStore = await cookies();
  const locationRawCookie = cookieStore.get("user_location")?.value;

  if (locationRawCookie) return NextResponse.next();

  if (!process.env.IPGEOLOCATION_KEY) {
    console.error("IPGEOLOCATION_KEY environment variable is not set");
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 }
    );
  }
  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_KEY}`
    );
    if (!response.ok) {
      console.error(
        `ipgeolocation.io api error code : ${response.status}, with response : ${response}`
      );
      return NextResponse.next();
    }

    const data = await response.json();
    if (
      !data.country_name ||
      !data.country_code2 ||
      !data.latitude ||
      !data.longitude ||
      !data.country_capital
    ) {
      return NextResponse.next();
    }

    const userIpLocationInfo: LocationData = {
      country: data.country_name,
      countryCode: data.country_code2,
      lat: data.latitude,
      lng: data.longitude,
      capital: data.country_capital,
    };

    const res = NextResponse.next();
    res.cookies.set("user_location", JSON.stringify(userIpLocationInfo), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (error) {
    console.error("GeoIP fetch failed:", error);
    return NextResponse.next();
  }
}
