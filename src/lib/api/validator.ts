// Imports
import { FailedApiResponse, SuccessApiResponse } from "@/types";
import { rankingPhrases } from "../constants/rankingPhrases";

// Types
type ValidateCategoryFormData = (
  categoryPhrase: string,
  categoryKeyword: string
) => string | null;
type ValidateCategory = (category: string) => Promise<string | null>;

// AddCategory Form Validator
export const validateCategoryFormData: ValidateCategoryFormData = (
  categoryPhrase,
  categoryKeyword
) => {
  if (
    !rankingPhrases.includes(categoryPhrase) ||
    (categoryKeyword.length < 3 &&
      categoryKeyword.length > 20 &&
      typeof categoryKeyword === "string")
  ) {
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
    const res = await fetch("/api/fetchedCategories");
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
