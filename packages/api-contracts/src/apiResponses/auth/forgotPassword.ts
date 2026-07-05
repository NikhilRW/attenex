import * as v from "valibot";

export const forgotPasswordSuccessResponseSchema = v.object({
  message: v.string(),
});
export type ForgotPasswordSuccessResponse = v.InferOutput<typeof forgotPasswordSuccessResponseSchema>;
