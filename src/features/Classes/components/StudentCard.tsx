import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { styles } from "../styles/AttendanceViewScreen.styles";
import { AttendanceRecord } from "../types/common";

interface StudentCardProps {
  record: AttendanceRecord;
  index: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({ record, index }) => {
  const { colors, isDark } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "#4ADE80"; // Brighter green
      case "absent":
        return "#F87171"; // Brighter red
      case "incomplete":
        return "#FBBF24"; // Brighter amber
      default:
        return colors.text.muted;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 50).springify()}
      layout={Layout.springify()}
      style={[
        styles.studentCard,
        {
          backgroundColor: isDark
            ? colors.surface.cardBg
            : "rgba(255, 255, 255, 0.7)",
          borderColor: colors.surface.glassBorder,
          borderLeftColor: getStatusColor(record.status),
        },
      ]}
    >
      <View style={styles.cardContent}>
        {/* Avatar */}
        <LinearGradient
          colors={
            record.status === "present"
              ? ["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.1)"]
              : ["rgba(248, 113, 113, 0.2)", "rgba(248, 113, 113, 0.1)"]
          }
          style={styles.avatar}
        >
          <Text
            style={[
              styles.avatarText,
              { color: getStatusColor(record.status) },
            ]}
          >
            {getInitials(record.studentName)}
          </Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.studentName, { color: colors.text.primary }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {record.studentName.length > 20
                ? record.studentName.substr(0, 20) + "..."
                : record.studentName}
            </Text>
          </View>

          <Text style={[styles.rollNo, { color: colors.text.secondary }]}>
            {record.studentRollNo || "No Roll No"}
          </Text>

          <View style={styles.metaRow}>
            {record.joinTime ? (
              <>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={colors.text.muted}
                  />
                  <Text style={[styles.metaText, { color: colors.text.muted }]}>
                    {new Date(record.joinTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Ionicons
                    name={
                      record.method === "manual"
                        ? "hand-left-outline"
                        : "location-outline"
                    }
                    size={12}
                    color={colors.text.muted}
                  />
                  <Text style={[styles.metaText, { color: colors.text.muted }]}>
                    {record.method}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.metaItem}>
                <Ionicons
                  name="close-circle-outline"
                  size={12}
                  color={colors.text.muted}
                />
                <Text style={[styles.metaText, { color: colors.text.muted }]}>
                  Did not attend
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Roll Number/Status */}
        <View style={styles.statusContainer}>
          {record.status === "present" ? (
            <View style={styles.rollBadge}>
              <Text
                style={[
                  styles.rollText,
                  { color: getStatusColor(record.status) },
                ]}
              >
                {record.studentRollNo || "N/A"}
              </Text>
            </View>
          ) : record.status === "incomplete" ? (
            <View
              style={[
                styles.absentBadge,
                { backgroundColor: "rgba(251, 191, 36, 0.1)" },
              ]}
            >
              <Text style={[styles.absentText, { color: "#FBBF24" }]}>INC</Text>
            </View>
          ) : (
            <View
              style={[
                styles.absentBadge,
                { backgroundColor: "rgba(248, 113, 113, 0.1)" },
              ]}
            >
              <Text style={[styles.absentText, { color: "#F87171" }]}>ABS</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};
