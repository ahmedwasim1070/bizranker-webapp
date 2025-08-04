// Imports
import { NextResponse } from "next/server";
import { validateCategory } from "@/lib/api/validator";
import { prisma } from "@/lib/prismaClient";
import { FailedApiResponse, SuccessApiResponse } from "@/types";

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
  if (!category) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Category is Required.",
      },
      {
        status: 400,
      }
    );
  }
  const categoryId = await validateCategory(category);
  if (categoryId === null) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Category in Invalid.",
      },
      { status: 400 }
    );
  }

  try {
    switch (requestType) {
      case "worldProfiles":
        return await fetchWorldProfiles(categoryId);
      case "countryProfiles":
        return await fetchCountryProfiles(searchParams, categoryId);
      case "cityProfiles":
        return await fetchCityProfiles(searchParams, categoryId);
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
const fetchWorldProfiles = async (categoryId: number) => {
  try {
    if (categoryId === 0) {
      const profilesOfAll = await prisma.businessProfile.findMany({
        orderBy: { reviewRating: "desc" },
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
          categoryId,
        },
        orderBy: {
          reviewRating: "desc",
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
  categoryId: number
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
    if (categoryId === 0) {
      const profilesOfAll = await prisma.businessProfile.findMany({
        where: { country },
        orderBy: { reviewRating: "desc" },
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
          categoryId,
          country,
        },
        orderBy: {
          reviewRating: "desc",
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
const fetchCityProfiles = async (
  params: URLSearchParams,
  categoryId: number
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
    if (categoryId === 0) {
      const profilesOfAll = await prisma.businessProfile.findMany({
        where: { city, country },
        orderBy: { reviewRating: "desc" },
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
          categoryId,
          city,
          country,
        },
        orderBy: {
          reviewRating: "desc",
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
