import { styles } from "@attendance/styles";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

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