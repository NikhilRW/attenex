import {
  AuthFooter,
  AuthHeader,
  AuthOptions,
  FuturisticButton,
  FuturisticDivider,
  FuturisticInput,
  SocialLoginButtons,
} from "@auth/components";
import { useSignIn } from "@auth/hooks";
import { signInStyles as styles } from "@auth/styles";
import { handleGoogleSignIn, handleLinkedInSignIn } from "@auth/utils";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { LOGO_TRANSPARENT_IMAGE } from "@auth/constants";

const SignIn = () => {
  const { colors, isDark } = useTheme();
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isAuthenticated,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleForgotPassword,
    handleSignUp,
  } = useSignIn();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
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
            logoSource={LOGO_TRANSPARENT_IMAGE}
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
              onPress={handleSubmit}
              disabled={isSubmitting || isAuthenticated}
              loading={isSubmitting}
            />
          </View>

          <AuthFooter
            text="New to the platform? "
            linkText="Create Account"
            onLinkPress={handleSignUp}
          />
          {/* Implementing PCKE For Now. */}
          {/* <LinkedInAuthComponent
            authType={authType}
            isLinkedInModalVisible={isLinkedInModalVisible}
            setIsLinkedInModalVisible={setIsLinkedInModalVisible}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
