import * as v from "valibot";

export const resetPasswordRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  token: v.pipe(v.string(), v.minLength(1)),
  newPassword: v.pipe(v.string(), v.minLength(6)),
});
export type ResetPasswordRequest = v.InferInput<typeof resetPasswordRequestSchema>;
