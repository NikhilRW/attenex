import { View, Text } from "react-native";

import { styles } from "../styles/AnalyticsScreenHeader.styles";

const AnalyticsScreenHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Attendance Analytics</Text>
    </View>
  );
};

export default AnalyticsScreenHeader;
