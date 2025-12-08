import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FuturisticButton } from "../components/FuturisticButton";
import { showMessage } from "react-native-flash-message";
import { sendVerificationEmail } from "../utils/email";

/**
 * Verify Email Screen
 *
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, mode } = useTheme();

  useEffect(() => {
    (async () => {
      if (params.email) {
        await sendVerificationEmail(params.email as string);
      }
    })();
  }, [params.email]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <FuturisticBackground />

      <View style={styles.content}>
        {/* <AuthHeader
          title="Verify Your Email"
          logoSource={require("../../../../assets/images/logo-transparent.png")}
        /> */}

        <View style={styles.successContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primary.glow },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={64}
              color={colors.primary.main}
            />
          </View>

          <Text style={[styles.successTitle, { color: colors.text.primary }]}>
            Check Your Inbox!
          </Text>

          <Text
            style={[
              styles.successDescription,
              { color: colors.text.secondary },
            ]}
          >
            We&apos;ve sent a verification email to your inbox. Please click the
            link in the email to verify your account.
          </Text>

          <Text style={[styles.instructionText, { color: colors.text.muted }]}>
            The verification link will expire in 24 hours. If you don&apos;t see
            the email, check your spam folder.
          </Text>

          {/* <View style={styles.tipsContainer}>
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
          </View> */}

          <FuturisticButton
            title="Back to Sign In"
            onPress={() => router.replace("/(auth)/sign-in")}
          />

          <View style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: colors.text.secondary }]}>
              Need help?
            </Text>
            <Text style={[styles.contactText, { color: colors.text.muted }]}>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  successDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -8,
  },
  helpContainer: {
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "600",
  },
  contactText: {
    fontSize: 13,
    textAlign: "center",
  },
});

export default VerifyEmail;
