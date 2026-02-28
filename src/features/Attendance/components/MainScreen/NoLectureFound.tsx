import { styles } from "@attendance/styles";
import { NoLectureFoundProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const NoLectureFound = ({ fetchLectures }: NoLectureFoundProps) => {
  const { colors } = useTheme();
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
