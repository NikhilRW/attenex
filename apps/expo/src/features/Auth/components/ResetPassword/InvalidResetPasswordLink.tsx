import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { withUnistyles } from "react-native-unistyles";

import FuturisticButton from "@auth/components/common/FuturisticButton";
import { styles } from "@auth/styles/ResetPassword.styles";

const ErrorIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.status.error,
}));

const InvalidResetPasswordLink = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* AGENT: Add here correct styles */}
      <View style={styles.errorContainer}>
        <View style={[styles.iconContainer, styles.errorIconContainer]}>
          <ErrorIcon name="close-circle-outline" size={64} />
        </View>
        <Text style={styles.errorTitle}>Invalid Reset Link</Text>
        <Text style={styles.errorDescription}>
          This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
        </Text>
        <FuturisticButton
          title="Request New Link"
          onPress={() => router.replace("/forgot-password")}
        />
        <FuturisticButton title="Back to Sign In" onPress={() => router.replace("/sign-in")} />
      </View>
    </View>
  );
};

export default InvalidResetPasswordLink;
