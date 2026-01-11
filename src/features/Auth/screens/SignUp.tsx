import {
  AuthFooter,
  AuthHeader,
  FuturisticButton,
  FuturisticDivider,
  FuturisticInput,
  SocialLoginButtons,
} from "@auth/components";
import { useSignUp } from "@auth/hooks";
import { signUpStyles as styles } from "@auth/styles";
import { handleGoogleSignIn, handleLinkedInSignIn } from "@auth/utils";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const SignUp = () => {
  const { colors, isDark } = useTheme();
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSignIn,
  } = useSignUp();

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
            title="Create Account"
            logoSource={require("@assets/images/logo-transparent.png")}
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
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>

          <AuthFooter
            text="Already have an account? "
            linkText="Sign In"
            onLinkPress={handleSignIn}
          />
          {/* For PCKE Testing */}
          {/* <LinkedInAuthComponent
            authType="login"
            isLinkedInModalVisible={isLinkedInModalVisible}
            setIsLinkedInModalVisible={setIsLinkedInModalVisible}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
