import { attendanceViewStyles as styles } from "@classes/styles";
import { StudentListProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { StudentCard } from "./StudentCard";

export const StudentList: React.FC<StudentListProps> = ({
  loading,
  filteredAttendance,
}) => {
  const { colors, isDark } = useTheme();


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {filteredAttendance.length === 0 ? (
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={[
            styles.emptyState,
            {
              backgroundColor: isDark
                ? colors.surface.glass
                : "rgba(0,0,0,0.02)",
              borderColor: colors.surface.glassBorder,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={48}
            color={colors.text.muted}
            style={{ marginBottom: 16, opacity: 0.5 }}
          />
          <Text style={[styles.emptyStateText, { color: colors.text.muted }]}>
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
