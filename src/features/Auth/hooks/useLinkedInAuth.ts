import { mutationKeys } from "@/shared/constants/mutationKeys";
import { linkedinAuthService } from "@auth/services/linkedinAuthService";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { subscribeToClassName } from "@shared/utils/fcm";
import { logger } from "@shared/utils/logger";
import { getStartingScreenPath } from "@shared/utils/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import WebView from "react-native-webview";
import {
  ShouldStartLoadRequest,
  WebViewNavigation,
} from "react-native-webview/lib/WebViewTypes";

const LINKEDIN_CLIENT_ID = process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || "";
const REDIRECT_URI = process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI || "";
const LINKEDIN_SCOPE = "openid profile email"; // Required scopes for user authentication

export const useLinkedInAuth = () => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout, deleteAccount } = useLocalSearchParams();
  const queryClient = useQueryClient();

  // Logout And DeleteAccount Part.
  const isLogout = logout === "true";
  const isDeleteAccount = deleteAccount === "true";

  const logoutDeleteAccountMutation = useMutation({
    mutationKey: mutationKeys.auth.logoutDeleteLinkedin,
    mutationFn: async (action: "logout" | "delete-account") => {
      if (action === "logout") {
        await authService.logout();
      }
      if (action === "delete-account") {
        await authService.deleteUserAccount();
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      logger.error("useLinkedInAuth.ts () :: " + error);
      showMessage({
        message: isLogout ? "Logout" : "Delete Account" + "operation failed",
        position: "bottom",
        type: "danger",
        duration: 2000,
        description: error.message,
      });
    },
  });

  const handleLinkedInLogout = async (event: WebViewNavigation) => {
    if (
      event.url.includes("/home") ||
      event.url.includes("/session_redirect") ||
      event.url.includes("login")
    ) {
      if (isLogout || isDeleteAccount) {
        await logoutDeleteAccountMutation.mutateAsync(
          isLogout ? "logout" : "delete-account",
        );
        router.replace("/sign-in");
      }
    }
  };

  const linkedInAuthUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(LINKEDIN_SCOPE)}`;

  const authMutation = useMutation({
    mutationKey: mutationKeys.auth.signInLinkedIn,
    mutationFn: async (url: string) => {
      setIsLoading(true);
      // Extract the authorization code from URL query parameters
      const authCode = new URL(url).searchParams.get("code");

      if (!authCode) {
        throw new Error("Authentication failed. Please try again.");
      }

      logger.info("LinkedIn auth code received", "LinkedInAuth");

      const exchange = await linkedinAuthService.exchangeCodeForUser(
        authCode,
        REDIRECT_URI,
      );

      if (!exchange)
        throw new Error("Unable to complete sign-in. Please try again.");

      return exchange;
    },
    onSuccess: async (data) => {
      const { user, token } = data;

      // Store user data and JWT token using the auth hook
      await authService.login(user, token);

      if (user.className && user.role === "student") {
        // Runnning In The Background
        subscribeToClassName(user.className);
      }

      // Show success feedback to user
      showMessage({
        message: "Sign-in Successful!",
        description: `Welcome, ${user.name}`,
        type: "success",
        duration: 2500,
        position: "bottom",
      });

      logger.info(
        `LinkedIn sign-in successful for user: ${user.email}`,
        "LinkedInAuth",
      );

      // Navigate to role selection screen (next step in user onboarding)
      useAuthStore.subscribe((newState, prevState) => {
        if (newState.user && prevState.user === null) {
          router.replace(getStartingScreenPath());
        }
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      const err = error as any;

      // Extract user-friendly error message
      let errorMessage = "Unable to sign in. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (
        err.message?.includes("Network Error") ||
        err.message?.includes("connect")
      ) {
        errorMessage =
          "Unable to connect. Please check your internet connection.";
      } else if (
        err.message &&
        !err.message.includes("Object") &&
        !err.message.includes("undefined")
      ) {
        errorMessage = err.message;
      }

      // Show error feedback to user
      showMessage({
        message: "Sign-in Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });

      logger.error(
        JSON.stringify(err.response?.data || err.message),
        "LinkedInAuth :: handleAuthCallback()",
      );

      // Return to sign-in screen on any error
      router.back();
    },
  });

  const handleNavigationStateChange = (event: ShouldStartLoadRequest) => {
    const { url } = event;

    // Check if this is our redirect URL containing the authorization code
    if (url.startsWith(REDIRECT_URI) && url.includes("code=")) {
      authMutation.mutateAsync(url);
      return false; // Block navigation to keep user in app
    }

    // Check for OAuth errors (user denied access, invalid request, etc.)
    if (url.includes("error=")) {
      const error = new URL(url).searchParams.get("error_description");
      showMessage({
        message: "Sign-in Cancelled",
        description: error || "You cancelled the LinkedIn sign-in",
        type: "warning",
        duration: 3000,
        position: "bottom",
      });
      router.back(); // Return to sign-in screen
      return false;
    }

    return true; // Allow normal navigation within LinkedIn's domain
  };

  return {
    handleLinkedInLogout,
    handleNavigationStateChange,
    webViewRef,
    linkedInAuthUrl,
    isLoading,
    isLogout,
    isDeleteAccount,
    setIsLoading,
  };
};
