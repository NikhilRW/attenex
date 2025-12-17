import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import StatisticsCard from "./StatisticsCard";
import { styles } from "../styles/TeacherDashboard.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { LectureWithCount } from "../types/common";

export const HeaderSection = ({
  navigateToCreate,
  totalActive,
  totalStudents,
  lectures,
}: {
  navigateToCreate: () => void;
  totalActive: number;
  totalStudents: number;
  lectures: LectureWithCount[];
}) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Teacher Dashboard
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
          >
            Overview & Management
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={[styles.addButton, { backgroundColor: colors.primary.main }]}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <StatisticsCard
        totalActive={totalActive}
        totalStudents={totalStudents}
        lectures={lectures}
      />
    </Animated.View>
  );
};
