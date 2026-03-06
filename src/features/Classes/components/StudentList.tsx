import { attendanceViewStyles as styles } from "@classes/styles";
import { StudentListProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";
import { StudentCard } from "./StudentCard";

const LoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const EmptyStateIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

export const StudentList: React.FC<StudentListProps> = ({
  loading,
  filteredAttendance,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {filteredAttendance.length === 0 ? (
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={styles.emptyState}
        >
          <EmptyStateIcon
            name="search-outline"
            size={48}
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateText}>
            No students found
          </Text>
        </Animated.View>
      ) : (
        filteredAttendance.map((record, index) => (
          <StudentCard key={record.id} record={record} index={index} />
        ))
      )}
    </View>
  );
};
