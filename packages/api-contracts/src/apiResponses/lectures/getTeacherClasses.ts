import * as v from "valibot";

export const getTeacherClassesSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(v.object({
    id: v.string(),
    name: v.string()
  })),
});
export type GetTeacherClassesSuccessResponse = v.InferOutput<typeof getTeacherClassesSuccessResponseSchema>;
