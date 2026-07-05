import * as v from "valibot";

export const forgotPasswordRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
});
export type ForgotPasswordRequest = v.InferInput<typeof forgotPasswordRequestSchema>;
