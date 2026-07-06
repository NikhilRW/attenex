import * as v from "valibot";

export const addTeacherSubjectSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    id: v.string(),
  }),
});
export type AddTeacherSubjectSuccessResponse = v.InferOutput<typeof addTeacherSubjectSuccessResponseSchema>;
