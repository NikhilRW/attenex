import { useStudentDashboardHeaderAnimation } from "@attendance/hooks/useStudentDashboardFocusAnimation";
import styles from "@attendance/styles/StudentDashboard.styles";
import { StudentDashboardHeaderProps } from "@attendance/types/props";
import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import ClassInfo from "./ClassInfo";

const StudentDashboardHeader = ({
  setShowClassModal,
  user,
}: StudentDashboardHeaderProps) => {
  const { headerAnimatedStyle, subtitleAnimatedStyle } =
    useStudentDashboardHeaderAnimation();

  return (
    <>
      <Animated.View style={[styles.headerSection, headerAnimatedStyle]}>
        <Text style={styles.title}>Student Dashboard</Text>
        <ClassInfo setShowClassModal={setShowClassModal} user={user} />
      </Animated.View>
      <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
        Available Classes
      </Animated.Text>
    </>
  );
};

export default StudentDashboardHeader;
