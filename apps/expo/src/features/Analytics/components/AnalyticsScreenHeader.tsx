import { View, Text } from "react-native";

import { useAuthStore } from "@/shared/stores/authStore";

import { styles } from "../styles/AnalyticsScreenHeader.styles";

const AnalyticsScreenHeader = () => {
  const userRole = useAuthStore((state) => state.user?.role);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        {userRole === "teacher" ? "Teacher" : "Student"} Analytics
      </Text>
    </View>
  );
};

export default AnalyticsScreenHeader;
