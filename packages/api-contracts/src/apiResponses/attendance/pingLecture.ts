import * as v from "valibot";

export const pingLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  isValid: v.boolean(),
});
export type PingLectureSuccessResponse = v.InferOutput<typeof pingLectureSuccessResponseSchema>;
