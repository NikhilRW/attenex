import { View, Text } from "react-native";
import React from "react";
import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/ResetPassword.styles";
import { FuturisticButton } from "../components/FuturisticButton";
import { useRouter } from "expo-router";

const InvalidResetPasswordLink = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <FuturisticBackground />
      <View style={styles.errorContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.status.error + "20" },
          ]}
        >
          <Ionicons
            name="close-circle-outline"
            size={64}
            color={colors.status.error}
          />
        </View>
        <Text style={[styles.errorTitle, { color: colors.text.primary }]}>
          Invalid Reset Link
        </Text>
        <Text
          style={[styles.errorDescription, { color: colors.text.secondary }]}
        >
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
};

export default InvalidResetPasswordLink;
