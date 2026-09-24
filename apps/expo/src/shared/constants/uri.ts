export const BASE_URI = __DEV__
  ? // "https://sleeve-delivery-unloving.ngrok-free.dev"
    "http://localhost:5000"
  : process.env.EXPO_PUBLIC_PRODUCTION_BACKEND_URL;
export const ATTENEX_NOTIFICATION_IMAGE_URL =
  "https://attenex.vercel.app/notification-attachment.png";
