import * as v from "valibot";

export const emailSignUpSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
});
export type EmailSignUpSuccessResponse = v.InferOutput<
  typeof emailSignUpSuccessResponseSchema
>;
