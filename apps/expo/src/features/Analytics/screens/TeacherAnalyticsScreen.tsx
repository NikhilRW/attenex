import { useState } from "react";
import { View } from "react-native";

import { FuturisticBackground } from "@/shared/components/FuturisticBackground";

import AnalyticsScreenHeader from "../components/AnalyticsScreenHeader";
import DateFilters from "../components/DateFilters";
import { SubjectSelectorWrapper } from "../components/SubjectSelectorWrapper";
import { useAnalyticsQuery } from "../hooks/useAnalyticsQuery";
import { styles } from "../styles/TeacherAnalyticsScreen.styles";

const TeacherAnalyticsScreen = () => {
  const {} = useAnalyticsQuery();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <AnalyticsScreenHeader />
      <DateFilters onSelectFilter={setSelectedDateFilter} selectedFilter={selectedDateFilter} />
      <SubjectSelectorWrapper
        selectedSubject={selectedSubject || ""}
        onSelectSubject={setSelectedSubject}
      />
    </View>
  );
};

export default TeacherAnalyticsScreen;
