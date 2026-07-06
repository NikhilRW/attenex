import * as v from "valibot";
import { activeLectureItemSchema } from "../../common/lectures";

export const getStudentLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.optional(v.union([activeLectureItemSchema, v.null()])),
  message: v.optional(v.string()),
});
export type GetStudentLectureSuccessResponse = v.InferOutput<typeof getStudentLectureSuccessResponseSchema>;
