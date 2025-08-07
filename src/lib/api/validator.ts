// Imports
import { rankingPhrases } from "../constants/rankingPhrases";

// Types
type CategoryFormData = (
  categoryPhrase: string,
  categoryKeyword: string
) => string | null;

// AddCategory Form Validator
export const categoryFormData: CategoryFormData = (
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
