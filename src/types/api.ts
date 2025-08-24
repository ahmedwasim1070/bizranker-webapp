// Api response type
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message?: string };

// City response type
export type CitiesResponse = {
  name: string;
  lat: number;
  lng: number;
};

// Country response type
export type CountryResponse = {
  country: string;
  countryCode: string;
  capital: string;
  lat: number;
  lng: number;
};
