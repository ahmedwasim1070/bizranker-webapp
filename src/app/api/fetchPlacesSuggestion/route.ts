// Imports
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { NextResponse } from "next/server";
import { validateCords } from "@/lib/api/validator";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const errorInLatnLng = validateCords(lat, lng);
  if (errorInLatnLng) {
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: errorInLatnLng },
      { status: 400 }
    );
  }

  const userKeyStrokes = searchParams.get("userKeyStrokes");
  if (!userKeyStrokes || userKeyStrokes.length < 3) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Invalid Strokes.",
      },
      {
        status: 400,
      }
    );
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error("GOOGLE_PLACES_API_KEY environment variable is not set.");
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Server Configuration Error.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        userKeyStrokes
      )}&location=${lat},${lng}&radius=${50000}&key=${
        process.env.GOOGLE_PLACES_API_KEY
      }`
    );

    if (!response.ok) {
      console.error(
        `FetchPlacesSuggestion API error status : ${response.status} with response : ${response}`
      );
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Error Fetching Data from FetchPlacesSuggestion API.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const predictedPlaecs = data.predictions;
    if (!predictedPlaecs || predictedPlaecs.length === 0) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "No Places Found.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully FetchPlacesSuggestion.",
        data: predictedPlaecs,
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
