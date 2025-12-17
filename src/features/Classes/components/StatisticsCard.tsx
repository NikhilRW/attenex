import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/TeacherDashboard.styles";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { LectureWithCount } from "../types/common";

const StatisticsCard = ({
  totalActive,
  totalStudents,
  lectures,
}: {
  totalActive: number;
  totalStudents: number;
  lectures: LectureWithCount[];
}) => {
  const { colors, isDark } = useTheme();
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.statsScroll}
      contentContainerStyle={styles.statsContent}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"]
            : ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.05)"]
        }
        style={[styles.statsCard, { borderColor: "rgba(59, 130, 246, 0.3)" }]}
      >
        <View
          style={[
            styles.statsIcon,
            { backgroundColor: "rgba(59, 130, 246, 0.2)" },
          ]}
        >
          <Ionicons name="radio" size={20} color="#60A5FA" />
        </View>
        <View>
          <Text style={[styles.statsValue, { color: colors.text.primary }]}>
            {totalActive}
          </Text>
          <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
            Active Now
          </Text>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={
          isDark
            ? ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.1)"]
            : ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.05)"]
        }
        style={[styles.statsCard, { borderColor: "rgba(16, 185, 129, 0.3)" }]}
      >
        <View
          style={[
            styles.statsIcon,
            { backgroundColor: "rgba(16, 185, 129, 0.2)" },
          ]}
        >
          <Ionicons name="people" size={20} color="#34D399" />
        </View>
        <View>
          <Text style={[styles.statsValue, { color: colors.text.primary }]}>
            {totalStudents}
          </Text>
          <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
            Total Students
          </Text>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={
          isDark
            ? ["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.1)"]
            : ["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]
        }
        style={[styles.statsCard, { borderColor: "rgba(245, 158, 11, 0.3)" }]}
      >
        <View
          style={[
            styles.statsIcon,
            { backgroundColor: "rgba(245, 158, 11, 0.2)" },
          ]}
        >
          <Ionicons name="library" size={20} color="#FBBF24" />
        </View>
        <View>
          <Text style={[styles.statsValue, { color: colors.text.primary }]}>
            {lectures.length}
          </Text>
          <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
            Total Lectures
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default StatisticsCard;
