import * as v from "valibot";

export const getTeacherSubjectsSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(v.object({
    id: v.string(),
    name: v.string(),
    createdAt: v.string(),
  })),
});
export type GetTeacherSubjectsSuccessResponse = v.InferOutput<typeof getTeacherSubjectsSuccessResponseSchema>;
