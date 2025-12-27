import { styles } from "@attendance/styles";
import { StudentDashboardHeaderProps } from "@attendance/types/props";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";
import ClassInfo from "./ClassInfo";

const StudentDashboardHeader = ({
  setShowClassModal,
  user,
}: StudentDashboardHeaderProps) => {
  const { colors } = useTheme();
  return (
    <>
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Student Dashboard
        </Text>
        <ClassInfo setShowClassModal={setShowClassModal} user={user} />
      </View>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        Available Classes
      </Text>
    </>
  );
};

export default StudentDashboardHeader;
