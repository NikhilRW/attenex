import { styles } from "@classes/styles/TeacherDashboard.styles";
import { StatisticsCardProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const BlueGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"] as const)
      : (["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.05)"] as const),
}));

const GreenGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.1)"] as const)
      : (["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.05)"] as const),
}));

const AmberGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.1)"] as const)
      : (["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"] as const),
}));

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  lectures,
  totalActive,
  totalStudents,
}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.statsScroll}
      contentContainerStyle={styles.statsContent}
    >
      <BlueGradient style={[styles.statsCard, styles.statsCardBlue]}>
        <View style={[styles.statsIcon, styles.statsIconBlue]}>
          <Ionicons name="radio" size={20} color="#60A5FA" />
        </View>
        <View>
          <Text style={styles.statsValue}>{totalActive}</Text>
          <Text style={styles.statsLabel}>Active Now</Text>
        </View>
      </BlueGradient>

      <GreenGradient style={[styles.statsCard, styles.statsCardGreen]}>
        <View style={[styles.statsIcon, styles.statsIconGreen]}>
          <Ionicons name="people" size={20} color="#34D399" />
        </View>
        <View>
          <Text style={styles.statsValue}>{totalStudents}</Text>
          <Text style={styles.statsLabel}>Total Students</Text>
        </View>
      </GreenGradient>

      <AmberGradient style={[styles.statsCard, styles.statsCardAmber]}>
        <View style={[styles.statsIcon, styles.statsIconAmber]}>
          <Ionicons name="library" size={20} color="#FBBF24" />
        </View>
        <View>
          <Text style={styles.statsValue}>{lectures.length}</Text>
          <Text style={styles.statsLabel}>Total Lectures</Text>
        </View>
      </AmberGradient>
    </ScrollView>
  );
};

export default StatisticsCard;
