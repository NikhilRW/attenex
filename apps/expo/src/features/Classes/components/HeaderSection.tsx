import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import StatisticsCard from "@classes/components/StatisticsCard";
import { styles } from "@classes/styles/TeacherDashboard.styles";
import { HeaderSectionProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const AddIcon = withUnistyles(Ionicons, () => ({
  color: "white",
}));
const HEADER_FOCUS_ANIMATION_DURATION_MS = 320;

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  lectures,
  totalActive,
  totalStudents,
  navigateToCreate,
}) => {
  const focusProgress = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      focusProgress.value = 0;
      focusProgress.value = withTiming(1, {
        duration: HEADER_FOCUS_ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [focusProgress]),
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [0.75, 1]),
    transform: [
      {
        translateX: interpolate(focusProgress.value, [0, 1], [22, 0]),
      },
      {
        scale: interpolate(focusProgress.value, [0, 1], [0.98, 1]),
      },
    ],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.25, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.25, 1], [18, 18, 0]),
      },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View testID="TEACHER_DASHBOARD_SCREEN.HEADER_SECTION.HEADER_TEXT_CONTAINER">
          <Text style={styles.headerTitle}>Teacher Dashboard</Text>
          <Text style={styles.headerSubtitle}>Overview & Management</Text>
        </View>
        <TouchableOpacity
          haptic="impact"
          onPress={navigateToCreate}
          style={styles.addButton}
        >
          <AddIcon name="add" size={24} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={statsAnimatedStyle}>
        <StatisticsCard
          totalActive={totalActive}
          totalStudents={totalStudents}
          lectures={lectures}
        />
      </Animated.View>
    </>
  );
};
