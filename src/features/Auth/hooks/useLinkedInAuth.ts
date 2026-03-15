import { mutationKeys } from "@/shared/constants/mutationKeys";
import { linkedinAuthService } from "@auth/services/linkedinAuthService";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { subscribeToClassName } from "@shared/utils/fcm";
import { logger } from "@shared/utils/logger";
import { getStartingScreenPath } from "@shared/utils/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

const REDIRECT_URI = process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI || "";

export const useLinkedInAuth = () => {
  const router = useRouter();
  const { logout, deleteAccount } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(true);

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

  const handleLinkedInLogout = async () => {
    await logoutDeleteAccountMutation.mutateAsync(
      isLogout ? "logout" : "delete-account",
    );
    router.replace("/sign-in");
  };

  const { mutateAsync: linkedInLogin } = useMutation({
    mutationKey: mutationKeys.auth.signInLinkedIn,
    mutationFn: async (authCode: string) => {
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

  const handleSuccess = async (authCode: string) => {
    await linkedInLogin(authCode);
  };

  const errorHandler = (error: Error) => {
    showMessage({
      message: "Sign-in Cancelled",
      description: error.message || "You cancelled the LinkedIn sign-in",
      type: "warning",
      duration: 3000,
      position: "bottom",
    });
    router.back();
  };

  return {
    handleLinkedInLogout,
    isLogout,
    isDeleteAccount,
    errorHandler,
    handleSuccess,
    isVisible,
    setIsVisible,
  };
};
