import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
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
import { getStartingScreenPath } from "@/src/shared/utils/navigation";
import { secureStore } from "@/src/shared/utils/secureStore";

const SignIn = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const params = useLocalSearchParams();

  // Redirect to main stack if user is already authenticated (prevents seeing signin screen)
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  useEffect(() => {
    if (!authLoading && isAuthenticated && !params.loggedOut) {
      router.replace(getStartingScreenPath());
    }
    if (params.verified === "true") {
      // Show success message for email verification
      showMessage({
        message: "Email Verified",
        description: "Your email has been successfully verified.",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
    }
    if (params.loggedOut === "true") {
      const main = async () => {
        secureStore.removeItem("jwt");
      };
      main();
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  }, [authLoading, isAuthenticated, params.loggedOut, params.verified, router]);

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
    router.push("/forgot-password");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
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
              title="Sign In "
              onPress={handleSubmit(async (data) => {
                Keyboard.dismiss();
                return await handleEmailSignIn(data);
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
