// Imports
import { NextResponse } from "next/server";
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { validateAddPlaceFormData } from "@/lib/api/validator";
import { prisma } from "@/lib/prismaClient";
import cloudinary from "@/lib/cloudinary";

// Interfaces
interface FormData {
  placeDetails: any;
  category: string;
  userId: string;
}

// Helper function to check if URL is a Google Places photo URL
function isGooglePhotoUrl(url: string): boolean {
  return url && url.includes("googleapis.com/maps/api/place/photo");
}

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(
  imageUrl: string,
  publicId: string
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: "business-profiles",
      transformation: [
        { width: 1024, height: 1024, crop: "fill", quality: "auto" },
        { format: "webp" },
      ],
      overwrite: true,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Failed to upload image to Cloudinary:", error);
    return null;
  }
}

// Helper function to generate Google Places photo URL
function generateGooglePhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1024&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}

// Helper function to extract place data
function extractPlaceData(placeDetails: any, userId: number) {
  return {
    profileId: placeDetails.place_id,
    name: placeDetails.name || "",
    category: placeDetails.types?.[0] || "unknown",
    address: placeDetails.formatted_address || "",
    city:
      placeDetails.address_components?.find((c: any) =>
        c.types.includes("locality")
      )?.long_name || "",
    country:
      placeDetails.address_components?.find((c: any) =>
        c.types.includes("country")
      )?.long_name || "",
    phone:
      placeDetails.international_phone_number ||
      placeDetails.formatted_phone_number ||
      "",
    mapsUrl: placeDetails.url,
    website: placeDetails.website || "",
    reviewValue: parseFloat(placeDetails.rating) || 0,
    reviewAmount: parseInt(placeDetails.user_ratings_total) || 0,
    addedById: userId,
  };
}

export async function POST(request: Request) {
  const sessionUserId = request.headers.get("x-user-id");
  const sessionUserIsGuest = request.headers.get("x-guest") === "true";

  if (sessionUserIsGuest) {
    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 404 }
    );
  }
  try {
    const body: FormData = await request.json();
    const { placeDetails, category } = body;

    const errorInAddPlaceForm = validateAddPlaceFormData(
      placeDetails,
      category,
      sessionUserId
    );
    if (errorInAddPlaceForm) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: errorInAddPlaceForm,
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { userId: sessionUserId },
    });
    if (!user) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    const categoryInDB = await prisma.customCategories.findUnique({
      where: { name: category },
    });
    if (!categoryInDB) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Extract place data
    const placeData = extractPlaceData(placeDetails, user.id);

    // Check if profile already exists in this category
    const existingCategoryLink =
      await prisma.businessProfileCustomCategory.findFirst({
        where: {
          businessProfile: {
            profileId: placeData.profileId,
          },
          customCategoryId: categoryInDB.id,
        },
      });

    if (existingCategoryLink) {
      return NextResponse.json<FailedApiResponse>(
        {
          success: false,
          error: "Business profile already exists in this category.",
        },
        { status: 400 }
      );
    }

    // Generate Google photo URL if photo exists
    const googlePhotoUrl = placeDetails.photos?.length
      ? generateGooglePhotoUrl(placeDetails.photos[0].photo_reference)
      : null;

    // Create/Update business profile
    const businessProfile = await prisma.businessProfile.upsert({
      where: { profileId: placeData.profileId },
      update: {
        name: placeData.name,
        address: placeData.address,
        city: placeData.city,
        country: placeData.country,
        phone: placeData.phone,
        website: placeData.website,
        reviewValue: placeData.reviewValue,
        reviewAmount: placeData.reviewAmount,
      },
      create: {
        ...placeData,
        pfp: googlePhotoUrl || "",
      },
    });

    const businessCategoryLink =
      await prisma.businessProfileCustomCategory.create({
        data: {
          businessProfileId: businessProfile.id,
          customCategoryId: categoryInDB.id,
          upVotes: 0,
          downVotes: 0,
        },
      });

    // Handle Cloudinary upload - check both new Google URL and existing pfp
    let cloudinaryUrl: string | null = null;
    const currentPfp = businessProfile.pfp;
    const hasGooglePhotoUrl = googlePhotoUrl !== null;
    const hasExistingGoogleUrl = currentPfp && isGooglePhotoUrl(currentPfp);
    const hasCloudinaryUrl =
      currentPfp && currentPfp.includes("cloudinary.com");

    if ((hasGooglePhotoUrl || hasExistingGoogleUrl) && !hasCloudinaryUrl) {
      try {
        const publicId = `business_${businessProfile.profileId}_${Date.now()}`;
        const imageUrlToUpload = googlePhotoUrl || currentPfp;

        console.log(
          `Uploading to Cloudinary: ${
            hasGooglePhotoUrl ? "New" : "Existing"
          } Google photo URL`
        );

        cloudinaryUrl = await uploadImageToCloudinary(
          imageUrlToUpload,
          publicId
        );

        if (cloudinaryUrl) {
          await prisma.businessProfile.update({
            where: { id: businessProfile.id },
            data: { pfp: cloudinaryUrl },
          });

          console.log("Successfully migrated to Cloudinary URL");
        }
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary upload failed, keeping Google photo URL:",
          cloudinaryError
        );
      }
    } else if (hasCloudinaryUrl) {
      console.log("Business already has Cloudinary URL, skipping upload");
    }

    const includeRelations = {
      customCategories: {
        include: {
          customCategory: true,
        },
      },
    };

    const finalProfile = await prisma.businessProfile.findUnique({
      where: { id: businessProfile.id },
      include: includeRelations,
    });

    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message: `You added the ${placeData.name} in ${category}. `,
        data: finalProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create/update business profile:", error);

    return NextResponse.json<FailedApiResponse>(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
