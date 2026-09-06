import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { TrueSheet } from "@lodev09/react-native-true-sheet";
import Ionicons from "@react-native-vector-icons/ionicons";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@shared/components/TouchableOpacity";
import { showMessage } from "@shared/utils/toasts";

import AnalyticsScreenHeader from "../components/AnalyticsScreenHeader";
import CustomDateBottomSheet from "../components/CustomDateBottomSheet";
import DateFilters from "../components/DateFilters";
import { StudentAttendanceCard } from "../components/StudentAttendanceCard";
import { StudentSubjectSelector } from "../components/StudentSubjectSelector";
import { useStudentAnalyticsQuery } from "../hooks/useStudentAnalyticsQuery";
import { styles } from "../styles/StudentAnalyticsScreen.styles";
import { DateFilterType, StudentAnalyticsLecture } from "../types/common";
import { getAnalyticsDateRange, getCustomDateRangeError } from "../utils/common";

const StateIcon = withUnistyles(Ionicons, (theme) => ({ color: theme.text.muted }));
const LoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const StudentAnalyticsScreen = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterType>("7d");
  const [isCustomDateFilterApplied, setIsCustomDateFilterApplied] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const trueSheetRef = useRef<TrueSheet>(null);

  const { startDate, endDate } = useMemo(
    () =>
      getAnalyticsDateRange({
        selectedDateFilter,
        customStartDate,
        customEndDate,
        isCustomDateFilterApplied,
      }),
    [customEndDate, customStartDate, isCustomDateFilterApplied, selectedDateFilter],
  );

  const { data, isPending, isError, isRefetching, refetch } = useStudentAnalyticsQuery({
    subjectId: selectedSubjectId,
    startDate,
    endDate,
    selectedDateFilter,
  });
  const lectures = useMemo(() => data?.data.lectures ?? [], [data?.data.lectures]);
  const subjects = useMemo(() => data?.data.subjects ?? [], [data?.data.subjects]);

  const openDateFilterSheet = useCallback(() => {
    setIsCustomDateFilterApplied(false);
    setCustomStartDate(null);
    setCustomEndDate(null);
    trueSheetRef.current?.present();
  }, []);

  const applyDateFilter = useCallback(() => {
    const error = getCustomDateRangeError(customStartDate, customEndDate);
    if (error) {
      showMessage({
        description: error,
        type: "danger",
        message: "Invalid Date Range",
      });
      return;
    }
    trueSheetRef.current?.dismiss();
    setIsCustomDateFilterApplied(true);
  }, [customEndDate, customStartDate]);

  const renderLecture = useCallback(
    ({ item }: { item: StudentAnalyticsLecture }) => <StudentAttendanceCard lecture={item} />,
    [],
  );
  const keyExtractor = useCallback((lecture: StudentAnalyticsLecture) => lecture.id, []);

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <AnalyticsScreenHeader />
        <StudentSubjectSelector
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={setSelectedSubjectId}
        />
        <DateFilters
          selectedFilter={selectedDateFilter}
          onSelectFilter={setSelectedDateFilter}
          openDateFilterSheet={openDateFilterSheet}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lecture History</Text>
          {!isPending && !isError ? (
            <Text style={styles.sectionCount}>{lectures.length} lectures</Text>
          ) : null}
        </View>
      </View>
    ),
    [
      isError,
      isPending,
      lectures.length,
      openDateFilterSheet,
      selectedDateFilter,
      selectedSubjectId,
      subjects,
    ],
  );

  const emptyState = useMemo(
    () =>
      isPending ? (
        <View style={styles.stateContainer}>
          <LoadingIndicator size="large" />
          <Text style={styles.stateTitle}>Loading attendance</Text>
        </View>
      ) : isError ? (
        <View style={styles.stateContainer}>
          <StateIcon name="cloud-offline-outline" size={44} />
          <Text style={styles.stateTitle}>Could not load analytics</Text>
          <Text style={styles.stateDescription}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} haptic="selection">
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.stateContainer}>
          <StateIcon name="calendar-clear-outline" size={44} />
          <Text style={styles.stateTitle}>No lectures found</Text>
          <Text style={styles.stateDescription}>
            No completed lectures match the selected subject and date range.
          </Text>
        </View>
      ),
    [isError, isPending, refetch],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lectures}
        renderItem={renderLecture}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyState}
        contentContainerStyle={[
          styles.listContent,
          lectures.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching ? !isPending : false}
        onRefresh={refetch}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
      />
      <CustomDateBottomSheet
        ref={trueSheetRef}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        setCustomStartDate={setCustomStartDate}
        setCustomEndDate={setCustomEndDate}
        applyDateFilter={applyDateFilter}
      />
    </View>
  );
};

export default StudentAnalyticsScreen;
