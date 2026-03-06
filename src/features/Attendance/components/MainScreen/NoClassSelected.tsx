import { styles } from "@attendance/styles";
import { NoClassSelectedProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

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
      >
        <Text style={[styles.refreshText, styles.refreshTextOnPrimary]}>Select Class</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoClassSelected;
