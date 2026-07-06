import * as v from "valibot";

export const endLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    lecture: v.object({
      id: v.string(),
      status: v.literal("ended"),
      endedAt: v.nullable(v.string()),
    }),
  }),
});
export type EndLectureSuccessResponse = v.InferOutput<typeof endLectureSuccessResponseSchema>;
