import * as v from "valibot";

export const addTeacherSubjectRequestSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type AddTeacherSubjectRequest = v.InferInput<typeof addTeacherSubjectRequestSchema>;
