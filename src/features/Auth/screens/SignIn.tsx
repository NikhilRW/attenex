import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AuthFooter } from "../components/AuthFooter";
import { AuthHeader } from "../components/AuthHeader";
import { AuthOptions } from "../components/AuthOptions";
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticDivider } from "../components/FuturisticDivider";
import { FuturisticInput } from "../components/FuturisticInput";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { styles } from "../styles/SignIn.styles";
import {
  handleEmailSignIn,
  handleGoogleSignIn,
  handleLinkedInSignIn,
} from "../utils/common";
import { SignInFormData, signInSchema } from "../validation/authSchemas";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect to main stack if user is already authenticated (prevents seeing signin screen)
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/(main)/role-selection");
    }
  }, [authLoading, isAuthenticated]);

  // Initialize react-hook-form with Zod validation
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

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log("Forgot password");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FuturisticBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Welcome Back !"
            logoSource={require("../../../../assets/images/logo-transparent.png")}
          />

          <SocialLoginButtons
            onGooglePress={handleGoogleSignIn}
            onLinkedInPress={handleLinkedInSignIn}
          />

          <FuturisticDivider text="OR ACCESS WITH EMAIL" />

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="EMAIL ADDRESS"
                  placeholder="name@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  error={errors.password?.message}
                />
              )}
            />

            <AuthOptions
              rememberMe={rememberMe}
              onToggleRememberMe={() => setRememberMe(!rememberMe)}
              onForgotPassword={handleForgotPassword}
            />

            <FuturisticButton
              title="Sign In"
              onPress={handleSubmit((data) => {
                Keyboard.dismiss();
                return handleEmailSignIn(data);
              })}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>

          <AuthFooter
            text="New to the platform? "
            linkText="Create Account"
            onLinkPress={() => router.push("/(auth)/sign-up")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
