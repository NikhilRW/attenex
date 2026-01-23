/**
 * Query Keys Factory Pattern
 * Following TanStack Query best practices for hierarchical key structure
 * https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  // Auth domain
  auth: {
    all: ["auth"] as const,
    linkedin: ["auth", "linkedin"] as const,
    verifyEmail: (token?: string) =>
      token
        ? (["auth", "verify-email", token] as const)
        : (["auth", "verify-email"] as const),
    resetPassword: (token?: string) =>
      token
        ? (["auth", "reset-password", token] as const)
        : (["auth", "reset-password"] as const),
    forgotPassword: ["auth", "forgot-password"] as const,
  },

  // Lectures domain
  lectures: {
    all: ["lectures"] as const,
    teacher: ["lectures", "teacher"] as const,
    student: ["lectures", "student"] as const,
    detail: (id: string) => ["lectures", "detail", id] as const,
    studentDetail: (id: string) => ["lectures", "student-detail", id] as const,
    passcode: (id: string) => ["lectures", "passcode", id] as const,
    joinWithNotification: ["lectures", "join-notification"] as const,
  },

  // Attendance domain
  attendance: {
    all: ["attendance"] as const,
    byLecture: (lectureId: string) => ["attendance", lectureId] as const,
    teacher: (lectureId: string) =>
      ["attendance", "teacher", lectureId] as const,
  },

  // Classes domain
  classes: {
    all: ["classes"] as const,
    teacher: ["classes", "teacher"] as const,
    student: ["classes", "student"] as const,
  },

  // Real-time socket updates
  socket: {
    all: ["socket"] as const,
    teacherDashboard: ["socket", "teacher-dashboard"] as const,
    attendanceView: (lectureId?: string) =>
      lectureId
        ? (["socket", "attendance-view", lectureId] as const)
        : (["socket", "attendance-view"] as const),
  },

  // Legacy keys for backward compatibility (to be migrated)
  _legacy: {
    teacherLectures: ["teacher-lectures"] as const,
    existingClassesForTeacher: ["existing-classes-for-teacher"] as const,
    socketAttendanceViewTeacher: ["socket-attendance-view-teacher"] as const,
    teacherDashboardSocketUpdates: [
      "teacher-dashboard-socket-updates",
    ] as const,
    fetchPasscodedForLectureEnded: [
      "fetch-passcode-for-lecture-ended",
    ] as const,
    fetctLectureForStudent: ["fetch-lectures-for-student"] as const,
  },
} as const;

// Backward compatibility aliases
// export const legacyQueryKeys = {
//   linkedin: queryKeys.auth.linkedin,
//   resetPassword: queryKeys.auth.resetPassword,
//   verifyEmail: queryKeys.auth.verifyEmail,
//   joinLectureWithNotification: queryKeys.lectures.joinWithNotification,
//   sendForgotPasswordEmail: queryKeys.auth.forgotPassword,
//   fetctLectureForStudent: queryKeys._legacy.fetctLectureForStudent,
//   getStudentLectureDetails: {
//     all: ["get-student-lecture-details"] as const,
//     withId: (id: string) => queryKeys.lectures.studentDetail(id),
//   },
//   fetchAttendanceForTeacher: {
//     all: ["fetch-attendance-for-teacher"] as const,
//     withLectureId: (lectureId: string) =>
//       queryKeys.attendance.teacher(lectureId),
//   },
//   existingClassesForTeacher: queryKeys._legacy.existingClassesForTeacher,
//   socketAttendanceViewTeacher: queryKeys._legacy.socketAttendanceViewTeacher,
//   teacherLectures: queryKeys._legacy.teacherLectures,
//   teacherDashboardSocketUpdates:
//     queryKeys._legacy.teacherDashboardSocketUpdates,
//   fetchPasscodedForLectureEnded:
//     queryKeys._legacy.fetchPasscodedForLectureEnded,
// };
