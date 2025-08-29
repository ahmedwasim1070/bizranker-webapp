// Form Data
export type TagFormData = {
  userId: string;
  phrase: string;
  keyword: string;
};
// Form Error
export type TagFormError = {
  phrase: string | null;
  keyword: string | null;
};
