import { useState } from "react";
import { View } from "react-native";

import { SubjectSelectorWrapper } from "../components/SubjectSelectorWrapper";
import { useAnalyticsQuery } from "../hooks/useAnalyticsQuery";
import { styles } from "../styles/AnalyticsScreen.styles";

const TeacherAnalyticsScreen = () => {
  const {} = useAnalyticsQuery();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <SubjectSelectorWrapper
        selectedSubject={selectedSubject || ""}
        onSelectSubject={setSelectedSubject}
      />
    </View>
  );
};

export default TeacherAnalyticsScreen;
