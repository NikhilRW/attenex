import React from "react";
import { Text, View } from "react-native";

import { EaseView } from "react-native-ease";

import { styles } from "@settings/styles/Settings.styles";
import { AppearanceSectionProps } from "@settings/types/props";

import { ThemeOption } from "./ThemeOption";

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ mode, onThemeChange }) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 300 }}
      style={styles.section}
    >
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
    </EaseView>
  );
};
