import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import styles from "@attendance/styles/StudentDashboard.styles";
import { NoLectureFoundProps } from "@attendance/types/props";

const MutedIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const NoLectureFound = ({ fetchLectures }: NoLectureFoundProps) => {
  return (
    <View style={styles.emptyContainer}>
      <MutedIcon name="school-outline" size={64} />
      <Text style={styles.emptyText}>No active lectures found.</Text>
      <TouchableOpacity haptic="selection" onPress={fetchLectures} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh List</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoLectureFound;
