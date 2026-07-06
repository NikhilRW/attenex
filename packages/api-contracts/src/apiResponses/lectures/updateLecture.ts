import * as v from "valibot";

export const updateLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    lecture: v.object({
      id: v.string(),
      subjectId: v.nullable(v.string()),
      duration: v.string(),
      status: v.picklist(["active", "ended"]),
    }),
  }),
});
export type UpdateLectureSuccessResponse = v.InferOutput<typeof updateLectureSuccessResponseSchema>;
