// Session
export type SessionData = {
  name?: string | null;
  email?: string | null;
  isAuthenticated: boolean;
};
// Location Data Payload
export type LocationData = {
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
