import { handleEmailSignIn } from "@auth/utils/common";
import { SignInFormData, signInSchema } from "@auth/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@shared/stores/authStore";
import { getStartingScreenPath } from "@shared/utils/navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useShallow } from "zustand/shallow";

export const useSignIn = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect to main stack if user is already authenticated
  const { isAuthenticated, isLoading: authLoading } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    }))
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const path = getStartingScreenPath();
      if (path !== "/(auth)/sign-in") {
        router.replace(path);
      }
    }
    if (params.verified === "true") {
      showMessage({
        message: "Email Verified",
        description: "Your email has been successfully verified.",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
    }
  }, [authLoading, isAuthenticated, params.verified,router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    Keyboard.dismiss();
    return await handleEmailSignIn(data);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/(auth)/sign-up");
  };

  return {
    control,
    handleSubmit: handleSubmit(onSignIn),
    errors,
    isSubmitting,
    isAuthenticated,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleForgotPassword,
    handleSignUp,
  };
};
