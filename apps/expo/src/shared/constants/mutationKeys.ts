/**
 * Mutation Keys
 * Organized by domain for better maintainability
 */

export const mutationKeys = {
  // Auth mutations
  auth: {
    signInEmail: ["auth", "sign-in-email"] as const,
    signUpEmail: ["auth", "sign-up-email"] as const,
    signInGoogle: ["auth", "sign-in-google"] as const,
    signInLinkedIn: ["auth", "sign-in-linkedin"] as const,
    logout: ["auth", "logout"] as const,
    deleteAccount: ["auth", "delete-account"] as const,
    logoutDeleteLinkedin: ["auth", "logout-delete-linkedin"] as const,
    sendVerificationEmail: ["auth", "send-verification-email"] as const,
    sendForgotPasswordEmail: ["auth", "forgot-password-email"] as const,
    resetPassword: ["auth", "reset-password"] as const,
  },

  // Lecture mutations
  lectures: {
    create: ["lectures", "create"] as const,
    update: ["lectures", "update"] as const,
    end: ["lectures", "end"] as const,
    delete: ["lectures", "delete"] as const,
    join: ["lectures", "join"] as const,
  },

  // Subject mutations
  subjects: {
    create: ["subjects", "create"] as const,
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
