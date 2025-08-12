// Imports
import {
  validateCategory,
  validateCategoryFormData,
} from "@/lib/api/validator";
import { prisma } from "@/lib/prismaClient";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { NextResponse } from "next/server";

// Interfaces
interface FormData {
  categoryPhrase: string;
  categoryKeyword: string;
  userId: string;
}

//
export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();

    const { categoryPhrase, categoryKeyword, userId } = body;

    const errorInCategoryForm = validateCategoryFormData(
      categoryPhrase,
      categoryKeyword
    );
    if (errorInCategoryForm) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: errorInCategoryForm,
        },
        {
          status: 400,
        }
      );
    }

    const customCategory = categoryPhrase.trim() + " " + categoryKeyword.trim();

    const errorOfCategoryExsistance = await validateCategory(customCategory);
    if (errorOfCategoryExsistance === "Invalid Category.") {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Category already Exsists.",
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
          error: "Invalid User.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.customCategories.create({
      data: {
        name: customCategory,
        createdAt: new Date().toISOString(),
        aurtherId: user.id,
      },
    });

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: "Successfully Created Category.",
        data: null,
      },
      {
        status: 200,
      }
    );
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
