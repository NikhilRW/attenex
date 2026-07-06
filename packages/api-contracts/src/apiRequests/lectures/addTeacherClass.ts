import * as v from "valibot";

export const addTeacherClassRequestSchema = v.object({
  className: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type AddTeacherClassRequest = v.InferInput<typeof addTeacherClassRequestSchema>;
