import { View, Text, ViewStyle } from "react-native";
import React from "react";
import UniLinearGradient from "@/shared/components/UniLinearGradient";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { styles } from "../styles/Settings.styles";

const SettingsHeader = ({
  headerAnimatedStyle,
}: {
  headerAnimatedStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
}) => {
  return (
    <Animated.View style={headerAnimatedStyle}>
      <UniLinearGradient
        style={styles.header}
        uniProps={(theme, rt) => ({
          colors:
            rt.themeName === "dark"
              ? ([theme.background.secondary, "transparent"] as const)
              : (["rgba(255,255,255,0.95)", "rgba(255,255,255,0.0)"] as const),
        })}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Preferences & Account</Text>
        </View>
      </UniLinearGradient>
    </Animated.View>
  );
};

export default SettingsHeader;
