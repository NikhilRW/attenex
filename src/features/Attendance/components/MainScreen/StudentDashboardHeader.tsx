import styles from "@attendance/styles/StudentDashboard.styles";
import { StudentDashboardHeaderProps } from "@attendance/types/props";
import React from "react";
import { Text, View } from "react-native";
import ClassInfo from "./ClassInfo";

const StudentDashboardHeader = ({
  setShowClassModal,
  user,
}: StudentDashboardHeaderProps) => {
  return (
    <>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Student Dashboard</Text>
        <ClassInfo setShowClassModal={setShowClassModal} user={user} />
      </View>
      <Text style={styles.subtitle}>Available Classes</Text>
    </>
  );
};

export default StudentDashboardHeader;
