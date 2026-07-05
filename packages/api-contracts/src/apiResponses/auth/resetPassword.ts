import * as v from "valibot";

export const resetPasswordSuccessResponseSchema = v.object({
  message: v.string(),
});
export type ResetPasswordSuccessResponse = v.InferOutput<typeof resetPasswordSuccessResponseSchema>;
