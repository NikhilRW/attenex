export const LINKEDIN_CONFIG = {
  CLIENT_ID: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || "",
  CLIENT_SECRET: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI || "",
};

export const LINKEDIN_LOGOUT_REDIRECT_URI = "https://www.linkedin.com/m/logout";
