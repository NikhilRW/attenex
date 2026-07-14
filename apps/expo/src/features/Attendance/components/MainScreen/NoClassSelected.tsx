import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import styles from "@attendance/styles/StudentDashboard.styles";
import { NoClassSelectedProps } from "@attendance/types/props";

const MutedIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const NoClassSelected = ({ setShowClassModal }: NoClassSelectedProps) => {
  return (
    <View style={styles.emptyContainer}>
      <MutedIcon name="school-outline" size={64} />
      <Text style={styles.emptyText}>No class selected.</Text>
      <TouchableOpacity
        onPress={() => setShowClassModal(true)}
        style={[styles.refreshButton, styles.refreshButtonFilled]}
        haptic="impact"
      >
        <Text style={[styles.refreshText, styles.refreshTextOnPrimary]}>Select Class</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoClassSelected;
