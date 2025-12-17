import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/AttendanceViewScreen.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { AttendanceRecord } from "../types/common";
import { StudentCard } from "./StudentCard";

interface StudentListProps {
  loading: boolean;
  filteredAttendance: AttendanceRecord[];
}

export const StudentList: React.FC<StudentListProps> = ({
  loading,
  filteredAttendance,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

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
