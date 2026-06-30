import * as v from "valibot";

export const emailSignUpRequestSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: v.pipe(v.string(), v.trim(), v.email()),
  password: v.pipe(v.string(), v.minLength(6)),
});
export type EmailSignUpRequest = v.InferInput<typeof emailSignUpRequestSchema>;
