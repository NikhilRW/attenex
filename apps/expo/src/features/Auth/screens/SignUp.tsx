import AuthFooter from "@auth/components/common/AuthFooter";
import AuthHeader from "@auth/components/common/AuthHeader";
import FuturisticButton from "@auth/components/common/FuturisticButton";
import FuturisticDivider from "@auth/components/common/FuturisticDivider";
import FuturisticInput from "@auth/components/common/FuturisticInput";
import SocialLoginButtons from "@auth/components/common/SocialLoginButtons";
import { useSignUp } from "@auth/hooks/useSignUp";
import { styles } from "@auth/styles/SignUp.styles";
import { handleLinkedInSignIn } from "@auth/utils/common";
import React from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const SignUp = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isGoogleLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSignIn,
    handleGooglePress,
  } = useSignUp();

  return (
    <View style={styles.container}>
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
            onGooglePress={handleGooglePress}
            onLinkedInPress={handleLinkedInSignIn}
            isGoogleLoading={isGoogleLoading}
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
