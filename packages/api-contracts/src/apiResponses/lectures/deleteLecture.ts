import * as v from "valibot";

export const deleteLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    lectureId: v.string(),
  }),
});
export type DeleteLectureSuccessResponse = v.InferOutput<typeof deleteLectureSuccessResponseSchema>;
