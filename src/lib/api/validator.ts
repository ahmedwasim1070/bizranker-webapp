// Imports
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { rankingPhrases } from "../constants/rankingPhrases";

// Types
type ValidateCategoryFormData = (
  categoryPhrase: string,
  categoryKeyword: string,
  userId: string
) => string | null;
type ValidateAddPlaceFormData = (
  placeDetails: any,
  category: string,
  userId: string
) => string | null;
type ValidateCategory = (category: string) => Promise<string | null>;
type ValidateCords = (lat: string, lng: string) => string | null;

// AddCategory Form Validator
export const validateCategoryFormData: ValidateCategoryFormData = (
  categoryPhrase,
  categoryKeyword,
  userId
) => {
  if (!rankingPhrases.includes(categoryPhrase)) {
    return "Invalid Form Data.";
  }

  if (
    categoryKeyword.length < 3 &&
    categoryKeyword.length > 20 &&
    typeof categoryKeyword === "string"
  ) {
    return "Invalid Form Data.";
  }

  if (!userId || typeof userId !== "string") {
    return "Invalid Form Data.";
  }

  return null;
};

// Validate AddPlace Form
export const validateAddPlaceFormData: ValidateAddPlaceFormData = (
  placeDetails,
  category,
  userId
) => {
  if (
    !placeDetails ||
    !placeDetails.place_id ||
    typeof placeDetails.place_id !== "string"
  ) {
    return "Invalid Form Data.";
  }

  if (!category || typeof category !== "string") {
    return "Invalid Form Data.";
  }

  if (!userId || typeof userId !== "string") {
    return "Invalid Form Data.";
  }

  return null;
};

// Validate category
export const validateCategory: ValidateCategory = async (category) => {
  if (!category || typeof category !== "string") {
    return "Category is Required.";
  }

  if (category === "all") return null;

  try {
    const res = await fetch("/api/fetchCategories");
    if (!res.ok) {
      const errData = (await res.json()) as FailedApiResponse;
      throw new Error(`Error , ${errData.error}`);
    }

    const data = (await res.json()) as SuccessApiResponse;
    const allCategoriesInDb = data.data;

    if (!allCategoriesInDb.includes(category)) {
      return "Invalid Category.";
    }

    return null;
  } catch (err) {
    return null;
  }
};

// Validate Latitude and Longitude
export const validateCords: ValidateCords = (lat, lng) => {
  if (!lat || !lng) {
    return "Latitude and Longitude are Required.";
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return "Invalid Latitude or Longitude format.";
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return "Latitude must be between -90 and 90, Longitude between -180 and 180.";
  }

  return null;
};
