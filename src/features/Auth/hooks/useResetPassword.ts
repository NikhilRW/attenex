import { BASE_URI } from "@/src/shared/constants/uri";
import http from "@/src/shared/utils/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../validation/authSchemas";

export const useResetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

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

  useEffect(() => {
    const verifyToken = async () => {
      const tokenParam = params.token as string;
      const emailParam = params.email as string;

      if (!tokenParam || !emailParam) {
        showMessage({
          message: "Invalid Link",
          description: "The reset link is invalid or incomplete",
          type: "danger",
          duration: 3000,
          position: "bottom",
        });
        setIsVerifying(false);
        return;
      }

      setToken(tokenParam);
      setEmail(emailParam);

      try {
        const response = await http.post(
          BASE_URI + "/api/users/verify-reset-token",
          {
            email: emailParam,
            token: tokenParam,
          }
        );

        setUserName(response.data.userName || "");
        setIsValid(true);
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
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [params.token, params.email]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      Keyboard.dismiss();

      await http.post(BASE_URI + "/api/users/reset-password", {
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
