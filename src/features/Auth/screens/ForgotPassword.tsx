import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { http } from "@/src/shared/utils/http";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { AuthHeader } from "../components/AuthHeader";
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticInput } from "../components/FuturisticInput";
import { BASE_URI } from "@/src/shared/constants/uri";
/**
 * Forgot Password Screen
 *
 * Allows users to request a password reset link via email.`
 * The link will open the app with the reset password screen.
 */
const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestReset = async () => {
    if (!email.trim()) {
      showMessage({
        message: "Email Required",
        description: "Please enter your email address",
        type: "warning",
        duration: 2500,
        position: "bottom",
      });
      return;
    }

    if (!validateEmail(email)) {
      showMessage({
        message: "Invalid Email",
        description: "Please enter a valid email address",
        type: "warning",
        duration: 2500,
        position: "bottom",
      });
      return;
    }

    try {
      setIsLoading(true);
      Keyboard.dismiss();

      await http.post(BASE_URI + "/api/users/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setEmailSent(true);

      showMessage({
        message: "Email Sent!",
        description: "Check your inbox for the password reset link",
        type: "success",
        duration: 4000,
        position: "bottom",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Unable to send reset email. Please try again.";

      showMessage({
        message: "Request Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const keyboard = useAnimatedKeyboard();

  // Animated style to add padding when keyboard is open
  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value + 50,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FuturisticBackground />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {emailSent === false && (
            <AuthHeader
              title="Forgot Password"
              logoSource={require("../../../../assets/images/logo-transparent.png")}
            />
          )}

          {emailSent ? (
            <View style={styles.successContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={64} color="#667eea" />
              </View>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successDescription}>
                We've sent a password reset link to{" "}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
              <Text style={styles.instructionText}>
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </Text>

              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>Didn't receive the email?</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEmailSent(false);
                    handleRequestReset();
                  }}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>Resend Email</Text>
                </TouchableOpacity>
              </View>

              <FuturisticButton
                title="Back to Sign In"
                onPress={() => router.replace("/(auth)/sign-in")}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              <FuturisticInput
                label="EMAIL ADDRESS"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              <FuturisticButton
                title="Send Reset Link"
                onPress={handleRequestReset}
                disabled={isLoading}
                loading={isLoading}
              />
              <TouchableOpacity
                style={styles.backToSignIn}
                onPress={() => router.back()}
              >
                <Text style={styles.backToSignInText}>
                  Remember your password?{" "}
                  <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    gap: 24,
  },
  description: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  backToSignIn: {
    alignItems: "center",
    marginTop: 8,
  },
  backToSignInText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  signInLink: {
    color: "#667eea",
    fontWeight: "700",
  },
  successContainer: {
    gap: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  successTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  successDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  emailText: {
    color: "#667eea",
    fontWeight: "700",
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: -8,
  },
  helpContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  helpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ForgotPassword;
