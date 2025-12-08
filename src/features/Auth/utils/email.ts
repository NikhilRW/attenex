import { BASE_URI } from "@/src/shared/constants/uri";
import { logger } from "@/src/shared/utils/logger";
import axios from "axios";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

export const sendVerificationEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${BASE_URI}/api/users/send-verification-email`,
      {
        email,
      }
    );
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
      "Could not send email :: sendVerificationEmail() :: email.ts : " + error
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
