import {
  ClassUpdateModal,
  LectureEnded,
  LectureOngoing,
  LoadingScreen,
  NoClassSelected,
  NoLectureFound,
  OnGoingLecture,
  RollnoModal,
  StudentDashboardHeader,
} from "@attendance/components";
import {
  useAttendanceJoin,
  useAttendanceSubmit,
  useClassManagement,
  useLectureDetailsParam,
  useLectureManagement,
  useRollNoManagement,
  useSocketManager,
} from "@attendance/hooks";
import { styles } from "@attendance/styles";
import { Lecture } from "@attendance/types";
import { socketService } from "@shared/services/socketService";
import { useAuthStore } from "@shared/stores/authStore";
import React, { useCallback } from "react";
import { useAlerts } from "react-native-paper-alerts";
import Animated, { LinearTransition } from "react-native-reanimated";

// TODO: fetch lectures on focus if the data is not fresh meaning is older than 30 seconds.

const StudentDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { alert } = useAlerts();

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
    loading: joinLoading,
    handleJoin,
    handleLeaveLecture,
    setJoinedLecture,
    setStatus,
    proceedWithJoin,
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

  const renderLectureItem = useCallback(
    ({ item }: { item: Lecture }) => (
      <OnGoingLecture
        lecture={item}
        loading={joinLoading}
        handleJoin={handleJoin}
      />
    ),
    [handleJoin, joinLoading],
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
        loading={joinLoading}
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
  const lectureData: Lecture[] = user?.className ? (lectures ?? []) : [];

  return (
    <>
      <Animated.FlatList<Lecture>
        data={lectureData}
        keyExtractor={(lecture) => lecture.id}
        renderItem={renderLectureItem}
        itemLayoutAnimation={LinearTransition.springify()}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
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
