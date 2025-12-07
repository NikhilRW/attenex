import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AuthFooter } from "../components/AuthFooter";
import { AuthHeader } from "../components/AuthHeader";
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticDivider } from "../components/FuturisticDivider";
import { FuturisticInput } from "../components/FuturisticInput";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import {
  handleEmailSignUp,
  handleGoogleSignIn,
  handleLinkedInSignIn,
} from "../utils/common";
import { SignUpFormData, signUpSchema } from "../validation/authSchemas";
import { getStartingScreenPath } from "@/src/shared/utils/navigation";

const SignUp = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect to main stack if user is already authenticated (prevents showing auth screens)
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(getStartingScreenPath());
    }
  }, [authLoading, isAuthenticated]);

  // Initialize react-hook-form with Zod validation
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
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
            title="Create Account"
            logoSource={require("../../../../assets/images/logo-transparent.png")}
          />

          <SocialLoginButtons
            onGooglePress={handleGoogleSignIn}
            onLinkedInPress={handleLinkedInSignIn}
          />

          <FuturisticDivider text="OR REGISTER WITH EMAIL" />

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="FULL NAME"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.fullName?.message}
                />
              )}
            />

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
                  placeholder="Create a password"
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="CONFIRM PASSWORD"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  secureTextEntry={!showConfirmPassword}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <FuturisticButton
              title="Create Account"
              onPress={handleSubmit((data) => {
                Keyboard.dismiss();
                return handleEmailSignUp(data);
              })}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>

          <AuthFooter
            text="Already have an account? "
            linkText="Sign In"
            onLinkPress={() => router.push("/(auth)/sign-in")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop:60,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 24,
  },
});

export default SignUp;
