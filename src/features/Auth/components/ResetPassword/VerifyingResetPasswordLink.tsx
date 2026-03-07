import { resetPasswordStyles as styles } from "@auth/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const LoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const VerifyingResetPasswordLink = () => {
  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <View style={styles.loadingContainer}>
        <LoadingIndicator size="large" />
        <Text style={styles.loadingText}>Verifying link...</Text>
      </View>
    </View>
  );
};

export default VerifyingResetPasswordLink;
