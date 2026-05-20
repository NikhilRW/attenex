import ClassUpdateModal from "@attendance/components/Modals/ClassUpdateModal";
import LectureEnded from "@attendance/components/LectureAttending/LectureEnded";
import LectureOngoing from "@attendance/components/LectureAttending/LectureOngoing";
import LoadingScreen from "@attendance/components/MainScreen/LoadingScreen";
import NoClassSelected from "@attendance/components/MainScreen/NoClassSelected";
import NoLectureFound from "@attendance/components/MainScreen/NoLectureFound";
import OnGoingLecture from "@attendance/components/MainScreen/OnGoingLecture";
import RollnoModal from "@attendance/components/Modals/RollnoModal";
import StudentDashboardHeader from "@attendance/components/MainScreen/StudentDashboardHeader";
import { useAttendanceJoin } from "@attendance/hooks/useAttendanceJoin";
import { useAttendanceSubmit } from "@attendance/hooks/useAttendanceSubmit";
import { useClassManagement } from "@attendance/hooks/useClassManagement";
import { useLectureDetailsParam } from "@attendance/hooks/useLectureDetailsParam";
import { useLectureManagement } from "@attendance/hooks/useLectureManagement";
import { useRollNoManagement } from "@attendance/hooks/useRollNoManagement";
import { useSocketManager } from "@attendance/hooks/useSocketManager";
import styles from "@attendance/styles/StudentDashboard.styles";
import { Lecture } from "@attendance/types/common";
import {
  generateMockStudentLectures,
  getStudentDashboardStressOptions,
} from "@attendance/utils/stressTest";
import { socketService } from "@shared/services/socketService";
import { useAuthStore } from "@shared/stores/authStore";
import { markPerformance } from "@shared/utils/performance";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAlerts } from "react-native-paper-alerts";
import Animated, { LinearTransition } from "react-native-reanimated";

// TODO: fetch lectures on focus if the data is not fresh meaning is older than 30 seconds.

const DEFAULT_LECTURE_ROW_HEIGHT = 220;

const StudentDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { alert } = useAlerts();
  const lectureHeight = useRef<number>(0);

  useEffect(() => {
    markPerformance("student-dashboard-mount");
    const interactionHandle = requestIdleCallback(() => {
      markPerformance("student-dashboard-interactive");
    });

    return () => {
      cancelIdleCallback(interactionHandle);
    };
  }, []);

  const params = useLocalSearchParams<{
    stress?: string;
    mock?: string;
    count?: string;
    lectures?: string;
    size?: string;
  }>();

  const stressOptions = useMemo(
    () =>
      getStudentDashboardStressOptions({
        stress: params.stress,
        mock: params.mock,
        count: params.count,
        lectures: params.lectures,
        size: params.size,
      }),
    [params.count, params.lectures, params.mock, params.size, params.stress],
  );

  const mockLectures = useMemo(
    () =>
      stressOptions.enabled
        ? generateMockStudentLectures(stressOptions.lectureCount)
        : [],
    [stressOptions.enabled, stressOptions.lectureCount],
  );

  // Roll number management
  const {
    rollNo,
    showRollNoModal,
    pendingLecture,
    setRollNo,
    setShowRollNoModal,
    setPendingLecture,
    handleRollNoSubmit,
    requestRollNo,
  } = useRollNoManagement();

  // Attendance join management
  const {
    joinedLecture,
    status,
    loadingLectureId,
    handleJoin,
    handleLeaveLecture,
    setJoinedLecture,
    setStatus,
    proceedWithJoin,
    loading: joining,
  } = useAttendanceJoin(requestRollNo);

  // Lecture management
  const { lectures, refreshLectures } = useLectureManagement(joinedLecture);

  // Attendance submit management
  const {
    passcode,
    loading: submitLoading,
    setPasscode,
    handleSubmit,
  } = useAttendanceSubmit(proceedWithJoin);

  // Socket manager
  const { lectureStatus, setLectureStatus } = useSocketManager(
    joinedLecture,
    refreshLectures,
    alert,
  );

  const handleJoinAction = useCallback(
    async (lecture: Lecture) => {
      if (stressOptions.enabled) {
        return;
      }
      return handleJoin(lecture);
    },
    [handleJoin, stressOptions.enabled],
  );

  const renderLectureItem = useCallback(
    ({ item }: { item: Lecture }) => (
      <OnGoingLecture
        lecture={item}
        currentLectureJoining={loadingLectureId === item.id}
        joining={joining}
        handleJoin={handleJoinAction}
        lectureHeightRef={lectureHeight}
      />
    ),
    [handleJoinAction, loadingLectureId, joining],
  );

  const keyExtractor = useCallback((lecture: Lecture) => lecture.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<Lecture> | null | undefined, index: number) => {
      const rowHeight = lectureHeight.current || DEFAULT_LECTURE_ROW_HEIGHT;
      return {
        length: rowHeight,
        offset: rowHeight * index,
        index,
      };
    },
    [],
  );

  const flatListPerformanceProps = useMemo(
    () => ({
      removeClippedSubviews: true,
      initialNumToRender: 8,
      maxToRenderPerBatch: 8,
      updateCellsBatchingPeriod: 40,
      windowSize: 12,
    }),
    [],
  );

  // Class management
  const {
    className,
    showClassModal,
    classUpdateLoading,
    setClassName,
    setShowClassModal,
    handleUpdateClass,
  } = useClassManagement(refreshLectures);

  // Handle lecture details from URL params (notification join)
  const { isFetchingLectureDetails } = useLectureDetailsParam(
    lectures,
    handleJoin,
  );

  // Roll number submission handler
  const onRollNoSubmit = useCallback(
    async (studentRollNo: string) => {
      if (pendingLecture) {
        await proceedWithJoin({
          lecture: pendingLecture,
          studentRollNo: studentRollNo,
        });
      }
    },
    [pendingLecture, proceedWithJoin],
  );

  // Leave lecture handler
  const onLeaveLecture = useCallback(() => {
    if (joinedLecture) {
      socketService.leaveLecture(joinedLecture.id, user?.role || "student");
    }
    setLectureStatus("active");
    refreshLectures();
  }, [joinedLecture, refreshLectures, setLectureStatus, user?.role]);

  // Attendance submit success handler
  const onAttendanceSubmitSuccess = useCallback(() => {
    if (joinedLecture) {
      socketService.leaveLecture(joinedLecture.id, user?.role || "student");
    }
    setJoinedLecture(null);
    setStatus("idle");
    refreshLectures();
  }, [joinedLecture, setJoinedLecture, setStatus, refreshLectures, user?.role]);

  // Show loading screen while fetching lecture details
  if (isFetchingLectureDetails) {
    return <LoadingScreen />;
  }

  if (user?.role !== "student") {
    return null;
  }
  // If joined and lecture is still active - show ongoing status
  if (status === "joined" && lectureStatus === "active") {
    return (
      <LectureOngoing
        joinedLecture={joinedLecture!}
        handleLeaveLecture={() => handleLeaveLecture(onLeaveLecture)}
      />
    );
  }

  // If joined and lecture ended - show verify button
  if (status === "joined" && lectureStatus === "ended") {
    return (
      <LectureEnded
        joinedLecture={joinedLecture!}
        passcode={passcode}
        setPasscode={setPasscode}
        handleSubmit={() =>
          handleSubmit({
            joinedLecture: joinedLecture!,
            onSuccess: onAttendanceSubmitSuccess,
          })
        }
        loading={submitLoading}
      />
    );
  }
  const lectureData: Lecture[] = stressOptions.enabled
    ? mockLectures
    : user?.className
      ? (lectures ?? [])
      : [];

  return (
    <>
      <Animated.FlatList<Lecture>
        data={lectureData}
        keyExtractor={keyExtractor}
        renderItem={renderLectureItem}
        getItemLayout={getItemLayout}
        itemLayoutAnimation={LinearTransition.springify()}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        {...flatListPerformanceProps}
        ListHeaderComponent={
          <StudentDashboardHeader
            user={user}
            setShowClassModal={setShowClassModal}
          />
        }
        ListEmptyComponent={
          !user?.className ? (
            <NoClassSelected setShowClassModal={setShowClassModal} />
          ) : (
            <NoLectureFound fetchLectures={() => void refreshLectures()} />
          )
        }
      />

      {/* Update Class Modal */}
      <ClassUpdateModal
        showClassModal={showClassModal}
        setShowClassModal={setShowClassModal}
        className={className}
        setClassName={setClassName}
        handleUpdateClass={handleUpdateClass}
        classUpdateLoading={classUpdateLoading}
      />

      {/* Roll No Modal */}
      <RollnoModal
        showRollNoModal={showRollNoModal}
        setShowRollNoModal={setShowRollNoModal}
        rollNo={rollNo}
        setRollNo={setRollNo}
        handleRollNoSubmit={() => handleRollNoSubmit(onRollNoSubmit)}
        setPendingLecture={setPendingLecture}
      />
    </>
  );
};

export default StudentDashboard;
