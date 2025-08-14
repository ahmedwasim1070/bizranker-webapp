// Imports
import { NextResponse } from "next/server";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { validateAddPlaceFormData } from "@/lib/api/validator";
import { prisma } from "@/lib/prismaClient";

// Interfaces
interface FormData {
  placeDetails: any;
  category: string;
  userId: string;
}

//
export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();

    const { placeDetails, category, userId } = body;

    const errorInAddPlaceForm = validateAddPlaceFormData(
      placeDetails,
      category,
      userId
    );
    if (errorInAddPlaceForm) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: errorInAddPlaceForm,
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "User not Found.",
        },
        {
          status: 404,
        }
      );
    }

    const categoryInDB = await prisma.customCategories.findUnique({
      where: { name: category },
    });
    if (!categoryInDB) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Category not Found.",
        },
        {
          status: 404,
        }
      );
    }

    const businessProfile = prisma.businessProfile.findUnique({
      where: { profileId: placeDetails.place_id },
    });
  } catch (error) {
    console.error("Failed to createCategory.", error);
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
