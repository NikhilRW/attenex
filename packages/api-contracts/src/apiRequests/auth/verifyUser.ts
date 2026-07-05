import * as v from "valibot";

export const verifyUserRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  token: v.pipe(v.string(), v.minLength(1)),
});
export type VerifyUserRequest = v.InferInput<typeof verifyUserRequestSchema>;
