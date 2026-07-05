import * as v from "valibot";

export const updateStudentClassRequestSchema = v.object({
  className: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type UpdateStudentClassRequest = v.InferInput<typeof updateStudentClassRequestSchema>;
