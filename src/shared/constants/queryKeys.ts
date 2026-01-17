// queryKeys.ts

export const queryKeys = {
  linkedin: {
    authorization: ["linkedin"] as const,
  },
  // Example For Complex Keys For Complex Cache.
  // users: {
  //   all: ["users"] as const,
  //   detail: (id: string) => ["users", id] as const,
  //   posts: (id: string) => ["users", id, "posts"] as const,
  // },
  // lectures: {
  //   all: ["lectures"] as const,
  //   withId: (id: string) => ["lectures", id] as const,
  // },
  resetPassword: ["reset-password"],
  verifyEmail: ["verify-email"],
  joinLectureWithNotification: ["join-lecture-using-notification"],
  sendForgotPasswordEmail: ["send-forgot-password-email"],
  fetctLectureForStudent: ["fetch-lectures-for-student"],
  getStudentLectureDetails: {
    all: ["get-student-lecture-details"],
    withId: (id: string) => ["et-student-lecture-details", id],
  },
  fetchAttendanceForTeacher: {
    all: ["fetch-attendance-for-teacher"],
    withLectureId: (lectureId: string) => [
      "fetch-attendance-for-teacher",
      lectureId,
    ],
  },
  existingClassesForTeacher: ["existing-classes-for-teacher"],
  socketAttendanceViewTeacher: ["socket-attendance-view-teacher"],
  teacherLectures: ["teacher-lectures"],
  teacherDashboardSocketUpdates: ["teacher-dashboard-socket-updates"],
};
