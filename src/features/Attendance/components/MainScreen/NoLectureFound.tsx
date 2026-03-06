import { styles } from "@attendance/styles";
import { NoLectureFoundProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const MutedIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const NoLectureFound = ({ fetchLectures }: NoLectureFoundProps) => {
  return (
    <View style={styles.emptyContainer}>
      <MutedIcon name="school-outline" size={64} />
      <Text style={styles.emptyText}>No active lectures found.</Text>
      <TouchableOpacity onPress={fetchLectures} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh List</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoLectureFound;
