import {
  AttendanceFilter,
  AttendanceFloatingButton,
  AttendanceHeader,
  ManualAttendanceModal,
  RollSummaryModal,
  StudentList,
} from "@classes/components";
import { useAttendanceView } from "@classes/hooks";
import { attendanceViewStyles as styles } from "@classes/styles";
import { useTheme } from "@shared/hooks";
import React from "react";
import { ScrollView, View } from "react-native";

const AttendanceViewScreen = () => {
  const { colors } = useTheme();
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

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <AttendanceHeader
        lectureTitle={lectureTitle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBack={() => router.back()}
        onShowSummary={() => setShowRollSummary(true)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AttendanceFilter filter={filter} setFilter={setFilter} />

        <StudentList
          loading={loading}
          filteredAttendance={filteredAttendance}
        />
        <View style={{ height: 40 }} />
      </ScrollView>

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

      <AttendanceFloatingButton
        onPress={() => setShowManualAttendance(true)}
        color={colors.primary.main}
      />
    </View>
  );
};

export default AttendanceViewScreen;
