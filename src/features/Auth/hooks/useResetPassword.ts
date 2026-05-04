import { queryKeys } from "@/shared/constants/queryKeys";
import { StaleTime } from "@/shared/constants/tanstackConfig";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@auth/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import http from "@shared/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";

export const useResetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = typeof params.token === "string" ? params.token : "";
  const email = typeof params.email === "string" ? params.email : "";
  const [userName, setUserName] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const verifyToken = async () => {
    if (!token || !email) {
      showMessage({
        message: "Invalid Link",
        description: "The reset link is invalid or incomplete",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      return false;
    }

    try {
      const response = await http.post("/api/users/verify-reset-token", {
        email,
        token,
      });

      setUserName(response.data.userName || "");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "This reset link is invalid or has expired";

      showMessage({
        message: "Invalid Link",
        description: errorMessage,
        type: "danger",
        duration: 4000,
        position: "bottom",
      });
      return false;
    }
  };

  const { data: isValid, isFetching: isVerifying } = useQuery({
    queryFn: verifyToken,
    queryKey: queryKeys.auth.resetPassword(token, email),
    enabled: !!token && !!email,
    staleTime: StaleTime.SECONDS_3,
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      Keyboard.dismiss();

      await http.post("/api/users/reset-password", {
        email: email,
        token: token,
        newPassword: data.newPassword,
      });

      showMessage({
        message: "Password Reset Successfully!",
        description: "You can now sign in with your new password",
        type: "success",
        duration: 3000,
        position: "bottom",
      });

      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Unable to reset password. Please try again.";

      showMessage({
        message: "Reset Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    newPassword,
    confirmPassword,
    userName,
    isVerifying,
    isValid,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    router,
  };
};
