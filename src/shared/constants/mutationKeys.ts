/**
 * Mutation Keys
 * Organized by domain for better maintainability
 */

export const mutationKeys = {
  // Auth mutations
  auth: {
    signInLinkedIn: ["auth", "sign-in-linkedin"] as const,
    logout: ["auth", "logout"] as const,
    deleteAccount: ["auth", "delete-account"] as const,
    logoutDeleteLinkedin: ["auth", "logout-delete-linkedin"] as const,
    sendForgotPasswordEmail: ["auth", "forgot-password-email"] as const,
  },

  // Lecture mutations
  lectures: {
    create: ["lectures", "create"] as const,
    update: ["lectures", "update"] as const,
    end: ["lectures", "end"] as const,
    delete: { default: ["lectures", "delete"], withId: (id: string) => ["lectures", "delete", id] },
    join: ["lectures", "join"] as const,
  },

  // Attendance mutations
  attendance: {
    submit: ["attendance", "submit"] as const,
    manual: ["attendance", "manual"] as const,
  },

  // Class mutations
  classes: {
    create: ["classes", "create"] as const,
    join: ["classes", "join"] as const,
    update: ["classes", "update"] as const,
  },

  // User mutations
  user: {
    updateRole: ["user", "update-role"] as const,
    updateClass: ["user", "update-class"] as const,
    submitRollNo: ["user", "submit-roll-no"] as const,
    updateName: ["user", "update-name"] as const,
  },
} as const;

// Backward compatibility aliases
export const legacyMutationKeys = {
  lectureJoin: mutationKeys.lectures.join,
  studentAttendanceSubmit: mutationKeys.attendance.submit,
  handleClassJoin: mutationKeys.classes.join,
  createLecture: mutationKeys.lectures.create,
  updateLectureByTeacher: mutationKeys.lectures.update,
  rollNoSubmitStudent: mutationKeys.user.submitRollNo,
  updateStudentClass: mutationKeys.user.updateClass,
  sendForgotPasswordEmail: mutationKeys.auth.sendForgotPasswordEmail,
  logoutDeleteAccountLinkedin: mutationKeys.auth.logoutDeleteLinkedin,
  signInLinkedIn: mutationKeys.auth.signInLinkedIn,
  manualAttendanceTeacher: mutationKeys.attendance.manual,
  handleCreateNewClass: mutationKeys.classes.create,
  updateUserRole: mutationKeys.user.updateRole,
  deleteAccountSettings: mutationKeys.auth.deleteAccount,
  logoutUser: mutationKeys.auth.logout,
};
