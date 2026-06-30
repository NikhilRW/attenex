import * as v from "valibot";

export const emailSignInRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  password: v.pipe(v.string(), v.minLength(1)),
});
export type EmailSignInRequest = v.InferInput<typeof emailSignInRequestSchema>;
