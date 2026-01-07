// queryKeys.ts

export const queryKeys = {
  linkedin: {
    authorization: ["linkedin"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    posts: (id: string) => ["users", id, "posts"] as const,
  },
  lectures: {
    all: ["lectures"] as const,
    withId: (id: string) => ["lectures", id] as const,
  },
  resetPassword: ["reset-password"],
};
