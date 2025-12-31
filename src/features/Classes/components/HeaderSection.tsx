import StatisticsCard from "@classes/components/StatisticsCard";
import { teacherDashboardStyles as styles } from "@classes/styles";
import { HeaderSectionProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  lectures,
  totalActive,
  totalStudents,
  navigateToCreate,
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
