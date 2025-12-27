import { roleSelectionStyles as styles } from "@role-selection/styles";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, View } from "react-native";

export const RoleSelectionHeader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Choose Your Role
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Select how you&apos;ll be using Attenex
          </Text>
        </View>
      </View>
    </View>
  );
};
