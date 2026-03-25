import StatisticsCard from "@classes/components/StatisticsCard";
import { styles } from "@classes/styles/TeacherDashboard.styles";
import { HeaderSectionProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const AddIcon = withUnistyles(Ionicons, () => ({
  color: "white",
}));

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  lectures,
  totalActive,
  totalStudents,
  navigateToCreate,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Teacher Dashboard</Text>
          <Text style={styles.headerSubtitle}>Overview & Management</Text>
        </View>
        <TouchableOpacity onPress={navigateToCreate} style={styles.addButton}>
          <AddIcon name="add" size={24} />
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
