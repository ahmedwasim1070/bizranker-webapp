// Imports
import { NextResponse } from "next/server";
import { FailedApiResponse, SuccessApiResponse } from "@/types";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("countryCode");

  if (!countryCode || countryCode.length !== 2) {
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Country Code is Required." },
      { status: 400 }
    );
  }

  if (!process.env.GEONAME_USERNAME) {
    console.error("GEONAME_USERNAME Environment Variable is not Set.");
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Server Configuration Error." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=150&username=${process.env.GEONAME_USERNAME}`
    );
    if (!response.ok) {
      console.error(
        `Geonames API error status : ${response.status} with response : ${response}`
      );
      return NextResponse.json<FailedApiResponse>(
        { success: false, error: "Failed to Fetch Data from GEONAMES API." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const geoData = data?.geonames;
    if (!geoData || geoData.length === 0) {
      return NextResponse.json(
        { success: false, error: "No Geodata Found." },
        { status: 500 }
      );
    }

    const cityNames: string[] = geoData.map((cityInfo: any) => cityInfo.name);

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully fetchedGeoData.",
        data: cityNames,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GEONAMES API , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error !.",
      },
      { status: 500 }
    );
  }
}
