// Type
type validateCategory = (category: string) => Promise<number | null>;

// Category Validator
export const validateCategory: validateCategory = async (category) => {
  if (!category || typeof category !== "string") {
    return null;
  }

  if (category === "all") {
    return 0;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/fetchCategories`
    );
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const storedCategories = data.data;
    if (!storedCategories || storedCategories.length === 0) {
      return null;
    }

    const found = storedCategories.find(
      (storedCategory: any) => storedCategory.name === category
    );
    return found ? found.id : null;
  } catch (error) {
    console.error("Error in validateCategory , ", error);
    return null;
  }
};
