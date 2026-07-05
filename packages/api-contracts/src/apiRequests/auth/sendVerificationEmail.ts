import * as v from "valibot";

export const sendVerificationEmailRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
});
export type SendVerificationEmailRequest = v.InferInput<typeof sendVerificationEmailRequestSchema>;
