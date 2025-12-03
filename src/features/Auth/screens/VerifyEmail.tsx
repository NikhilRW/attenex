import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthHeader } from "../components/AuthHeader";
import { FuturisticButton } from "../components/FuturisticButton";

/**
 * Verify Email Screen
 * 
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FuturisticBackground />

      <View style={styles.content}>
        {/* <AuthHeader
          title="Verify Your Email"
          logoSource={require("../../../../assets/images/logo-transparent.png")}
        /> */}

        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={64} color="#667eea" />
          </View>

          <Text style={styles.successTitle}>Check Your Inbox!</Text>

          <Text style={styles.successDescription}>
            We&apos;ve sent a verification email to your inbox.
            Please click the link in the email to verify your account.
          </Text>

          <Text style={styles.instructionText}>
            The verification link will expire in 24 hours.
            If you don&apos;t see the email, check your spam folder.
          </Text>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>What&apos;s next?</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <Text style={styles.tipText}>Open your email inbox</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <Text style={styles.tipText}>Click the verification link</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <Text style={styles.tipText}>Return here to sign in</Text>
            </View>
          </View>

          <FuturisticButton
            title="Back to Sign In"
            onPress={() => router.replace("/(auth)/sign-in")}
          />

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Need help?</Text>
            <Text style={styles.contactText}>
              Contact support if you don&apos;t receive the email
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
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
    paddingHorizontal: 20,
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -8,
  },
  tipsContainer: {
    backgroundColor: "rgba(102, 126, 234, 0.05)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginTop: 8,
    gap: 12,
  },
  tipsTitle: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tipText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    flex: 1,
  },
  helpContainer: {
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  helpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  contactText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    textAlign: "center",
  },
});

export default VerifyEmail;