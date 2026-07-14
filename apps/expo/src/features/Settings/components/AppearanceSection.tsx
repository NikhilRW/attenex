import React from "react";
import { Text, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { styles } from "@settings/styles/Settings.styles";
import { AppearanceSectionProps } from "@settings/types/props";

import { ThemeOption } from "./ThemeOption";

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ mode, onThemeChange }) => {
  return (
    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
      <Text style={styles.sectionTitle}>APPEARANCE</Text>
      <View style={styles.roleContainer}>
        {(["light", "dark", "system"] as const).map((m) => {
          const isActive = mode === m;
          return (
            <ThemeOption
              key={m}
              mode={m}
              isActive={isActive}
              onPress={() => onThemeChange(m)}
              icon={
                m === "light"
                  ? isActive
                    ? "sunny"
                    : "sunny-outline"
                  : m === "dark"
                    ? isActive
                      ? "moon"
                      : "moon-outline"
                    : isActive
                      ? "settings"
                      : "settings-outline"
              }
              label={m.charAt(0).toUpperCase() + m.slice(1)}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};
