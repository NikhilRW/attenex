import * as v from "valibot";
import { activeLectureItemSchema } from "../../common/lectures";

export const getStudentLecturesSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(activeLectureItemSchema),
  message: v.optional(v.string()),
});
export type GetStudentLecturesSuccessResponse = v.InferOutput<typeof getStudentLecturesSuccessResponseSchema>;
