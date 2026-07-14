import React from "react";
import { Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { FuturisticDividerProps } from "@auth/types/props";

const DividerGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: ["transparent", theme.surface.glassBorder, "transparent"] as const,
}));

const FuturisticDivider: React.FC<FuturisticDividerProps> = ({ text }) => {
  return (
    <View style={styles.dividerContainer}>
      <DividerGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <DividerGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.dividerLine} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.text.muted,
  },
}));

export default FuturisticDivider;
