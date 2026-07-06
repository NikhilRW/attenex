import * as v from "valibot";

export const createLectureResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    lecture: v.object({
      id: v.string(),
      subject: v.string(),
      subjectId: v.nullable(v.string()),
      className: v.string(),
      duration: v.string(),
      status: v.string(),
      createdAt: v.nullable(v.string()),
    }),
  }),
});
export type CreateLectureResponse = v.InferOutput<typeof createLectureResponseSchema>;
