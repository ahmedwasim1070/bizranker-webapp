// Imports
import { prisma } from "@/lib/prismaClient";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { NextResponse } from "next/server";

//
export async function GET(request: Request) {
  try {
    const categories = await prisma.customCategories.findMany({
      include: {
        _count: {
          select: {
            businessProfiles: true,
          },
        },
      },
      orderBy: {
        businessProfiles: {
          _count: "desc",
        },
      },
    });
    if (!categories || categories.length === 0) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "No categories found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully fetchedCategories.",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetchedCategories from DB.", error);
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
