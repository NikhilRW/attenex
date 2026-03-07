import FuturisticButton from "@auth/components/common/FuturisticButton";
import { resetPasswordStyles as styles } from "@auth/styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const ErrorIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.status.error,
}));

const InvalidResetPasswordLink = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <View style={styles.errorContainer}>
        <View style={[styles.iconContainer, styles.errorIconContainer]}>
          <ErrorIcon name="close-circle-outline" size={64} />
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
};

export default InvalidResetPasswordLink;
