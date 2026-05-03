import http, { HttpResponse } from "@shared/utils/http";
import { logger } from "@shared/utils/logger";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

export const sendVerificationEmailRequest = async (email: string) => {
  return await http.post(`/api/users/send-verification-email`, {
    email,
  });
};

export const handleVerificationEmailResponse = async (
  response: HttpResponse<any>,
) => {
  try {
    if (response.data.success) {
      showMessage({
        message: "Verification Email Sent",
        description:
          "A verification email has been sent to your inbox. Please check your email to verify your account.",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
    } else {
      showMessage({
        message: "Error",
        description:
          response.data.message || "Failed to send verification email.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      router.replace("/sign-in");
    }
  } catch (error) {
    logger.error(
      "Could not send email :: sendVerificationEmail() :: email.ts : " + error,
    );
    showMessage({
      message: "Error",
      description: "An unexpected error occurred. Please try again later.",
      type: "danger",
      duration: 3000,
      position: "bottom",
    });
    router.replace("/sign-in");
  }
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
