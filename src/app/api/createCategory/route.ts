// Imports
import {
  validateCategory,
  validateCategoryFormData,
} from "@/lib/api/validator";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { NextResponse } from "next/server";

// Interfaces
interface FormData {
  categoryPhrase: string;
  categoryKeyword: string;
}

//
export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();

    const { categoryPhrase, categoryKeyword } = body;

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

    const customCategory = categoryPhrase.trim() + categoryKeyword.trim();
    const errorOfCategoryExsistance = await validateCategory(customCategory);
    if (errorOfCategoryExsistance === null) {
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
