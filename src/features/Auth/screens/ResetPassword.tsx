import {
  FuturisticButton,
  FuturisticInput,
  InvalidResetPasswordLink,
  PasswordRequirements,
  ResetPasswordFormHeader,
  VerifyingResetPasswordLink,
} from "@auth/components";
import { useResetPassword } from "@auth/hooks";
import { resetPasswordStyles as styles } from "@auth/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import React from "react";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

/**
 * Reset Password Screen
 *
 * Allows users to set a new password after clicking the reset link from email.
 * Validates the reset token before allowing password change.
 */
const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    newPassword,
    confirmPassword,
    userName,
    isVerifying,
    isValid,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useResetPassword();

  if (isVerifying) {
    return <VerifyingResetPasswordLink />;
  }

  if (!isValid) {
    return <InvalidResetPasswordLink />;
  }

  return (
    <View style={styles.container}>
      <FuturisticBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <ResetPasswordFormHeader userName={userName} />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="NEW PASSWORD"
                  placeholder="Create a strong password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showNewPassword}
                  onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                  secureTextEntry={!showNewPassword}
                  editable={!isSubmitting}
                  error={errors.newPassword?.message}
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
                  editable={!isSubmitting}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <PasswordRequirements
              password={newPassword}
              confirmPassword={confirmPassword}
            />

            <FuturisticButton
              title="Reset Password"
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;
