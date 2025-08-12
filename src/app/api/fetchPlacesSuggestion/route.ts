// Imports
import { FailedApiResponse } from "@/types";
import { NextResponse } from "next/server";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userKeyStorkes = searchParams.get("userKeyStorkes");
  if (!userKeyStorkes || userKeyStorkes.length < 4) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Invalid Strokes.",
      },
      {
        status: 404,
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
    const response = await fetch("");

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
    console.log(data);
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
