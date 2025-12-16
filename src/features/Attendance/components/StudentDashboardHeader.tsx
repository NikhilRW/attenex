import { View, Text } from "react-native";
import React from "react";
import styles from "../styles/StudentDashboard.styles";
import ClassInfo from "./ClassInfo";
import { User } from "@/backend/src/config/database_setup";
import { useTheme } from "@/src/shared/hooks/useTheme";

const StudentDashboardHeader = ({
  setShowClassModal,
  user,
}: {
  setShowClassModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
}) => {
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
