import { useState } from "react";
import { Keyboard } from "react-native";

import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";

import { mutationKeys } from "@/shared/constants/mutationKeys";
import { validateEmail } from "@auth/utils/email";
import http from "@shared/utils/http";
import { showMessage } from "@shared/utils/toasts";

export const useForgotPassword = () => {
  const emailParam = useLocalSearchParams().email;
  const [email, setEmail] = useState(() => (typeof emailParam === "string" ? emailParam : ""));
  const [emailSent, setEmailSent] = useState(false);

  const resetEmailMutation = useMutation({
    mutationFn: async (normalizedEmail: string) => {
      await http.post("/api/users/forgot-password", {
        email: normalizedEmail,
      });
    },
    mutationKey: mutationKeys.auth.sendForgotPasswordEmail,
    onSuccess: () => {
      setEmailSent(true);
      showMessage({
        message: "Email Sent!",
        description: "Check your inbox for the password reset link",
        type: "success",
        duration: 4000,
        position: "bottom",
      });
    },
    onError: (error: any) => {
      setEmailSent(false);
      const errorMessage =
        error.response?.data?.error || "Unable to send reset email. Please try again.";
      showMessage({
        message: "Request Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    },
  });

  const handleRequestReset = () => {
    if (!email.trim()) {
      showMessage({
        message: "Email Required",
        description: "Please enter your email address",
        type: "warning",
        duration: 2500,
        position: "bottom",
      });
      return;
    }

    if (!validateEmail(email)) {
      showMessage({
        message: "Invalid Email",
        description: "Please enter a valid email address",
        type: "warning",
        duration: 2500,
        position: "bottom",
      });
      return;
    }

    Keyboard.dismiss();
    resetEmailMutation.mutate(email.trim().toLowerCase());
  };

  const { isPending } = resetEmailMutation;

  const keyboard = useAnimatedKeyboard();

  // Animated style to add padding when keyboard is open
  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value + 50,
    };
  });

  return {
    handleRequestReset,
    email,
    setEmail,
    isPending,
    emailSent,
    animatedStyle,
    emailParam,
    setEmailSent,
  };
};
