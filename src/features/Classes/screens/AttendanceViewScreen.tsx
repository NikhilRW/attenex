import {
  AttendanceFilter,
  AttendanceFloatingButton,
  AttendanceHeader,
  ManualAttendanceModal,
  RollSummaryModal,
  StudentCard,
} from "@classes/components";
import { useAttendanceView } from "@classes/hooks";
import { attendanceViewStyles as styles } from "@classes/styles";
import { AttendanceRecord } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const LoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const EmptyStateIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const AttendanceViewScreen = () => {
  const {
    lectureTitle,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredAttendance,
    showRollSummary,
    setShowRollSummary,
    showManualAttendance,
    setShowManualAttendance,
    manualRollNo,
    setManualRollNo,
    isSubmittingManual,
    presentCount,
    incompleteCount,
    absentCount,
    getPresentRollNumbers,
    handleCopyRollNumbers,
    handleManualAttendance,
    router,
  } = useAttendanceView();

  const renderAttendanceItem = useCallback(
    ({ item: record, index }: { item: AttendanceRecord; index: number }) => (
      <StudentCard record={record} index={index} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <AttendanceHeader
        lectureTitle={lectureTitle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBack={() => router.back()}
        onShowSummary={() => setShowRollSummary(true)}
      />

      <Animated.FlatList<AttendanceRecord>
        data={loading ? [] : filteredAttendance}
        keyExtractor={(record) => record.id}
        renderItem={renderAttendanceItem}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}

        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AttendanceFilter filter={filter} setFilter={setFilter} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <LoadingIndicator size="large" />
            </View>
          ) : (
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={styles.emptyState}
            >
              <EmptyStateIcon
                name="search-outline"
                size={48}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateText}>No students found</Text>
            </Animated.View>
          )
        }
        ListFooterComponent={<View style={styles.spacerBottom} />}
      />

      <RollSummaryModal
        visible={showRollSummary}
        onClose={() => setShowRollSummary(false)}
        presentRollNumbers={getPresentRollNumbers()}
        presentCount={presentCount}
        incompleteCount={incompleteCount}
        absentCount={absentCount}
        onCopy={handleCopyRollNumbers}
      />

      <ManualAttendanceModal
        visible={showManualAttendance}
        onClose={() => setShowManualAttendance(false)}
        manualRollNo={manualRollNo}
        setManualRollNo={setManualRollNo}
        onSubmit={handleManualAttendance}
        isSubmitting={isSubmittingManual}
      />

      <AttendanceFloatingButton onPress={() => setShowManualAttendance(true)} />
    </View>
  );
};

export default AttendanceViewScreen;
