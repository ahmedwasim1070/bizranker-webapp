// Location Data Payload
export type LocationDataContext = {
  country: string;
  countryCode: string;
  capital: string;
  defaultCity?: string;
};

// API response
export type SuccessApiResponse = {
  success: true;
  message: string;
  data: any;
};
export type FailedApiResponse = {
  success: false;
  error: string;
};
