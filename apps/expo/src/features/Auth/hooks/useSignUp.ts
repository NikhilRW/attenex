import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";

import { mutationKeys } from "@/shared/constants/mutationKeys";
import { handleEmailSignUp, handleGoogleSignIn } from "@auth/utils/common";
import { SignUpFormData, signUpSchema } from "@auth/validation/authSchemas";
import { useAuthStore } from "@shared/stores/authStore";
import { getStartingScreenPath } from "@shared/utils/navigation";

export const useSignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLinkedInModalVisible, setIsLinkedInModalVisible] = useState(false);
  const signUpMutation = useMutation({
    mutationKey: mutationKeys.auth.signUpEmail,
    mutationFn: handleEmailSignUp,
  });
  const googleSignInMutation = useMutation({
    mutationKey: mutationKeys.auth.signInGoogle,
    mutationFn: handleGoogleSignIn,
  });

  // Redirect to main stack if user is already authenticated
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(getStartingScreenPath());
    }
  }, [authLoading, isAuthenticated, router]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<SignUpFormData>({
    resolver: valibotResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignUp = async (data: SignUpFormData) => {
    Keyboard.dismiss();
    await signUpMutation.mutateAsync(data);
  };

  const handleGooglePress = async () => {
    await googleSignInMutation.mutateAsync();
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return {
    control,
    handleSubmit: handleSubmit(onSignUp),
    errors,
    isSubmitting: isFormSubmitting || signUpMutation.isPending,
    isGoogleLoading: googleSignInMutation.isPending,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSignIn,
    handleGooglePress,
    isLinkedInModalVisible,
    setIsLinkedInModalVisible,
  };
};
