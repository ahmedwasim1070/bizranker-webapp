// Imports
import { NextRequest, NextResponse } from "next/server";
// Lib
import { ApiError } from "@/lib/error/ApiError";
// Types
import { ApiResponse, CitiesResponse } from "@/types";

//
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const countryCode = searchParams.get("country-code");
  if (!countryCode || countryCode.length < 2) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message: "Country code is required.",
      },
      { status: 400 }
    );
  }

  if (!process.env.GEONAME_USERNAME) {
    console.error("GEONAME_USERNAME enviroment variable not set.");
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message: "Server config error.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=150&username=${process.env.GEONAME_USERNAME}`
    );
    if (!response.ok) {
      throw new ApiError("Error from external api.", response.status);
    }

    const data = await response.json();

    const geoData = data?.geonames;
    if (!geoData || geoData.length === 0) {
      throw new ApiError("Unkown data format from api.", 400);
    }

    const cityData: CitiesResponse[] = geoData.map((cityInfo: any) => ({
      name: cityInfo.name,
      lat: parseFloat(cityInfo.lat),
      lng: parseFloat(cityInfo.lng),
    }));

    return NextResponse.json<ApiResponse<CitiesResponse[]>>({
      success: true,
      data: cityData,
      message: "Successfull fetchedCities.",
    });
  } catch (error) {
    // Message
    const message =
      error instanceof ApiError ? error.message : "Unexpected error.";
    // Status
    const status = error instanceof ApiError ? error.status : 500;
    // Console
    console.error(
      "Error in fetchCities.",
      "Message : ",
      message,
      "Error : ",
      error
    );
    // Response
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message,
      },
      {
        status,
      }
    );
  }
}
