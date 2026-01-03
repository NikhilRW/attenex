import { validateEmail } from "@auth/utils/email";
import http from "@shared/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const emailParam = useLocalSearchParams().email;

  const sendEmail = async () => {
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

    try {
      Keyboard.dismiss();

      const res = await http.post("/api/users/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      console.log(res.data);

      setEmailSent(true);

      showMessage({
        message: "Email Sent!",
        description: "Check your inbox for the password reset link",
        type: "success",
        duration: 4000,
        position: "bottom",
      });

      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Unable to send reset email. Please try again.";

      showMessage({
        message: "Request Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      return undefined;
    }
  };

  const { isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["forgot-password"] as any,
    enabled: false,
    queryFn: sendEmail,
  });

  const keyboard = useAnimatedKeyboard();

  // Animated style to add padding when keyboard is open
  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value + 50,
    };
  });

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam as string);
      setEmailSent(isSuccess);
    }
  }, [emailParam, isSuccess]);

  const handleRequestReset = async () => {
    await refetch();
  };

  return {
    handleRequestReset,
    email,
    setEmail,
    isLoading,
    emailSent,
    animatedStyle,
    emailParam,
    setEmailSent,
  };
};
