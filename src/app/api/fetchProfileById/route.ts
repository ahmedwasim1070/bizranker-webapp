// Imports
import { NextResponse } from "next/server";
import { FailedApiResponse, SuccessApiResponse } from "@/types";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const profileId = searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Invalid ProfileId.",
      },
      {
        status: 400,
      }
    );
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error("GOOGLE_PLACES_API_KEY Environment Variable is not Set.");
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Server Configuration Error." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${profileId}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    if (!response.ok) {
      console.error(
        `FetchByProfileId API error status : ${response.status} with response : ${response}`
      );
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Error Fetching Data from FetchByProfileId API.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const placeData = data.result;

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully FetchByProfileId.",
        data: placeData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in FetchPlacesSuggestion , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unkown Error !.",
      },
      {
        status: 500,
      }
    );
  }
}
