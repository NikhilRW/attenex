import { User } from "@backend/config/database_setup";
import http from "@shared/utils/http";

/**
 * Service for handling LinkedIn OAuth related operations.
 * Centralizes the network call for exchanging code for tokens and user data.
 */
export const linkedinAuthService = {
  /**
   * Exchange authorization code with backend for user session (JWT token + user)
   */
  async exchangeCodeForUser(
    code: string,
    redirectUri: string
  ): Promise<{ user: User; token: string } | null> {
    try {
      const response = await http.post(`/api/users/signin?authType=linkedin`, {
        code,
        redirectUri,
      });

      const { user, token } = response.data;

      return { user, token };
    } catch (err: any) {
      // Log for debugging but let the caller handle user-facing errors
      console.error(
        "linkedinAuthService: exchangeCodeForUser failed",
        err.response?.data || err.message
      );

      // Re-throw with parsed error for better error messages upstream
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error);
      } else if (err.message?.includes("Network Error")) {
        throw new Error(
          "Unable to connect. Please check your internet connection."
        );
      }

      throw err;
    }
  },
};
