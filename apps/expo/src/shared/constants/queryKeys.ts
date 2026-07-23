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
      token ? (["auth", "verify-email", token] as const) : (["auth", "verify-email"] as const),
    resetPassword: (token?: string, email?: string) =>
      token && email
        ? (["auth", "reset-password", token, email] as const)
        : (["auth", "reset-password"] as const),
    forgotPassword: ["auth", "forgot-password"] as const,
  },

  // Lectures domain
  lectures: {
    all: ["lectures"] as const,
    teacher: ["lectures", "teacher"] as const,
    student: ["lectures", "student"] as const,
    studentByClass: (className: string) => ["lectures", "student", "class", className] as const,
    detail: (id: string) => ["lectures", "detail", id] as const,
    studentDetail: (id: string) => ["lectures", "student-detail", id] as const,
    passcode: (id: string) => ["lectures", "passcode", id] as const,
    subjects: ["lectures", "subjects"] as const,
    joinWithNotification: ["lectures", "join-notification"] as const,
  },

  // Attendance domain
  attendance: {
    all: ["attendance"] as const,
    byLecture: (lectureId: string) => ["attendance", lectureId] as const,
    teacher: (lectureId: string) => ["attendance", "teacher", lectureId] as const,
  },

  // Classes domain
  classes: {
    all: ["classes"] as const,
    teacher: ["classes", "teacher"] as const,
    student: ["classes", "student"] as const,
  },

  analytics: {
    all: ["analytics"] as const,
    teacher: ["analytics", "teacher"] as const,
    student: ["analytics", "student"] as const,
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
    teacherDashboardSocketUpdates: ["teacher-dashboard-socket-updates"] as const,
    fetchPasscodedForLectureEnded: ["fetch-passcode-for-lecture-ended"] as const,
    fetctLectureForStudent: ["fetch-lectures-for-student"] as const,
  },
} as const;
