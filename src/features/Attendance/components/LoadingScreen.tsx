import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import styles from "../styles/StudentDashboard.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

const LoadingScreen = () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary.main} />
      <Text
        style={[
          styles.loadingText,
          { color: colors.text.secondary, marginTop: 16 },
        ]}
      >
        Loading lecture details...
      </Text>
    </View>
  );
};

export default LoadingScreen;