import * as v from "valibot";

export const getPasscodeSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.object({
    passcode: v.string(),
    updatedAt: v.string(),
  }),
});
export type GetPasscodeSuccessResponse = v.InferOutput<typeof getPasscodeSuccessResponseSchema>;
