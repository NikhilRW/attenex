import { mutationKeys } from "@/shared/constants/mutationKeys";
import { HttpResponse } from "@/shared/utils/http";
import { logger } from "@/shared/utils/logger";
import { defaultFaliureCount } from "@/shared/utils/tanstack";
import { handleEmailSignIn, handleGoogleSignIn } from "@auth/utils/common";
import { SignInFormData, signInSchema } from "@auth/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@shared/stores/authStore";
import { getStartingScreenPath } from "@shared/utils/navigation";
import { showMessage } from "@shared/utils/toasts";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { useShallow } from "zustand/shallow";

export const useSignIn = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const sendEmailMutation = useMutation<
    HttpResponse<any>,
    Error,
    string,
    unknown
  >({
    mutationKey: mutationKeys.auth.sendVerificationEmail,
    onSuccess: () => {
      showMessage({
        message: "Verification Email Sent",
        description:
          "A verification email has been sent to your inbox. Please check your email to verify your account.",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
    },
    onError: (error) => {
      logger.error(
        "Could not send verification email :: useSignIn.ts : " + error,
      );
      showMessage({
        message: "Error",
        description: "Unable to send verification email. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    },
  });

  const signInMutation = useMutation({
    mutationKey: mutationKeys.auth.signInEmail,
    mutationFn: handleEmailSignIn,
    retry: 3,
    retryDelay: defaultFaliureCount,
  });

  const googleSignInMutation = useMutation({
    mutationKey: mutationKeys.auth.signInGoogle,
    mutationFn: handleGoogleSignIn,
  });

  // Redirect to main stack if user is already authenticated
  const { isAuthenticated, isLoading: authLoading } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    })),
  );

  // Redirect to main stack if user is already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const path = getStartingScreenPath();
      if (path !== "/(auth)/sign-in") {
        router.replace(path);
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Show verification success message once
  useEffect(() => {
    if (params.verified === "true") {
      showMessage({
        message: "Email Verified",
        description: "Your email has been successfully verified.",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
      // Remove param to prevent toast on re-render/refocus
      router.setParams({ verified: undefined });
    }
  }, [params.verified, router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    Keyboard.dismiss();
    await signInMutation.mutateAsync({
      data,
      sendEmail: sendEmailMutation.mutateAsync,
    });
  };

  const handleGooglePress = async () => {
    await googleSignInMutation.mutateAsync();
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
    isSubmitting: isFormSubmitting || signInMutation.isPending,
    isAuthenticated,
    isGoogleLoading: googleSignInMutation.isPending,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleForgotPassword,
    handleSignUp,
    handleGooglePress,
  };
};
