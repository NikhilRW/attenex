import { AttendanceFilter } from "@classes/components/AttendanceFilter";
import { AttendanceFloatingButton } from "@classes/components/AttendanceFloatingButton";
import { AttendanceHeader } from "@classes/components/AttendanceHeader";
import { ManualAttendanceModal } from "@classes/components/ManualAttendanceModal";
import { RollSummaryModal } from "@classes/components/RollSummaryModal";
import { MemoizedStudentCard } from "@classes/components/StudentCard";
import { useAttendanceView } from "@classes/hooks/useAttendanceView";
import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { AttendanceRecord } from "@classes/types/common";
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

const flatListPerformanceProps = {
  removeClippedSubviews: true,
  initialNumToRender: 10,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 40,
  windowSize: 12,
};

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
    manualAttendanceError,
    isSubmittingManual,
    presentRollNumbers,
    handleCopyRollNumbers,
    handleManualAttendance,
    router,
  } = useAttendanceView();

  const keyExtractor = useCallback((record: AttendanceRecord) => record.id, []);

  const renderAttendanceItem = useCallback(
    ({ item: record, index }: { item: AttendanceRecord; index: number }) => (
      <MemoizedStudentCard record={record} index={index} />
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
        keyExtractor={keyExtractor}
        renderItem={renderAttendanceItem}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...flatListPerformanceProps}
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
        presentRollNumbers={presentRollNumbers}
        onCopy={handleCopyRollNumbers}
      />

      <ManualAttendanceModal
        visible={showManualAttendance}
        onClose={() => setShowManualAttendance(false)}
        manualRollNo={manualRollNo}
        setManualRollNo={setManualRollNo}
        errorMessage={manualAttendanceError}
        onSubmit={handleManualAttendance}
        isSubmitting={isSubmittingManual}
      />

      <AttendanceFloatingButton onPress={() => setShowManualAttendance(true)} />
    </View>
  );
};

export default AttendanceViewScreen;
