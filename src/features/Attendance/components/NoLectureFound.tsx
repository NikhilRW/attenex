import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "@/src/shared/constants/colors";
import styles from "../styles/StudentDashboard.styles";
import { Ionicons } from "@expo/vector-icons";

const NoLectureFound = ({ fetchLectures }: { fetchLectures: () => void }) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="school-outline" size={64} color={colors.text.muted} />
      <Text style={[styles.emptyText, { color: colors.text.muted }]}>
        No active lectures found.
      </Text>
      <TouchableOpacity onPress={fetchLectures} style={styles.refreshButton}>
        <Text style={[styles.refreshText, { color: colors.primary.main }]}>
          Refresh List
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoLectureFound;
