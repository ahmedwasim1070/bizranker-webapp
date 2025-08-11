// Imports
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { validateCategory } from "@/lib/api/validator";

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestType = searchParams.get("requestType");
  if (
    !requestType ||
    !["worldProfiles", "countryProfiles", "cityProfiles"].includes(requestType)
  ) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "requestType is Invalid.",
      },
      {
        status: 400,
      }
    );
  }

  const category = searchParams.get("category");
  const errorInCategory = await validateCategory(category);
  if (errorInCategory) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: errorInCategory,
      },
      { status: 400 }
    );
  }

  try {
    switch (requestType) {
      case "worldProfiles":
        return await fetchWorldProfiles(category);
      case "countryProfiles":
        return await fetchCountryProfiles(searchParams, category);
      case "cityProfiles":
        return await fetchCityProfiles(searchParams, category);
    }
  } catch (error) {
    console.error("Error in fetchProfiles API , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error !.",
      },
      {
        status: 500,
      }
    );
  }
}

// For RequestType of World Profiles
const fetchWorldProfiles = async (category: string) => {
  try {
    if (category === "all") {
      const profilesOfAll = await prisma.businessProfile.findMany();
      if (!profilesOfAll || profilesOfAll.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchWorldProfiles by All.",
          data: profilesOfAll,
        },
        {
          status: 200,
        }
      );
    } else {
      const profilesOfCategory = await prisma.businessProfile.findMany({
        where: {
          customCategories: {
            some: {
              customCategory: {
                name: category,
              },
            },
          },
        },
      });
      if (!profilesOfCategory || profilesOfCategory.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchWorldProfiles by Category.",
          data: profilesOfCategory,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error in fetchWorldProfiles , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error !.",
      },
      {
        status: 500,
      }
    );
  }
};

// For RequestType of Country Profiles
const fetchCountryProfiles = async (
  params: URLSearchParams,
  category: string
) => {
  const country = params.get("country");
  if (!country || typeof country !== "string") {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Country is Required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (category === "all") {
      const profilesOfAll = await prisma.businessProfile.findMany({
        where: { country },
      });
      if (!profilesOfAll || profilesOfAll.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchCountryProfiles by All.",
          data: profilesOfAll,
        },
        {
          status: 200,
        }
      );
    } else {
      const profilesOfCategory = await prisma.businessProfile.findMany({
        where: {
          customCategories: {
            some: {
              customCategory: {
                name: category,
              },
            },
          },
          country,
        },
      });
      if (!profilesOfCategory || profilesOfCategory.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchCountryProfiles by Category.",
          data: profilesOfCategory,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error in fetchCountryProfiles , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error !.",
      },
      {
        status: 500,
      }
    );
  }
};

// For RequestType of City Profiles
const fetchCityProfiles = async (params: URLSearchParams, category: string) => {
  const country = params.get("country");
  if (!country || typeof country !== "string") {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Country is Required.",
      },
      {
        status: 400,
      }
    );
  }
  const city = params.get("city");
  if (!city || typeof city !== "string") {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "City is Required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (category === "all") {
      const profilesOfAll = await prisma.businessProfile.findMany({
        where: { city, country },
      });
      if (!profilesOfAll || profilesOfAll.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchCityProfiles by All.",
          data: profilesOfAll,
        },
        {
          status: 200,
        }
      );
    } else {
      const profilesOfCategory = await prisma.businessProfile.findMany({
        where: {
          customCategories: {
            some: {
              customCategory: {
                name: category,
              },
            },
          },
          city,
          country,
        },
      });
      if (!profilesOfCategory || profilesOfCategory.length === 0) {
        return NextResponse.json<FailedApiResponse>(
          {
            success: false,
            error: "No Profiles found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<SuccessApiResponse>(
        {
          success: true,
          message: "Successfully fetchCityProfiles by Category.",
          data: profilesOfCategory,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error in fetchCityProfiles , ", error);
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error !.",
      },
      {
        status: 500,
      }
    );
  }
};
