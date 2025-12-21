import { useAuthStore } from "@/src/shared/stores/authStore";
import { getStartingScreenPath } from "@/src/shared/utils/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { handleEmailSignUp } from "../utils/common";
import { SignUpFormData, signUpSchema } from "../validation/authSchemas";

export const useSignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect to main stack if user is already authenticated
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(getStartingScreenPath());
    }
  }, [authLoading, isAuthenticated]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignUp = async (data: SignUpFormData) => {
    Keyboard.dismiss();
    return await handleEmailSignUp(data);
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return {
    control,
    handleSubmit: handleSubmit(onSignUp),
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSignIn,
  };
};
