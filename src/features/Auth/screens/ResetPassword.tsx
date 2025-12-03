import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { http } from "@/src/shared/utils/http";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { AuthHeader } from "../components/AuthHeader";
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticInput } from "../components/FuturisticInput";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../validation/authSchemas";
import { BASE_URI } from "@/src/shared/constants/uri";

/**
 * Reset Password Screen
 *
 * Allows users to set a new password after clicking the reset link from email.
 * Validates the reset token before allowing password change.
 */
const ResetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Initialize react-hook-form with Zod validation
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch password fields for validation indicators
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const tokenParam = params.token as string;
      const emailParam = params.email as string;

      if (!tokenParam || !emailParam) {
        showMessage({
          message: "Invalid Link",
          description: "The reset link is invalid or incomplete",
          type: "danger",
          duration: 3000,
          position: "bottom",
        });
        setIsVerifying(false);
        return;
      }

      setToken(tokenParam);
      setEmail(emailParam);

      try {
        const response = await http.post(
          BASE_URI + "/api/users/verify-reset-token",
          {
            email: emailParam,
            token: tokenParam,
          }
        );

        setUserName(response.data.userName || "");
        setIsValid(true);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          "This reset link is invalid or has expired";

        showMessage({
          message: "Invalid Link",
          description: errorMessage,
          type: "danger",
          duration: 4000,
          position: "bottom",
        });
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [params]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    let response;
    try {
      Keyboard.dismiss();

      response = await http.post(BASE_URI + "/api/users/reset-password", {
        email: email,
        token: token,
        newPassword: data.newPassword,
      });

      showMessage({
        message: "Password Reset Successfully!",
        description: "You can now sign in with your new password",
        type: "success",
        duration: 3000,
        position: "bottom",
      });

      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      if (response?.data.message === undefined) {
        const errorMessage =
          error.response?.data?.error ||
          "Unable to reset password. Please try again.";

        showMessage({
          message: "Reset Failed",
          description: errorMessage,
          type: "danger",
          duration: 3000,
          position: "bottom",
        });
      }
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <FuturisticBackground />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Verifying reset link...</Text>
        </View>
      </View>
    );
  }

  if (!isValid) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <FuturisticBackground />
        <View style={styles.errorContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle-outline" size={64} color="#ff6b6b" />
          </View>
          <Text style={styles.errorTitle}>Invalid Reset Link</Text>
          <Text style={styles.errorDescription}>
            This password reset link is invalid or has expired. Reset links are
            only valid for 1 hour.
          </Text>
          <FuturisticButton
            title="Request New Link"
            onPress={() => router.replace("/forgot-password")}
          />
          <FuturisticButton
            title="Back to Sign In"
            onPress={() => router.replace("/sign-in")}
          />
        </View>
      </View>
    );
  }

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
          {/* <AuthHeader
            title="Create New Password"
            logoSource={require("../../../../assets/images/logo-transparent.png")}
          /> */}

          <View style={styles.formContainer}>
            {userName && <Text style={styles.greeting}>Hi {userName}!</Text>}
            <Text style={styles.description}>
              Enter your new password below. Make it strong and memorable.
            </Text>

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

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    newPassword.length >= 8
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    newPassword.length >= 8
                      ? "#4ade80"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text style={styles.requirementText}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    /(?=.*[A-Z])/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    /(?=.*[A-Z])/.test(newPassword)
                      ? "#4ade80"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text style={styles.requirementText}>One uppercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    /(?=.*[a-z])/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    /(?=.*[a-z])/.test(newPassword)
                      ? "#4ade80"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text style={styles.requirementText}>One lowercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    /(?=.*\d)/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    /(?=.*\d)/.test(newPassword)
                      ? "#4ade80"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text style={styles.requirementText}>One number</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    newPassword && newPassword === confirmPassword
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    newPassword && newPassword === confirmPassword
                      ? "#4ade80"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text style={styles.requirementText}>Passwords match</Text>
              </View>
            </View>

            <FuturisticButton
              title="Reset Password"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  errorTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  errorDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  formContainer: {
    gap: 24,
  },
  greeting: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  requirementsContainer: {
    backgroundColor: "rgba(102, 126, 234, 0.05)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  requirementsTitle: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  requirementText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
});

export default ResetPassword;
