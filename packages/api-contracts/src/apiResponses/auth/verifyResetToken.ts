import * as v from "valibot";

export const verifyResetTokenSuccessResponseSchema = v.object({
  message: v.string(),
  userName: v.string(),
});
export type VerifyResetTokenSuccessResponse = v.InferOutput<typeof verifyResetTokenSuccessResponseSchema>;
