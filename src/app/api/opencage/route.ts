// Imports
import { NextResponse } from "next/server";
import { FailedApiResponse, SuccessApiResponse } from "@/types";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Latitude and Longitude are Required." },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Invalid Latitude or Longitude format." },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error:
          "Latitude must be between -90 and 90, Longitude between -180 and 180.",
      },
      { status: 400 }
    );
  }

  if (!process.env.OPENCAGE_KEY) {
    console.error("OPENCAGE_KEY environment variable is not set.");
    return NextResponse.json<FailedApiResponse>(
      { success: false, error: "Server Configuration Error." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.OPENCAGE_KEY}&no_annotations=1&limit=1&language=en`
    );

    if (!response.ok) {
      console.error(
        `OpenCage API error status : ${response.status} with response : ${response}`
      );
      return NextResponse.json<FailedApiResponse>(
        { success: false, error: "Error Fetching Data from OpenCage API." },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No location Data found for the provided Coordinates.",
        },
        { status: 404 }
      );
    }
    const selectedData = data.results[0].components;
    const latNlngInfo = {
      city: selectedData?.city.split(" ")[0] || null,
      town: selectedData?.town || null,
      village: selectedData?.village || null,
      country: selectedData?.country || null,
      countryCode: selectedData?.country_code || null,
    };

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully fetchedOpencageData.",
        data: latNlngInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in OpenCage API , ", error);
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
