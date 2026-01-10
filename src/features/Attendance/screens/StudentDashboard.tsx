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
import { useTheme } from "@shared/hooks/useTheme";
import { socketService } from "@shared/services/socketService";
import { useAuthStore } from "@shared/stores/authStore";
import React, { useCallback } from "react";
import { ScrollView } from "react-native";

const StudentDashboard = () => {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  // Lecture management
  const { lectures, fetchLectures, refreshLectures } = useLectureManagement();

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
    fetchLectures
  );

  // Class management
  const {
    className,
    showClassModal,
    classUpdateLoading,
    setClassName,
    setShowClassModal,
    handleUpdateClass,
  } = useClassManagement(fetchLectures);

  // Handle lecture details from URL params (notification join)
  const { fetchingLectureDetails } = useLectureDetailsParam(
    lectures,
    handleJoin
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
    [pendingLecture, proceedWithJoin]
  );

  // Leave lecture handler
  const onLeaveLecture = useCallback(() => {
    if (joinedLecture) {
      socketService.leaveLecture(joinedLecture.id);
    }
    setLectureStatus("active");
    fetchLectures();
  }, [joinedLecture, setLectureStatus, fetchLectures]);

  // Attendance submit success handler
  const onAttendanceSubmitSuccess = useCallback(() => {
    if (joinedLecture) {
      socketService.leaveLecture(joinedLecture.id);
    }
    setJoinedLecture(null);
    setStatus("idle");
    fetchLectures();
  }, [joinedLecture, setJoinedLecture, setStatus, fetchLectures]);


  // Show loading screen while fetching lecture details
  if (fetchingLectureDetails) {
    return <LoadingScreen />;
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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <StudentDashboardHeader
        user={user}
        setShowClassModal={setShowClassModal}
      />

      {!user?.className ? (
        <NoClassSelected setShowClassModal={setShowClassModal} />
      ) : !lectures || lectures.length === 0 ? (
        <NoLectureFound fetchLectures={refreshLectures} />
      ) : (
        lectures.map((lecture) => (
          <OnGoingLecture
            key={lecture.id}
            lecture={lecture}
            loading={joinLoading}
            handleJoin={handleJoin}
          />
        ))
      )}

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
    </ScrollView>
  );
};

export default StudentDashboard;
