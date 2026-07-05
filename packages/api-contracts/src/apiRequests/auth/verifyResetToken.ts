import * as v from "valibot";

export const verifyResetTokenRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  token: v.pipe(v.string(), v.minLength(1)),
});
export type VerifyResetTokenRequest = v.InferInput<typeof verifyResetTokenRequestSchema>;
