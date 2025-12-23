import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/ResetPassword.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

const VerifyingResetPasswordLink = () => {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <FuturisticBackground />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Verifying link...
        </Text>
      </View>
    </View>
  );
};

export default VerifyingResetPasswordLink;
