import React from "react";
import { Text, View } from "react-native";

import { styles } from "@role-selection/styles/RoleSelection.styles";

export const RoleSelectionHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you&apos;ll be using Attenex</Text>
        </View>
      </View>
    </View>
  );
};
