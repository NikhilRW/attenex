// For Testing Purposes
// export const BASE_URI = "http://localhost:5000";
// export const BASE_URI = "https://attenex-backend.up.railway.app";

export const BASE_URI = __DEV__
  ? "http://localhost:5000"
  : process.env.EXPO_PUBLIC_PRODUCTION_BACKEND_URL;
export const ATTENEX_NOTIFICATION_IMAGE_URL =
  "https://attenex.vercel.app/notification-attachment.png";
