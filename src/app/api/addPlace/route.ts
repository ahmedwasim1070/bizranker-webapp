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
    website: placeDetails.website || "",
    reviewValue: parseFloat(placeDetails.rating) || 0,
    reviewAmount: parseInt(placeDetails.user_ratings_total) || 0,
    addedById: userId,
  };
}

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
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { userId },
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

    // Handle category validation (skip if category is "all")
    let categoryInDB = null;
    if (category !== "all") {
      categoryInDB = await prisma.customCategories.findUnique({
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
    }

    // Extract place data
    const placeData = extractPlaceData(placeDetails, user.id);

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

    // Create category link only if category is not "all"
    let businessCategoryLink = null;
    if (category !== "all" && categoryInDB) {
      businessCategoryLink = await prisma.businessProfileCustomCategory.upsert({
        where: {
          businessProfileId_customCategoryId: {
            businessProfileId: businessProfile.id,
            customCategoryId: categoryInDB.id,
          },
        },
        update: {}, // No updates needed if relationship exists
        create: {
          businessProfileId: businessProfile.id,
          customCategoryId: categoryInDB.id,
          upVotes: 0,
          downVotes: 0,
        },
      });
    }

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
        // Prefer new Google URL over existing one
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
          // Update database with Cloudinary URL
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

    // Prepare response data
    const finalPfpUrl = cloudinaryUrl || businessProfile.pfp;
    const responseData: any = {
      businessProfile: {
        ...businessProfile,
        pfp: finalPfpUrl,
      },
      imageUpload: {
        googlePhotoUrl,
        cloudinaryUrl,
        existingUrl: businessProfile.pfp,
        finalUrl: finalPfpUrl,
        uploadSuccess: !!cloudinaryUrl,
        wasGoogleUrlMigrated: !googlePhotoUrl && !!cloudinaryUrl,
      },
    };

    // Add category link to response only if it exists
    if (businessCategoryLink) {
      responseData.categoryLink = businessCategoryLink;
    }

    // Determine success message based on category type
    const message =
      category === "all"
        ? "Successfully added the place globally."
        : `Successfully added the place to category: ${category}.`;

    // Return success response
    return NextResponse.json<SuccessApiResponse>(
      {
        success: true,
        message,
        data: responseData,
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
