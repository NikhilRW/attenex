import { View, Text } from "react-native";

import { useAnalyticsQuery } from "../hooks/useAnalyticsQuery";

const Analytics = () => {
  const { data } = useAnalyticsQuery();
  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
};

export default Analytics;
