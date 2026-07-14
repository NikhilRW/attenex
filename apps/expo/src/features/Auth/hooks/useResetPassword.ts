import { useState } from "react";
import { Keyboard } from "react-native";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import * as v from "valibot";

import { queryKeys } from "@/shared/constants/queryKeys";
import { StaleTime } from "@/shared/constants/tanstackConfig";
import {
  verifyResetTokenSuccessResponseSchema,
  resetPasswordSuccessResponseSchema,
} from "@attenex/api-contracts";
import { ResetPasswordFormData, resetPasswordSchema } from "@auth/validation/authSchemas";
import { mutationKeys } from "@shared/constants/mutationKeys";
import http from "@shared/utils/http";
import { showMessage } from "@shared/utils/toasts";

export const useResetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = typeof params.token === "string" ? params.token : "";
  const email = typeof params.email === "string" ? params.email : "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: valibotResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { confirmPassword, newPassword } = useWatch({
    control: control,
  });

  const verifyToken = async () => {
    if (!token || !email) {
      showMessage({
        message: "Invalid Link",
        description: "The reset link is invalid or incomplete",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      return { isValid: false, userName: "" };
    }

    try {
      const response = await http.post("/api/users/verify-reset-token", {
        email,
        token,
      });

      const parsed = v.safeParse(verifyResetTokenSuccessResponseSchema, response.data);

      if (parsed.success) {
        return { isValid: true, userName: parsed.output.userName };
      }

      return { isValid: false, userName: "" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "This reset link is invalid or has expired";

      showMessage({
        message: "Invalid Link",
        description: errorMessage,
        type: "danger",
        duration: 4000,
        position: "bottom",
      });
      return { isValid: false, userName: "" };
    }
  };

  const { data: resetTokenVerification, isFetching: isVerifying } = useQuery({
    queryFn: verifyToken,
    queryKey: queryKeys.auth.resetPassword(token, email),
    enabled: !!token && !!email,
    staleTime: StaleTime.SECONDS_3,
  });
  const isValid = resetTokenVerification?.isValid ?? false;
  const userName = resetTokenVerification?.userName ?? "";

  const resetPasswordMutation = useMutation({
    mutationKey: mutationKeys.auth.resetPassword,
    mutationFn: async (data: ResetPasswordFormData) => {
      const response = await http.post("/api/users/reset-password", {
        email: email,
        token: token,
        newPassword: data.newPassword,
      });

      const parsed = v.safeParse(resetPasswordSuccessResponseSchema, response.data);

      if (!parsed.success) {
        throw new Error("Invalid response from server");
      }
    },
    onSuccess: () => {
      showMessage({
        message: "Password Reset Successfully!",
        description: "You can now sign in with your new password",
        type: "success",
        duration: 3000,
        position: "bottom",
      });

      router.replace("/(auth)/sign-in");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Unable to reset password. Please try again.";

      showMessage({
        message: "Reset Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    Keyboard.dismiss();
    resetPasswordMutation.mutate(data);
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isFormSubmitting || resetPasswordMutation.isPending,
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
