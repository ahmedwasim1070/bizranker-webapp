// Imports
import { NextRequest, NextResponse } from "next/server";
// Lib
import { ApiError } from "@/lib/error/ApiError";
// Types
import { ApiResponse } from "@/types";

//
export async function POST(request: NextRequest) {
  try {
    const body = request.json();
  } catch (error) {
    // Message
    const message =
      error instanceof ApiError ? error.message : "Unexpected error.";
    // Status
    const status = error instanceof ApiError ? error.status : 500;
    // Console
    console.error(
      "Error in createTag.",
      "Message : ",
      message,
      "Error : ",
      error
    );
    // Response
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        message,
      },
      {
        status,
      }
    );
  }
}
