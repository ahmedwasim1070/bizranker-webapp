// Imports
import { categoryFormData } from "@/lib/api/validator";
import { FailedApiResponse } from "@/types";
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

    const error = categoryFormData(categoryPhrase, categoryKeyword);
    if (error) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error,
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
